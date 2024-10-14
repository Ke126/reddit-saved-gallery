<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { toast } from '$lib/toast/toast';
	import type { Subreddit } from '$lib/types/reddit';
	import { promiseWithResolvers } from '$lib/utils/promise';
	import Reddit from '$lib/svg/Reddit.svelte';
	import MagnifyingGlass from '$lib/svg/MagnifyingGlass.svelte';
	import { slide } from 'svelte/transition';

	export let subreddits: Subreddit[];
	export let user: { username: string; icon_img: string };

	let showCollapseMenu = false;
	let isLoading = false;

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
			class="mx-auto max-w-7xl flex items-center justify-between h-16 px-2 border-b border-slate-700 sm:px-6 lg:px-8"
		>
			<!-- Nav header -->
			<a href="/" class="text-lg font-bold tracking-tight text-slate-200"> Reddit Saved Gallery </a>

			<!-- Search bar, search button, and filter button -->
			<div class="flex items-center gap-2">
				<form id="search" class="relative max-w-7xl rounded-lg">
					<input
						name={queryName}
						bind:value={queryValue}
						class="peer block w-full rounded-lg border placeholder:text-slate-400 border-slate-700 bg-slate-200 p-2 pl-10 focus:border-orange-600 focus:outline-none focus:ring-1 focus:ring-orange-600"
						type="search"
						placeholder="Search"
					/>
					<!-- svg text color classes are here so tailwind peer selector works properly -->
					<div class="peer-focus:text-orange-600 text-slate-400 absolute pointer-events-none inset-y-0 left-0 flex items-center pl-3">
						<MagnifyingGlass class="size-6" />
					</div>
					<input type="hidden" name={filterName} value={filterValue} />
				</form>
				<button
					form="search"
					type="submit"
					class="rounded-lg px-3 py-2 border-2 hover:border-slate-200 border-orange-600 hover:bg-orange-700 font-bold transition-colors bg-orange-600 text-white"
					>Search</button
				><button
					type="button"
					on:click={() => (showCollapseMenu = !showCollapseMenu)}
					class="rounded-lg px-3 py-2 border-2 hover:border-slate-200 border-orange-600 hover:bg-orange-700 font-bold transition-colors bg-orange-600 text-white"
					>Filters</button
				>
			</div>

			<!-- User dropdown -->
			<button
				type="button"
				class="rounded-lg px-3 py-2 border-2 hover:border-slate-200 border-orange-600 hover:bg-orange-700 font-bold transition-colors bg-orange-600 text-white"
				>User</button
			>
		</div>
	</nav>

	<!-- Filter menu -->
	{#if showCollapseMenu}
		<div
			in:slide
			out:slide
			class="mx-auto max-w-7xl py-4 px-2 border-b border-slate-700 sm:px-6 lg:px-8"
		>
			<div class="flex gap-2">
				<button
					on:click={() => setChecks(true)}
					type="submit"
					class="rounded-lg px-2 py-1 border-2 hover:border-slate-200 border-orange-600 hover:bg-orange-700 font-bold transition-colors bg-orange-600 text-white"
					>Check all</button
				>
				<button
					on:click={() => setChecks(false)}
					type="submit"
					class="rounded-lg px-2 py-1 border-2 hover:border-slate-200 border-orange-600 hover:bg-orange-700 font-bold transition-colors bg-orange-600 text-white"
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
							class="peer rounded ring-orange-600 focus:ring-2 accent-orange-600 ring-offset-slate-900 cursor-pointer"
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

<header class="hidden bg-slate-900">
	<nav class="navbar navbar-expand-lg border-bottom">
		<div class="container">
			<a class="navbar-brand display-1" href="/">Reddit Saved Gallery</a>
			<button
				class="navbar-toggler"
				type="button"
				data-bs-toggle="collapse"
				data-bs-target="#navbarSupportedContent"
				aria-controls="navbarSupportedContent"
				aria-expanded="false"
				aria-label="Toggle navigation"
			>
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<ul class="navbar-nav me-auto">
					<li class="nav-item me-2">
						<form>
							<div class="input-group">
								<input
									bind:value={queryValue}
									type="search"
									class="form-control border-light"
									name={queryName}
									placeholder="Search"
								/>
								<input type="hidden" name={filterName} value={filterValue} />
								<button class="btn btn-outline-success" type="submit"
									><i class="bi bi-search"></i></button
								>
							</div>
						</form>
					</li>
					<li class="nav-item">
						<button
							class="btn btn-outline-light"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#filterPanel"
							aria-expanded="false"
							aria-controls="filterPanel"
						>
							Filters <i class="bi bi-funnel"></i>
						</button>
					</li>
				</ul>
			</div>
			<div class="dropdown">
				<button
					type="button"
					class="badge rounded-pill btn btn-outline-light d-flex align-items-center dropdown-toggle"
					data-bs-toggle="dropdown"
					aria-expanded="false"
				>
					<img
						class="rounded-circle me-1"
						width="24"
						height="24"
						src={user.icon_img}
						alt=""
					/>u/{user.username}
				</button>
				<ul class="dropdown-menu dropdown-menu-end">
					<li>
						<form
							method="POST"
							action="?/pull"
							use:enhance={() => {
								isLoading = true;
								const { promise, resolve, reject } = promiseWithResolvers();
								toast.promise(promise, {
									pending: 'Fetching saved posts from Reddit. This may take a few seconds...',
									fulfilled: 'Success!',
									rejected: 'Failed to fetch posts from Reddit. Please try again later.'
								});
								return async ({ result, update }) => {
									await update({ reset: true, invalidateAll: true });
									isLoading = false;
									if (result.type === 'success') {
										resolve();
									} else {
										reject();
									}
								};
							}}
						>
							<button
								class="dropdown-item d-flex align-items-center gap-1"
								type="submit"
								disabled={isLoading}
							>
								{#if isLoading}
									<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
									></span>
									Loading...
								{:else}
									Pull posts from Reddit <Reddit class="" />
								{/if}
							</button>
						</form>
					</li>
					<li>
						<form method="POST" action="?/logout">
							<button class="dropdown-item text-danger" type="submit">Logout</button>
						</form>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</header>

<div class="hidden collapse border-bottom" id="filterPanel">
	<div class="container py-2">
		<form>
			<div class="mb-2">
				<button on:click={() => setChecks(true)} class="btn btn-outline-primary" type="button"
					>Check all
				</button>
				<button on:click={() => setChecks(false)} class="btn btn-outline-danger" type="button"
					>Uncheck all
				</button>
			</div>
			<h5>Subreddits ({subreddits.filter((subreddit) => subreddit.checked).length})</h5>
			<div class="row g-2">
				{#each subreddits as subreddit (subreddit.subreddit)}
					<div class="col-auto">
						{#if subreddit.checked}
							<button
								class="badge p-2 btn btn-success"
								on:click={() => (subreddit.checked = !subreddit.checked)}
							>
								r/{subreddit.subreddit} ({subreddit.count})
							</button>
						{:else}
							<button
								class="badge p-2 btn btn-outline-secondary"
								on:click={() => (subreddit.checked = !subreddit.checked)}
							>
								r/{subreddit.subreddit} ({subreddit.count})
							</button>
						{/if}
					</div>
					<!-- <div class="col">
						<div class="form-check" title="r/{subreddit.subreddit} ({subreddit.count})">
							<input
								type="checkbox"
								bind:checked={subreddit.checked}
								class="form-check-input"
								id={subreddit.subreddit}
							/>
							<label class="form-check-label" for={subreddit.subreddit}>
								r/{subreddit.subreddit}
							</label>
							<span class="badge bg-dark-subtle border border-dark-subtle rounded-pill">
								{subreddit.count}
							</span>
						</div>
					</div> -->
				{/each}
			</div>
		</form>
	</div>
</div>
