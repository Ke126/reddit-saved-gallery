<script lang="ts">
	import { goto, afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import Left from '$lib/svg/Left.svelte';
	import Right from '$lib/svg/Right.svelte';

	interface Props {
		count: number;
		curPage: number;
		totalCount: number;
	}

	let { count, curPage, totalCount }: Props = $props();

	let inputNum: string = $state('');
	afterNavigate(() => {
		inputNum = '';
	});
	let numPages = $derived(Math.ceil(totalCount / 100));

	function makeURL(url: URL, page: number) {
		const newUrl = new URL(url);
		newUrl.searchParams.set('page', `${page}`);
		return newUrl.toString();
	}

	const PAGE_SIZE = 100;

	const activePage =
		'text-sm text-slate-200 font-semibold inline-flex items-center px-3.5 py-2 bg-orange-600';
	const hoverable =
		'text-sm text-slate-200 font-semibold inline-flex items-center px-3.5 py-2 ring-1 ring-slate-700 hover:bg-orange-600/25 ring-inset';
	const ellipsis =
		'text-sm text-slate-200 font-semibold inline-flex items-center px-3.5 py-2 ring-1 ring-slate-700 ring-inset';
	const left = ' rounded-l-md';
	const right = ' rounded-r-md';
</script>

<div class="flex flex-col items-center bg-slate-900 py-4">
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
	<!-- Display pagination only if count !== 0 -->
	{#if count !== 0}
		<nav class="my-1 flex -space-x-px">
			<!-- Display left arrow and page 1 if not on page 1 -->
			{#if curPage > 1}
				<a
					class={hoverable + left}
					data-sveltekit-preload-data="tap"
					href={makeURL(page.url, curPage - 1)}><Left class="size-4" /></a
				>
				<a class={hoverable} data-sveltekit-preload-data="tap" href={makeURL(page.url, 1)}>{1}</a>
			{/if}
			<!-- Display left ellipsis if greater than page 4 -->
			{#if curPage > 4}
				<span class={ellipsis}>...</span>
			{/if}
			<!-- Display up to 2 left pages -->
			{#each [-2, -1] as diff}
				{#if curPage + diff > 1}
					<a
						class={hoverable}
						data-sveltekit-preload-data="tap"
						href={makeURL(page.url, curPage + diff)}>{curPage + diff}</a
					>
				{/if}
			{/each}
			<!-- Display current page -->
			<span class={activePage + (curPage === 1 ? left : '') + (curPage === numPages ? right : '')}
				>{curPage}</span
			>
			<!-- Display up to 2 right pages -->
			{#each [1, 2] as diff}
				{#if curPage + diff < numPages}
					<a
						class={hoverable}
						data-sveltekit-preload-data="tap"
						href={makeURL(page.url, curPage + diff)}>{curPage + diff}</a
					>
				{/if}
			{/each}
			<!-- Display right ellipsis if less than page numPages - 3 -->
			{#if curPage < numPages - 3}
				<span class={ellipsis}>...</span>
			{/if}
			<!-- Display right arrow and page 1 if not on last page -->
			{#if curPage < numPages}
				<a class={hoverable} data-sveltekit-preload-data="tap" href={makeURL(page.url, numPages)}
					>{numPages}</a
				>
				<a
					class={hoverable + right}
					data-sveltekit-preload-data="tap"
					href={makeURL(page.url, curPage + 1)}><Right class="size-4" /></a
				>
			{/if}
		</nav>
		<div class="flex items-center gap-1">
			<p class="text-sm text-slate-200">Page:</p>
			<form
				onsubmit={(e) => {
					e.preventDefault();
					if (inputNum && inputNum !== '') {
						goto(makeURL(page.url, Number.parseInt(inputNum)));
					}
				}}
			>
				<input
					type="text"
					inputmode="numeric"
					pattern="[1-9][0-9]*"
					bind:value={inputNum}
					class="w-10 rounded bg-slate-200 px-1 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-600"
					placeholder={curPage.toString()}
				/>
				<button
					type="submit"
					class="rounded bg-orange-600 px-1 text-sm text-white transition-colors hover:bg-orange-700 hover:ring-2 hover:ring-inset hover:ring-slate-200"
					>Jump</button
				>
			</form>
		</div>
	{/if}
</div>
