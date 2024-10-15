<script lang="ts">
	import { page } from '$app/stores';
	import type { Subreddit } from '$lib/types/reddit';
	import MagnifyingGlass from '$lib/svg/MagnifyingGlass.svelte';
	import { slide } from 'svelte/transition';
	import Dropdown from './Dropdown.svelte';

	export let subreddits: Subreddit[];
	export let user: { username: string; icon_img: string };

	let showCollapseMenu = false;

	let queryName = '';
	let queryValue = '';
	let filterName = '';
	let filterValue = '';

	$: fillSearchAndFilters($page.url.searchParams);

	$: {
		queryName = queryValue.length === 0 ? '' : 'q';
		// console.log('query update');
	}

	$: {
		const numChecked = subreddits.filter((subreddit) => subreddit.checked).length;
		const isInSearchBool = numChecked < subreddits.length - numChecked;
		filterName = isInSearchBool ? 'in' : 'nin';
		filterValue = subreddits
			.filter((subreddit) => (isInSearchBool ? subreddit.checked : !subreddit.checked))
			.map((subreddit) => subreddit.subreddit)
			.toString();
		if (numChecked === subreddits.length) filterName = '';
		// console.log('filters update');
	}

	function fillSearchAndFilters(searchParams: URLSearchParams) {
		queryValue = searchParams.get('q') || '';
		const include = searchParams.get('in');
		const exclude = searchParams.get('nin');
		if (include !== null) {
			const subs = include.split(',').map((elem) => elem.toLowerCase());
			subreddits = subreddits.map((subreddit) => {
				subreddit.checked = subs.includes(subreddit.subreddit.toLowerCase());
				return subreddit;
			});
		} else if (exclude !== null) {
			const subs = exclude.split(',').map((elem) => elem.toLowerCase());
			subreddits = subreddits.map((subreddit) => {
				subreddit.checked = !subs.includes(subreddit.subreddit.toLowerCase());
				return subreddit;
			});
		} else {
			setChecks(true);
		}
		// console.log('fill form update');
	}

	function setChecks(value: boolean) {
		subreddits = subreddits.map((subreddit) => {
			subreddit.checked = value;
			return subreddit;
		});
	}
</script>

<header class="bg-slate-900">
	<nav>
		<div
			class="mx-auto max-w-7xl flex items-center justify-between h-16 sm:border-b sm:border-slate-700 px-4 sm:px-8"
		>
			<!-- Nav header -->
			<a
				href="/"
				class="text-lg text-nowrap font-bold tracking-tight text-slate-200 hover:text-orange-600 transition-colors mr-2"
			>
				Reddit Saved Gallery
			</a>

			<!-- Search bar, search button, and filter button -->
			<div class="items-center justify-center gap-2 hidden sm:flex grow">
				<form id="search" class="relative grow max-w-96">
					<input
						name={queryName}
						bind:value={queryValue}
						class="peer w-full rounded-lg placeholder:text-slate-400 bg-slate-200 p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-600"
						type="search"
						placeholder="Search"
					/>
					<!-- svg text color classes are here so tailwind peer selector works properly -->
					<div
						class="peer-focus:text-orange-600 text-slate-400 absolute pointer-events-none inset-y-0 left-0 flex items-center pl-3"
					>
						<MagnifyingGlass class="size-6" />
					</div>
					<input type="hidden" name={filterName} value={filterValue} />
				</form>
				<button
					form="search"
					type="submit"
					class="rounded-lg px-3 py-2 hover:bg-orange-700 hover:ring-2 hover:ring-inset hover:ring-slate-200 font-bold transition-colors bg-orange-600 text-white"
					>Search</button
				><button
					type="button"
					on:click={() => (showCollapseMenu = !showCollapseMenu)}
					class="rounded-lg px-3 py-2 hover:bg-orange-700 hover:ring-2 hover:ring-inset hover:ring-slate-200 font-bold transition-colors bg-orange-600 text-white"
					>Filters</button
				>
			</div>

			<!-- User dropdown -->
			<Dropdown username={user.username} pfp={user.icon_img} />
		</div>

		<!-- Second row on <sm breakpoint -->
		<div class="flex sm:hidden mx-auto items-center gap-2 h-16 border-b border-slate-700 px-4">
			<!-- Search bar, search button, and filter button -->
			<form id="search" class="relative grow">
				<input
					name={queryName}
					bind:value={queryValue}
					class="w-full peer rounded-lg placeholder:text-slate-400 bg-slate-200 p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-600"
					type="search"
					placeholder="Search"
				/>
				<!-- svg text color classes are here so tailwind peer selector works properly -->
				<div
					class="peer-focus:text-orange-600 text-slate-400 absolute pointer-events-none inset-y-0 left-0 flex items-center pl-3"
				>
					<MagnifyingGlass class="size-6" />
				</div>
				<input type="hidden" name={filterName} value={filterValue} />
			</form>
			<button
				form="search"
				type="submit"
				class="rounded-lg px-3 py-2 hover:bg-orange-700 hover:ring-2 hover:ring-inset hover:ring-slate-200 font-bold transition-colors bg-orange-600 text-white"
				>Search</button
			><button
				type="button"
				on:click={() => (showCollapseMenu = !showCollapseMenu)}
				class="rounded-lg px-3 py-2 hover:bg-orange-700 hover:ring-2 hover:ring-inset hover:ring-slate-200 font-bold transition-colors bg-orange-600 text-white"
				>Filters</button
			>
		</div>
	</nav>

	<!-- Filter menu -->
	{#if showCollapseMenu}
		<div
			in:slide
			out:slide
			class="mx-auto max-w-7xl py-4 px-4 border-b border-slate-700 sm:px-8"
		>
			<div class="flex gap-2">
				<button
					on:click={() => setChecks(true)}
					type="submit"
					class="rounded-lg px-3 py-2 hover:bg-orange-700 hover:ring-2 hover:ring-inset hover:ring-slate-200 font-bold transition-colors bg-orange-600 text-white"
					>Check all</button
				>
				<button
					on:click={() => setChecks(false)}
					type="submit"
					class="rounded-lg px-3 py-2 hover:bg-orange-700 hover:ring-2 hover:ring-inset hover:ring-slate-200 font-bold transition-colors bg-orange-600 text-white"
					>Uncheck all</button
				>
			</div>
			<p class="text-slate-200 font-semibold text-lg">
				Subreddits ({subreddits.filter((subreddit) => subreddit.checked).length})
			</p>
			<div class="flex flex-wrap gap-2">
				{#each subreddits as subreddit (subreddit.subreddit)}
					<label
						class="flex ps-2 items-center border rounded-md border-slate-700 has-[:checked]:border-orange-600 cursor-pointer"
					>
						<input
							id={subreddit.subreddit}
							type="checkbox"
							bind:checked={subreddit.checked}
							class="peer rounded ring-orange-600 focus:ring-2 accent-orange-600 ring-offset-1 ring-offset-slate-900 cursor-pointer"
						/>
						<label
							for={subreddit.subreddit}
							class="w-full py-2 pr-2 ms-2 text-sm font-medium text-slate-400 peer-checked:text-orange-600 cursor-pointer"
							>r/{subreddit.subreddit} ({subreddit.count})</label
						>
					</label>
				{/each}
			</div>
		</div>
	{/if}
</header>
