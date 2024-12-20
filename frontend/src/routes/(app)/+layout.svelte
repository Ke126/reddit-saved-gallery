<script lang="ts">
	import { page } from '$app/state';
	import NavBar from '$lib/components/NavBar.svelte';

	let { data, children } = $props();
</script>

<svelte:head>
	<title>Reddit Saved Gallery</title>
	<meta
		name="description"
		content="View, filter, and manage your Reddit account's saved posts on Reddit Saved Gallery."
	/>
	<meta property="og:title" content="Reddit Saved Gallery" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={page.url.origin} />
	<meta property="og:image" content={page.url.origin + '/favicon.png'} />
	<meta
		property="og:description"
		content="View, filter, and manage your Reddit account's saved posts on Reddit Saved Gallery."
	/>
</svelte:head>

<NavBar subreddits={data.subreddits} user={data.user} />
{@render children()}
