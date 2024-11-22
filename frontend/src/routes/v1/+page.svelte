<script lang="ts">
	import PostList from '$lib/bs-components/PostList.svelte';
	import Pagination from '$lib/bs-components/Pagination.svelte';
	import Toaster from '$lib/toast/BSToaster.svelte';
	export let data;

	const PAGE_SIZE = 100;
</script>

<Toaster />
<h2 class="text-center mt-2 mb-0">
	{#if data.posts.count !== 0}
		Showing {(data.posts.page - 1) * PAGE_SIZE + 1} - {Math.min(
			data.posts.page * PAGE_SIZE,
			data.posts.total_count
		)} of {data.posts.total_count} results
	{:else}
		No results found
	{/if}
</h2>
<PostList posts={data.posts.posts}></PostList>
<Pagination totalCount={data.posts.total_count} curPage={data.posts.page}></Pagination>

<svelte:head>
	<link
		href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
		rel="stylesheet"
		integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
		crossorigin="anonymous"
	/>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
	/>
	<script
		src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
		integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
		crossorigin="anonymous"
	></script>
</svelte:head>

<style>
	:root {
		scroll-behavior: auto;
	}
</style>
