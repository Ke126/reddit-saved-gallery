<script lang="ts">
	import { page } from '$app/state';
	import type { Subreddit } from '$lib/types/reddit';
	import MagnifyingGlass from '$lib/svg/MagnifyingGlass.svelte';
	import { slide } from 'svelte/transition';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import { goto } from '$app/navigation';
	import type { EventHandler } from 'svelte/elements';

	interface Props {
		subreddits: Subreddit[];
		user: { username: string; icon_img: string };
	}

	let { subreddits: _subreddits, user }: Props = $props();

	let subreddits = $state(_subreddits.map((sub) => ({ checked: true, ...sub })));
	let search = $state('');
	let showCollapseMenu = $state(false);

	// $effect handles updating the array of subreddits
	// when the user imports new posts
	$effect(() => {
		subreddits = _subreddits.map((sub) => ({ checked: true, ...sub }));
	});
	// $effect handles populating the filters and search bar
	// if the user is navigating the app by changing the url directly
	//
	// this is basically afterNavigate, however the reload after
	// pulling posts from Reddit seems to trigger the above $effect
	// AFTER afterNavigate, which is why $effect is also used here
	$effect(() => {
		search = page.url.searchParams.get('q') || '';
		setCheckedSubs();
	});

	function setCheckedSubs() {
		const include = page.url.searchParams.get('in');
		const exclude = page.url.searchParams.get('nin');
		if (include !== null) {
			const subs = include.split(',').map((elem) => elem.toLowerCase());
			subreddits.forEach((subreddit) => {
				subreddit.checked = subs.includes(subreddit.subreddit.toLowerCase());
			});
		} else if (exclude !== null) {
			const subs = exclude.split(',').map((elem) => elem.toLowerCase());
			subreddits.forEach((subreddit) => {
				subreddit.checked = !subs.includes(subreddit.subreddit.toLowerCase());
			});
		} else {
			checkAll(true);
		}
	}

	function checkAll(value: boolean) {
		subreddits.forEach((subreddit) => {
			subreddit.checked = value;
		});
	}

	const submitForm: EventHandler<SubmitEvent, HTMLFormElement> = (e) => {
		e.preventDefault();
		// const formData = new FormData(e.currentTarget);
		// console.log(Object.fromEntries(formData.entries()));
		const url = new URL(page.url.origin + page.url.pathname);
		if (search) {
			url.searchParams.append('q', search);
		}
		const numChecked = subreddits.filter((subreddit) => subreddit.checked).length;
		const isInSearchBool = numChecked < subreddits.length - numChecked;
		if (numChecked === subreddits.length) {
			goto(url);
			return;
		}
		url.searchParams.append(
			isInSearchBool ? 'in' : 'nin',
			subreddits
				.filter((subreddit) => (isInSearchBool ? subreddit.checked : !subreddit.checked))
				.map((subreddit) => subreddit.subreddit)
				.toString()
		);
		goto(url);
	};
</script>

<header class="bg-slate-900">
	<nav>
		<div
			class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:border-b sm:border-slate-700 sm:px-8"
		>
			<!-- Nav header -->
			<a
				href="/"
				data-sveltekit-preload-data="tap"
				class="mr-2 text-nowrap text-lg font-bold tracking-tight text-slate-200 transition-colors hover:text-orange-600"
			>
				Reddit Saved Gallery
			</a>

			<!-- Search bar, search button, and filter button -->
			<div class="hidden grow items-center justify-center gap-2 sm:flex">
				<form id="search" onsubmit={submitForm} class="relative max-w-96 grow">
					<input
						name="q"
						bind:value={search}
						class="peer w-full rounded-lg bg-slate-200 p-2 pl-10 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-600"
						type="search"
						placeholder="Search"
					/>
					<!-- svg text color classes are here so tailwind peer selector works properly -->
					<div
						class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 peer-focus:text-orange-600"
					>
						<MagnifyingGlass class="size-6" />
					</div>
				</form>
				<button
					form="search"
					type="submit"
					class="rounded-lg bg-orange-600 px-3 py-2 font-bold text-white transition-colors hover:bg-orange-700 hover:ring-2 hover:ring-inset hover:ring-slate-200"
					>Search</button
				><button
					type="button"
					onclick={() => (showCollapseMenu = !showCollapseMenu)}
					class="rounded-lg bg-orange-600 px-3 py-2 font-bold text-white transition-colors hover:bg-orange-700 hover:ring-2 hover:ring-inset hover:ring-slate-200"
					>Filters</button
				>
			</div>

			<!-- User dropdown -->
			<Dropdown username={user.username} pfp={user.icon_img} />
		</div>

		<!-- Second row on <sm breakpoint -->
		<div class="mx-auto flex h-16 items-center gap-2 border-b border-slate-700 px-4 sm:hidden">
			<!-- Search bar, search button, and filter button -->
			<form id="search" onsubmit={submitForm} class="relative grow">
				<input
					name="q"
					bind:value={search}
					class="peer w-full rounded-lg bg-slate-200 p-2 pl-10 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-600"
					type="search"
					placeholder="Search"
				/>
				<!-- svg text color classes are here so tailwind peer selector works properly -->
				<div
					class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 peer-focus:text-orange-600"
				>
					<MagnifyingGlass class="size-6" />
				</div>
			</form>
			<button
				form="search"
				type="submit"
				class="rounded-lg bg-orange-600 px-3 py-2 font-bold text-white transition-colors hover:bg-orange-700 hover:ring-2 hover:ring-inset hover:ring-slate-200"
				>Search</button
			><button
				type="button"
				onclick={() => (showCollapseMenu = !showCollapseMenu)}
				class="rounded-lg bg-orange-600 px-3 py-2 font-bold text-white transition-colors hover:bg-orange-700 hover:ring-2 hover:ring-inset hover:ring-slate-200"
				>Filters</button
			>
		</div>
	</nav>

	<!-- Filter menu -->
	{#if showCollapseMenu}
		<div in:slide out:slide class="mx-auto max-w-7xl border-b border-slate-700 px-4 py-4 sm:px-8">
			<div class="flex gap-2">
				<button
					onclick={() => checkAll(true)}
					type="submit"
					class="rounded-lg bg-orange-600 px-3 py-2 font-bold text-white transition-colors hover:bg-orange-700 hover:ring-2 hover:ring-inset hover:ring-slate-200"
					>Check all</button
				>
				<button
					onclick={() => checkAll(false)}
					type="submit"
					class="rounded-lg bg-orange-600 px-3 py-2 font-bold text-white transition-colors hover:bg-orange-700 hover:ring-2 hover:ring-inset hover:ring-slate-200"
					>Uncheck all</button
				>
			</div>
			<p class="text-lg font-semibold text-slate-200">
				Subreddits ({subreddits.filter((subreddit) => subreddit.checked).length})
			</p>
			<div class="flex flex-wrap gap-2">
				{#each subreddits as subreddit (subreddit.subreddit)}
					<label
						class="flex cursor-pointer items-center rounded-md border border-slate-700 ps-2 has-[:checked]:border-orange-600"
					>
						<input
							id={subreddit.subreddit}
							type="checkbox"
							bind:checked={subreddit.checked}
							class="peer cursor-pointer rounded accent-orange-600 ring-orange-600 ring-offset-1 ring-offset-slate-900 focus:ring-2"
						/>
						<label
							for={subreddit.subreddit}
							class="ms-2 w-full cursor-pointer py-2 pr-2 text-sm font-medium text-slate-400 peer-checked:text-orange-600"
							>r/{subreddit.subreddit} ({subreddit.count})</label
						>
					</label>
				{/each}
			</div>
		</div>
	{/if}
</header>
