<script lang="ts">
	import PostList from '$lib/components/PostList.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	export let data;
</script>

<h1 class="text-center mt-2 mb-0">{data.posts.total_count} results</h1>
<PostList posts={data.posts.posts}></PostList>
<Pagination totalCount={data.posts.total_count} curPage={data.posts.page}></Pagination>
