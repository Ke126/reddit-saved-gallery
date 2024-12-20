<script lang="ts">
	import Post from '$lib/components/Post.svelte';
	import { flip } from 'svelte/animate';
	import type { RedditCard } from '$lib/types/reddit';
	interface Props {
		posts: RedditCard[];
	}

	let { posts }: Props = $props();
</script>

<div class="flex justify-center bg-slate-900 px-4">
	<div
		class="grid grid-flow-row grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
	>
		{#each posts as post (post._id)}
			<div animate:flip={{ duration: 200 }}>
				<Post {post}></Post>
			</div>
		{/each}
	</div>
</div>
