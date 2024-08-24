<script lang="ts">
	import NavBar from '$lib/components/NavBar.svelte';

	export let data;
</script>

<svelte:head>
	<title>Reddit Saved Gallery</title>
	<meta
		name="description"
		content="View, filter, and manage your Reddit account's saved posts on Reddit Saved Gallery."
	/>
</svelte:head>

<NavBar subreddits={data.subreddits.map((elem) => ({ checked: true, ...elem }))} user={data.user} />
<slot />
