<script lang="ts">
	import Post from '$lib/components/Post.svelte';
	import { flip } from 'svelte/animate';
	import type { RedditCard } from '$lib/types/reddit';
	export let posts: RedditCard[];
</script>

<div class="bg-slate-900 flex justify-center px-4">
	<div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-flow-row">
		{#each posts as post (post._id)}
			<div animate:flip={{ duration: 200 }}>
				<Post {post}></Post>
			</div>
		{/each}
	</div>
</div>
