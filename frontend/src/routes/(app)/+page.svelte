<script lang="ts">
	import PostList from '$lib/components/PostList.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import Toaster from '$lib/toast/Toaster.svelte';
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
