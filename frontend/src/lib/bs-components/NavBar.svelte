<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { toast } from '$lib/toast/toast';
	import type { Subreddit } from '$lib/types/reddit';
	import { promiseWithResolvers } from '$lib/utils/promise';
	import RedditSvg from '$lib/bs-components/RedditSvg.svelte';
	import { goto } from '$app/navigation';
	import type { EventHandler } from 'svelte/elements';

	interface Props {
		subreddits: Subreddit[];
		user: { username: string; icon_img: string };
	}

	let { subreddits: _subreddits, user }: Props = $props();

	let subreddits = $state(_subreddits.map((sub) => ({ checked: true, ...sub })));
	let search = $state('');
	let isLoading = $state(false);

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

<nav class="navbar navbar-expand-lg border-bottom">
	<div class="container">
		<a class="navbar-brand display-1" href="/v1">Reddit Saved Gallery</a>
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
					<form onsubmit={submitForm}>
						<div class="input-group">
							<input
								name="q"
								bind:value={search}
								type="search"
								class="form-control border-light"
								placeholder="Search"
							/>
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
						method="post"
						action="/?/pull"
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
								Pull posts from Reddit <RedditSvg />
							{/if}
						</button>
					</form>
				</li>
				<li>
					<form method="post" action="/?/logout">
						<button class="dropdown-item text-danger" type="submit">Logout</button>
					</form>
				</li>
			</ul>
		</div>
	</div>
</nav>

<div class="collapse border-bottom" id="filterPanel">
	<div class="container py-2">
		<form>
			<div class="mb-2">
				<button onclick={() => checkAll(true)} class="btn btn-outline-primary" type="button"
					>Check all
				</button>
				<button onclick={() => checkAll(false)} class="btn btn-outline-danger" type="button"
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
								onclick={() => (subreddit.checked = !subreddit.checked)}
							>
								r/{subreddit.subreddit} ({subreddit.count})
							</button>
						{:else}
							<button
								class="badge p-2 btn btn-outline-secondary"
								onclick={() => (subreddit.checked = !subreddit.checked)}
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
