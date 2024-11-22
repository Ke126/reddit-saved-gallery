<script lang="ts">
	import { page } from '$app/stores';
	export let curPage: number;
	export let totalCount: number;
	$: numPages = Math.ceil(totalCount / 100);

	function makeURL(url: URL, page: number) {
		const newUrl = new URL(url);
		newUrl.searchParams.set('page', `${page}`);
		return newUrl.toString();
	}
</script>

<nav aria-label="...">
	<ul class="pagination justify-content-center">
		{#if curPage > 1}
			<li class="page-item">
				<a class="page-link" data-sveltekit-preload-data="tap" href={makeURL($page.url, 1)}
					><i class="bi bi-chevron-double-left"></i></a
				>
			</li>
			<li class="page-item">
				<a
					class="page-link"
					data-sveltekit-preload-data="tap"
					href={makeURL($page.url, curPage - 1)}><i class="bi bi-chevron-left"></i></a
				>
			</li>
		{/if}
		{#each { length: numPages } as _, pageNum}
			{#if pageNum + 1 === curPage}
				<li class="page-item active">
					<span class="page-link">{curPage}</span>
				</li>
			{:else}
				<li class="page-item">
					<a
						class="page-link"
						data-sveltekit-preload-data="tap"
						href={makeURL($page.url, pageNum + 1)}>{pageNum + 1}</a
					>
				</li>
			{/if}
		{/each}
		{#if curPage < numPages}
			<li class="page-item">
				<a
					class="page-link"
					data-sveltekit-preload-data="tap"
					href={makeURL($page.url, curPage + 1)}><i class="bi bi-chevron-right"></i></a
				>
			</li>
			<li class="page-item">
				<a class="page-link" data-sveltekit-preload-data="tap" href={makeURL($page.url, numPages)}
					><i class="bi bi-chevron-double-right"></i></a
				>
			</li>
		{/if}
	</ul>
</nav>
