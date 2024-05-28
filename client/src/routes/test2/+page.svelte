<script>
	import { page } from '$app/stores';
	import { disableScrollHandling, goto } from '$app/navigation';
	import { onMount } from 'svelte';

	// onMount(() => {
	//     disableScrollHandling();
	// });

	let subs = [
		{
			name: 'sub1',
			checked: true
		},
		{
			name: 'sub2',
			checked: true
		},
		{
			name: 'sub3',
			checked: true
		}
	];

	$: {
		console.log(new Date(Date.now()).toLocaleTimeString());
	}
	let q = '';
	let qw = '';
	$: {
		$page.url.searchParams.get('q') || '';
		console.log('ran');
	}
	$: {
		q = qw;
		console.log('ran2');
	}
	function blud() {
		return q.length === 0 ? '' : 'q';
	}
	// let blud = '';
	// $: {
	// 	blud = q.length === 0 ? '' : 'q';
	// 	console.log('blud ran');
	// }
	let checkname = '';
	let checkvalue = '';
	$: {
		checkname = subs.map((elem) => elem.name).toString();
		checkvalue = subs.reduce((accum, elem) => (elem.checked ? accum + 1 : accum), 0).toString();
		console.log('checks ran');
	}
</script>

<form>
	<input type="search" bind:value={q} name={blud()} />
	{#each subs as sub}
		<label for={sub.name}>{sub.name}</label>
		<input id={sub.name} type="checkbox" bind:checked={sub.checked} />
	{/each}
	<input type="hidden" name={checkname} value={checkvalue} />
	<button type="submit">Submit</button>
</form>

<h1>hello</h1>
<input type="search" bind:value={q} />
{#each { length: 250 } as _}
	<br />
{/each}
<a href="/test2/?page=100">New Page</a>
<button on:click={() => goto('/test2/?page=100')}>Something</button>

<style>
	:global(html) {
		scroll-behavior: auto !important;
	}
</style>
