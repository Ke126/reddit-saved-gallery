<script lang="ts">
	import { page } from '$app/stores';
	import DoubleLeft from '$lib/svg/DoubleLeft.svelte';
	import DoubleRight from '$lib/svg/DoubleRight.svelte';
	import Left from '$lib/svg/Left.svelte';
	import Right from '$lib/svg/Right.svelte';

	export let count: number;
	export let curPage: number;
	export let totalCount: number;

	$: numPages = Math.ceil(totalCount / 100);

	function makeURL(url: URL, page: number) {
		const newUrl = new URL(url);
		newUrl.searchParams.set('page', `${page}`);
		return newUrl.toString();
	}

	const PAGE_SIZE = 100;

	const active =
		'text-sm text-slate-200 font-semibold inline-flex items-center px-4 py-2 bg-orange-600';
	const inactive =
		'text-sm text-slate-200 font-semibold inline-flex items-center px-4 py-2 ring-1 ring-slate-700 hover:bg-orange-600/25 transition-all ring-inset';
	const left = ' rounded-l-md';
	const right = ' rounded-r-md';
</script>

<div class="bg-slate-900 flex flex-col py-4 items-center">
	<p class="text-sm text-slate-200">
		{#if count !== 0}
			Showing
			<span class="font-semibold">{(curPage - 1) * PAGE_SIZE + 1}</span>
			to
			<span class="font-semibold">{Math.min(curPage * PAGE_SIZE, totalCount)}</span>
			of
			<span class="font-semibold">{totalCount}</span>
			results
		{:else}
			No results found
		{/if}
	</p>
	<nav class="bg-slate-900 -space-x-px flex">
		{#if curPage > 1}
			<a class={inactive + left} data-sveltekit-preload-data="tap" href={makeURL($page.url, 1)}
				><DoubleLeft class="size-4" /></a
			>
			<a class={inactive} data-sveltekit-preload-data="tap" href={makeURL($page.url, curPage - 1)}
				><Left class="size-4" /></a
			>
		{/if}
		{#each { length: numPages } as _, pageNum}
			{#if pageNum + 1 === curPage}
				<span class={active + (curPage === 1 ? left : '') + (curPage === numPages ? right : '')}
					>{curPage}</span
				>
			{:else}
				<a class={inactive} data-sveltekit-preload-data="tap" href={makeURL($page.url, pageNum + 1)}
					>{pageNum + 1}</a
				>
			{/if}
		{/each}
		{#if curPage < numPages}
			<a class={inactive} data-sveltekit-preload-data="tap" href={makeURL($page.url, curPage + 1)}
				><Right class="size-4" /></a
			>
			<a
				class={inactive + right}
				data-sveltekit-preload-data="tap"
				href={makeURL($page.url, numPages)}><DoubleRight class="size-4" /></a
			>
		{/if}
	</nav>
</div>
