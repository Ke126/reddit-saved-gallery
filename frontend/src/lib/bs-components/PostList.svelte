<script lang="ts">
	import Post from '$lib/bs-components/Post.svelte';
	import { flip } from 'svelte/animate';
	import type { RedditCard } from '$lib/types/reddit';
	interface Props {
		posts: RedditCard[];
	}

	let { posts }: Props = $props();
</script>

<div class="container-fluid p-2">
	<div class="row row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-1 g-2">
		{#each posts as post (post._id)}
			<div animate:flip={{ duration: 200 }}>
				<Post {post}></Post>
			</div>
		{/each}
	</div>
</div>
