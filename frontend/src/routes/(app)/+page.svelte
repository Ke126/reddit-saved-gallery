<script lang="ts">
	import PostList from '$lib/components/PostList.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import Toaster from '$lib/toast/Toaster.svelte';
	export let data;
</script>

<Toaster />
<Pagination count={data.posts.count} totalCount={data.posts.total_count} curPage={data.posts.page}></Pagination>
<PostList posts={data.posts.posts}></PostList>
<!-- Display bottom pagination only if there are posts to be displayed -->
{#if data.posts.count !== 0}
	<Pagination count={data.posts.count} totalCount={data.posts.total_count} curPage={data.posts.page}></Pagination>
{/if}
