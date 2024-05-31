<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { Subreddit } from '$lib/types/reddit';

	export let subreddits: Subreddit[];
	export let user: { username: string; icon_img: string };

	let isLoading = false;

	let queryName = '';
	let queryValue = '';
	let filterName = '';
	let filterValue = '';

	$: fillSearchAndFilters($page.url.searchParams);

	$: {
		queryName = queryValue.length === 0 ? '' : 'q';
		console.log('query ran');
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
		console.log('filters ran');
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
		console.log('fill form ran');
	}

	function setChecks(value: boolean) {
		subreddits = subreddits.map((subreddit) => {
			subreddit.checked = value;
			return subreddit;
		});
	}
</script>

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
			<ul class="navbar-nav me-auto mb-2 mb-lg-0">
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
		<form
			class="me-2"
			method="POST"
			action="?/pull"
			use:enhance={() => {
				isLoading = true;
				return async ({ update }) => {
					await update();
					isLoading = false;
				};
			}}
		>
			<button class="btn btn-outline-light" type="submit" disabled={isLoading}>
				{#if isLoading}
					<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
					Loading...
				{:else}
					Pull posts from <i class="bi bi-reddit" style="color: #FF5700;"></i>
				{/if}
			</button>
		</form>
		<form method="POST" action="?/logout" class="me-2">
			<button class="btn btn-outline-danger" type="submit">Logout</button>
		</form>
		<a href="#" data-bs-toggle="dropdown" aria-expanded="false">
			<span
				class="badge d-flex align-items-center p-1 pe-2 text-dark-emphasis bg-dark-subtle border border-dark-subtle rounded-pill"
			>
				<img
					class="rounded-circle me-1"
					width="24"
					height="24"
					src={user.icon_img}
					alt=""
				/>u/{user.username}
			</span>
		</a>
		<ul class="dropdown-menu dropdown-menu-end text-small" style="">
			<li><a class="dropdown-item" href="#">New project...</a></li>
			<li><a class="dropdown-item" href="#">Settings</a></li>
			<li><a class="dropdown-item" href="#">Profile</a></li>
			<li><hr class="dropdown-divider" /></li>
			<li><a class="dropdown-item" href="#">Sign out</a></li>
		</ul>
	</div>
</nav>

<div class="collapse border-bottom" id="filterPanel">
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
