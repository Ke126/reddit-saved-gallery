<script lang="ts">
	import { page } from '$app/stores';
	import NavBar from '$lib/bs-components/NavBar.svelte';

	export let data;
</script>

<svelte:head>
	<title>Reddit Saved Gallery</title>
	<meta
		name="description"
		content="View, filter, and manage your Reddit account's saved posts on Reddit Saved Gallery."
	/>
	<meta property="og:title" content="Reddit Saved Gallery" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.origin} />
	<meta property="og:image" content={$page.url.origin + '/favicon.png'} />
	<meta
		property="og:description"
		content="View, filter, and manage your Reddit account's saved posts on Reddit Saved Gallery."
	/>
</svelte:head>

<NavBar subreddits={data.subreddits.map((elem) => ({ checked: true, ...elem }))} user={data.user} />
<slot />
