<script lang="ts">
	import { enhance } from '$app/forms';
	import type { RedditPost } from '$lib';
	export let post: RedditPost;

	const BASE_URL = 'https://www.reddit.com';

	function timeSince(timestamp: number): string {
		const now = Date.now() / 1000;
		// sec.
		let elapsed = Math.max(0, now - timestamp);
		if (elapsed < 60) return Math.floor(elapsed) + ' sec. ago';
		// min.
		elapsed /= 60;
		if (elapsed < 60) return Math.floor(elapsed) + ' min. ago';
		// hr.
		elapsed /= 60;
		if (elapsed < 24) return Math.floor(elapsed) + ' hr. ago';
		// day/days
		elapsed /= 24;
		if (elapsed < 30)
			return Math.floor(elapsed) === 1
				? Math.floor(elapsed) + ' day ago'
				: Math.floor(elapsed) + ' days ago';
		// mo.
		elapsed /= 30;
		if (elapsed < 12) return Math.floor(elapsed) + ' mo. ago';
		// yr.
		elapsed /= 12;
		return Math.floor(elapsed) + ' yr. ago';
	}
	function dateString(timestamp: number): string {
		return new Date(timestamp * 1000).toLocaleString();
	}
</script>

<div class="col">
	<div class="card">
		<div class="card-header">
			<div class="row justify-content-between">
				<div class="col-auto">
					<div>
						<a
							href="{BASE_URL}/r/{post.subreddit}"
							target="_blank"
							class="link-body-emphasis link-underline-opacity-0 link-underline-opacity-75-hover"
							>r/{post.subreddit}</a
						>
						<span>•</span>
						<span title={dateString(post.created)}>{timeSince(post.created)}</span>
					</div>
					<div>
						<a
							href="{BASE_URL}/u/{post.author}"
							target="_blank"
							class="link-body-emphasis link-underline-opacity-0 link-underline-opacity-75-hover"
							>u/{post.author}</a
						>
						{#if post.link_author}
							<span>replied to</span>
							<a
								href="{BASE_URL}/u/{post.link_author}"
								target="_blank"
								class="link-body-emphasis link-underline-opacity-0 link-underline-opacity-75-hover"
								>u/{post.link_author}</a
							>
						{/if}
					</div>
				</div>
				<div class="col-auto d-flex align-items-center">
					<form
						method="POST"
						action="?/favorite"
						use:enhance={() => {
							return () => {};
						}}
					>
						<input type="hidden" name="_id" value={post._id} />
						<input hidden type="checkbox" name="favorited" bind:checked={post.favorited} />
						<button
							class="p-0 btn border-0"
							type="submit"
							on:click={() => (post.favorited = !post.favorited)}
						>
							{#if post.favorited}
								<i class="bi bi-pin-angle-fill" style="color: lime; font-size: 1.5rem"></i>
							{:else}
								<i class="bi bi-pin-angle" style="font-size: 1.5rem"></i>
							{/if}
						</button>
					</form>
				</div>
			</div>
		</div>
		{#if post.media_url}
			<img src={post.media_url} class="card-img-top" alt="..." />
		{/if}
		<div class="card-body">
			<h5 class="card-title">{post.title}</h5>
			<p class="card-text text-body-secondary">
				{#if post.selftext && post.selftext.length > 500}
					{post.selftext.slice(0, 500)}...
				{:else}
					{post.selftext}
				{/if}
			</p>
		</div>
		<div class="card-footer text-body-secondary">
			<span class="badge p-2 bg-dark-subtle border border-dark-subtle rounded-pill">
				<i class="bi bi-arrow-up"></i>
				{post.score} <i class="bi bi-arrow-down"></i>
			</span>

			<a href="{BASE_URL}{post.permalink}" target="_blank"
				><span class="badge p-2 bg-dark-subtle border border-dark-subtle rounded-pill">
					<i class="bi bi-chat-left"></i>
					{post.num_comments}
				</span></a
			>
		</div>
	</div>
</div>

<style>
	.card {
		transition: all 0.1s ease-in-out;
	}
	.card:hover {
		scale: 1.05;
		background-color: hsl(from var(--bs-dark) h s calc(l + 0.05));
		box-shadow: 0 5px 15px rgba(145, 92, 182, 0.4);
		z-index: 1;
	}
</style>
