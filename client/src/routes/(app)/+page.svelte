<script lang="ts">
	import PostList from '$lib/components/PostList.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	export let data;
</script>

<PostList posts={data.posts.posts}></PostList>
<Pagination totalCount={data.posts.total_count} curPage={data.posts.page}></Pagination>
