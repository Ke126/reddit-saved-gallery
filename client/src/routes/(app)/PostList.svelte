<script lang="ts">
	import { postStore } from './store.js';
	import Post from './Post.svelte';
	import { page } from '$app/stores';
</script>

{#each Object.keys($page.data.posts) as key, value}
    <h3>{key}: {$page.data.posts[key]}</h3>
{/each}

<!-- <div class="row row-cols-1 row-cols-md-5 g-4">
	{#each $postStore as post (post._id)}
		<Post {post}></Post>
	{/each}
</div> -->
