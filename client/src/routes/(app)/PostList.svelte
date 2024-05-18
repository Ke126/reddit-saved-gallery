<script lang="ts">
	import Post from './Post.svelte';
	import { page } from '$app/stores';
</script>

<div class="container-fluid bg-primaary my-2">
	<div
		class="bg-daanger row row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-1 g-2"
	>
		{#each $page.data.posts ? $page.data.posts.posts : [] as post (post._id)}
			<Post {post}></Post>
		{/each}
	</div>
</div>
