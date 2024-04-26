<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	// export let data;

	let isLoading = false;
	// let query = '';
	
	$: subreddits = $page.data.subreddits;
	let query = $page.url.searchParams.get("q") || '';

	afterNavigate(() => {
		query = $page.url.searchParams.get("q") || '';
		const include = $page.url.searchParams.get("include");
		const exclude = $page.url.searchParams.get("exclude");
		if (include || include === "") {
			const subs = include.split(',');
			subreddits = subreddits.map(subreddit => {
				subreddit.checked = (subs.includes(subreddit.subreddit));
				return subreddit;
			});
		}
		else if (exclude || exclude === "") {
			const subs = exclude.split(',');
			subreddits = subreddits.map(subreddit => {
				subreddit.checked = !(subs.includes(subreddit.subreddit));
				return subreddit;
			});
		}
	});

	function setChecks(value: boolean) {
		subreddits = subreddits.map((subreddit) => {
			subreddit.checked = value;
			return subreddit;
		});
	}

	function makeQuery() {
		const inclusiveQuery = subreddits
			.filter((subreddit) => subreddit.checked)
			.map((subreddit) => subreddit.subreddit)
			.join(',');
		const exclusiveQuery = subreddits
			.filter((subreddit) => !subreddit.checked)
			.map((subreddit) => subreddit.subreddit)
			.join(',');
		// always query for the shorter option
		const type = inclusiveQuery.length > exclusiveQuery.length ? 'exclude' : 'include';
		const subredditQuery =
			inclusiveQuery.length > exclusiveQuery.length ? exclusiveQuery : inclusiveQuery;
		const queryString = `/?q=${query}&${type}=${subredditQuery}`;
		return queryString;
	}
</script>

<nav class="navbar navbar-expand-lg bg-secondary">
	<div class="container-fluid">
		<div class="navbar-brand">Reddit Saved Gallery</div>
		<form class="d-flex">
			<input bind:value={query} class="form-control me-2" type="search" placeholder="Search" />
			<button
				class="btn btn-primary"
				type="button"
				data-bs-toggle="collapse"
				data-bs-target="#filterPanel"
				aria-expanded="false"
				aria-controls="filterPanel"
			>
				Filters
			</button>
			<button
				on:click|preventDefault={() => goto(makeQuery())}
				class="btn btn-success"
				type="submit">Search</button
			>
		</form>
		<div class="navbar-nav ms-auto mb-2 mb-lg-0">
			<form
				method="POST"
				action="?/refresh"
				use:enhance={() => {
					isLoading = true;
					return async ({ update }) => {
						await update();
						isLoading = false;
					};
				}}
			>
				<button class="btn btn-warning" type="submit" disabled={isLoading}>
					{#if isLoading}
						<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
						Loading...
					{:else}
						Refresh from Reddit
					{/if}
				</button>
			</form>
			<form
				method="POST"
				action="?/logout"
			>
				<button class="btn btn-warning" type="submit">
					Logout
				</button>
			</form>
		</div>
	</div>
</nav>

<div class="collapse" id="filterPanel">
	<div class="card card-body">
		<form>
			<button on:click|preventDefault={() => setChecks(true)} class="btn btn-primary" type="submit"
				>Check all
			</button>
			<button on:click|preventDefault={() => setChecks(false)} class="btn btn-primary" type="submit"
				>Uncheck all
			</button>
			{#each subreddits as subreddit (subreddit.subreddit)}
				<div class="form-check">
					<input
						type="checkbox"
						bind:checked={subreddit.checked}
						class="form-check-input"
						id={subreddit.subreddit}
					/>
					<label class="form-check-label" for={subreddit.subreddit}>
						{subreddit.subreddit}
					</label>
					<span class="badge bg-primary rounded-pill">{subreddit.count}</span>
				</div>
			{/each}
		</form>
	</div>
</div>