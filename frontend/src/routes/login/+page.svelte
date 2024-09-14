<script>
	import { page } from '$app/stores';
	import RedditSvg from '$lib/components/RedditSvg.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	const features = [
		{
			icon: RedditSvg,
			title: 'Direct Integration With Your Reddit Account',
			description: [
				'Log in directly using your Reddit account - no extra sign up is needed!',
				'Reddit Saved Gallery will never have access to your password, and will never do anything without your permission.'
			]
		},
		{
			icon: '🖼️',
			title: 'Stylish Post Viewer',
			description: [
				"View the contents of all your saved posts directly on Reddit Saved Gallery's website - no need to switch between multiple tabs!",
				'Live video player and image gallery viewer coming soon!'
			]
		},
		{
			icon: '🔍',
			title: 'Advanced Search And Filter',
			description: [
				"Search through your saved posts using Reddit Saved Gallery's advanced filtering options.",
				'Easily filter posts using multiple criteria like title, author, subreddit, selftext, and more!'
			]
		},
		{
			icon: '📌',
			title: 'Saved Post Management',
			description: [
				"Retrieve, save, and unsave posts directly to your Reddit account, all from the comfort of Reddit Saved Gallery's website!",
				'Pin posts locally to easily mark them for later!'
			]
		}
	];

	let animate = false;
	onMount(() => {
		animate = true;
	});
</script>

<svelte:head>
	<title>Login - Reddit Saved Gallery</title>
	<meta
		name="description"
		content="Log in to Reddit Saved Gallery to view, filter, and manage your Reddit account's saved posts."
	/>
	<meta property="og:title" content="Login - Reddit Saved Gallery" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.origin + '/login'} />
	<meta property="og:image" content={$page.url.origin + '/favicon.png'} />
	<meta
		property="og:description"
		content="Log in to Reddit Saved Gallery to view, filter, and manage your Reddit account's saved posts."
	/>
</svelte:head>

<nav class="navbar position-absolute w-100 navbar-expand-sm border-bottom">
	<div class="container">
		<a class="navbar-brand display-1" href="/login">Reddit Saved Gallery</a>
		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarNavDropdown"
			aria-controls="navbarNavDropdown"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarNavDropdown">
			<div class="navbar-nav">
				<a class="nav-link" href="#features">Features</a>
				<!-- <a class="nav-link" href="#about">About</a> -->
			</div>
		</div>
	</div>
</nav>

<div
	class="container-fluid text-center vh-100 d-flex flex-column justify-content-center align-items-center"
>
	{#if animate}
		<h1 transition:fade class="display-1">Reddit Saved Gallery</h1>
		<h6 transition:fade class="display-6 pb-3 mb-5">
			View, filter, and manage your Reddit saved posts!
		</h6>
		<form transition:fade method="POST">
			<button class="btn btn-lg btn-success d-flex gap-2 align-items-center" type="submit"
				>Log in with Reddit <RedditSvg width={24} height={24} /></button
			>
		</form>
	{/if}
</div>

<div class="container-fluid min-vh-auto bg-custom">
	<h6 class="display-6 py-5 text-center" id="features">Features</h6>
	<div class="d-flex flex-wrap justify-content-center align-items-start pb-5 gap-5">
		{#each features as Feature}
			<div class="card shadow border-0" style="width: 20rem;">
				<div class="card-body">
					{#if typeof Feature.icon !== 'string'}
						<div class="mb-2">
							<Feature.icon width={48} height={48} />
						</div>
					{:else}
						<h1>{Feature.icon}</h1>
					{/if}
					<h5 class="card-title">{Feature.title}</h5>
					<br />
					{#each Feature.description as sentence}
						<p class="card-text">{sentence}</p>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.bg-custom {
		background-color: hsl(from var(--bs-dark) h s calc(l + 8));
	}
	.min-vh-auto {
		min-height: 100vh;
		height: auto;
	}
</style>
