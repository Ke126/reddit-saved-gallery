<script lang="ts">
	import { page } from '$app/stores';
	$: numPages = $page.data.posts ? Math.ceil($page.data.posts.total_count / 100) : 1;
	$: curPage = $page.data.posts ? $page.data.posts.page : 1;

	function makeURL(page: number) {
		const url = new URL($page.url);
		url.searchParams.set('page', `${page}`);
		return url.toString();
	}
	console.log('HERE');
</script>

<nav aria-label="...">
	<ul class="pagination justify-content-center">
		{#if curPage > 1}
			<li class="page-item">
				<a class="page-link" href={makeURL(1)}><i class="bi bi-chevron-double-left"></i></a>
			</li>
			<li class="page-item">
				<a class="page-link" href={makeURL(curPage - 1)}><i class="bi bi-chevron-left"></i></a>
			</li>
		{/if}
		{#each { length: numPages } as _, numPage}
			{#if numPage + 1 === curPage}
				<li class="page-item active">
					<span class="page-link">{curPage}</span>
				</li>
			{:else}
				<li class="page-item">
					<a class="page-link" href={makeURL(numPage + 1)}>{numPage + 1}</a>
				</li>
			{/if}
		{/each}
		{#if curPage < numPages}
			<li class="page-item">
				<a class="page-link" href={makeURL(curPage + 1)}><i class="bi bi-chevron-right"></i></a>
			</li>
			<li class="page-item">
				<a class="page-link" href={makeURL(numPages)}><i class="bi bi-chevron-double-right"></i></a>
			</li>
		{/if}
	</ul>
</nav>

<style>
	:global(html) {
		scroll-behavior: auto !important;
	}
</style>