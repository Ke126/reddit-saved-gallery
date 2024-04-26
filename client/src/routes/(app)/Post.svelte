<script lang="ts">
	import type { Post } from '$lib';
	export let post: Post;

	async function favoritePost() {
		// make PUT request to API
		await fetch(`http://localhost:4000/posts/${post._id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				favorite: post.favorite
			})
		});
	}
</script>

<div class="col">
	<div class="card mx-auto" style="width: 20rem;">
		<div class="card-header d-flex justify-content-between">
			{post.subreddit}
			<input
				bind:checked={post.favorite}
				on:change={favoritePost}
				class="star"
				type="checkbox"
				title="Favorite"
			/>
		</div>
		{#if post.has_image}
			<!-- svelte-ignore a11y-img-redundant-alt -->
			<img src={post.image_link} class="card-img-top" alt="no image" />
		{/if}
		<div class="card-body">
			<h5 class="card-title">{post.title}</h5>
			<p class="card-text">
				{#if post.selftext && post.selftext.length > 500}
					{post.selftext.slice(0, 500)}...
				{:else}
					{post.selftext}
				{/if}
			</p>
			<a href={post.permalink} target="_blank">View on Reddit</a>
		</div>
	</div>
</div>

<!-- star styling rules modified from here -->
<!-- https://jsfiddle.net/binaryben/aLx3m4k5/ -->
<style>
	.card:hover {
		transform: scale(1.05);
	}
	.star {
		visibility: hidden;
		transform: scale(1.5);
		cursor: pointer;
	}
	.star:before {
		content: '\2606';
		visibility: visible;
		color: white;
	}
	.star:checked:before {
		content: '\2605';
		visibility: visible;
		color: yellow;
	}
</style>
