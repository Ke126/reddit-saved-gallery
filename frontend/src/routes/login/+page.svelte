<script>
	import { onMount } from 'svelte';
	const features = [
		'Pull saved posts directly from your Reddit account',
		'View post previews in website, with direct links straight to Reddit',
		'Search and filter by title, subreddit, author, or selftext',
		'Locally pin and unpin posts for viewing convenience',
		'Save and unsave posts directly to Reddit'
	];
	let activeIdx = -1;

	onMount(() => {
		setInterval(() => (activeIdx = (activeIdx + 1) % features.length), 5000);
		activeIdx = 0;
	});
</script>

<div class="container text-center position-absolute top-50 start-50 translate-middle">
	<h1 class="display-1">Reddit Saved Gallery</h1>
	<h6 class="display-6 mb-5">View, filter, and manage your Reddit account's saved posts!</h6>
	<h6>Features:</h6>
	<ul class="list-group d-inline-block mb-5">
		{#each features as feature, idx}
			<li class="list-group-item feature" class:active={activeIdx === idx}>- {feature}</li>
		{/each}
	</ul>

	<form method="POST">
		<button class="btn btn-outline-light" type="submit"
			>Log in with <i class="bi bi-reddit" style="color: #FF5700;"></i></button
		>
	</form>
</div>

<style>
	.feature {
		transition:
			background 0.5s ease-in-out,
			color 0.5s ease-in-out,
			border-color 0.5s ease-in-out;
	}
</style>
