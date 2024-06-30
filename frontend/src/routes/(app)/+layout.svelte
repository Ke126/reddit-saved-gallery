<script lang="ts">
	import NavBar from '$lib/components/NavBar.svelte';

	export let data;
</script>

<NavBar subreddits={data.subreddits.map((elem) => ({ checked: true, ...elem }))} user={data.user} />
<slot />
