<script lang="ts">
	import { enhance } from '$app/forms';
	import type { RedditCard } from '$lib/types/reddit';
	import { timeSince, dateString } from '$lib/utils/date';
	import { toast } from '$lib/toast/toast';
	import { promiseWithResolvers } from '$lib/utils/promise';
	import Pin from '$lib/svg/Pin.svelte';
	import PinFill from '$lib/svg/PinFill.svelte';
	import Bookmark from '$lib/svg/Bookmark.svelte';
	import BookmarkFill from '$lib/svg/BookmarkFill.svelte';
	import ArrowDown from '$lib/svg/ArrowDown.svelte';
	import ArrowUp from '$lib/svg/ArrowUp.svelte';
	import Message from '$lib/svg/Message.svelte';
	export let post: RedditCard;

	const BASE_URL = 'https://www.reddit.com';
	let saved = true;
</script>

<!-- Card -->
<article
	class="max-w-md rounded-xl py-3 bg-slate-800 hover:bg-slate-700 hover:scale-105 transition-all flex flex-col"
>
	<!-- Header -->
	<div class="flex items-center mb-2 px-3">
		<div class="mr-auto flex flex-col">
			<div>
				<a
					href="{BASE_URL}/r/{post.subreddit}"
					target="_blank"
					class="text-slate-200 font-semibold hover:text-orange-600 transition-all hover:underline"
					>r/{post.subreddit}</a
				>
				<span class="text-slate-400">•</span>
				<span class="text-slate-400" title={dateString(post.created)}
					>{timeSince(post.created)}</span
				>
			</div>
			<div>
				<a
					href="{BASE_URL}/u/{post.author}"
					target="_blank"
					class="text-slate-200 font-semibold hover:text-orange-600 transition-all hover:underline"
					>u/{post.author}</a
				>
				{#if post.link_author}
					<span class="text-slate-400">replied to</span>
					<a
						href="{BASE_URL}/u/{post.link_author}"
						target="_blank"
						class="text-slate-200 font-semibold hover:text-orange-600 transition-all hover:underline"
						>u/{post.link_author}</a
					>
				{/if}
			</div>
		</div>
		<form
			method="post"
			action="?/pin"
			use:enhance={() => {
				const { promise, resolve, reject } = promiseWithResolvers();
				toast.promise(promise, {
					pending: 'Loading...',
					fulfilled: post.pinned ? 'Pinned!' : 'Unpinned!',
					rejected: `Failed to ${post.pinned ? 'pin' : 'unpin'} post ${post._id}. Please try again later.`
				});
				return async ({ result, update }) => {
					await update({ reset: true, invalidateAll: false });
					if (result.type === 'success') {
						resolve();
					} else {
						reject();
						post.pinned = !post.pinned;
					}
				};
			}}
		>
			<input type="hidden" name="_id" value={post._id} />
			<input hidden type="checkbox" name="pinned" bind:checked={post.pinned} />
			<button
				class="group rounded-full p-2 hover:bg-green-600 hover:bg-opacity-25 transition-all"
				type="submit"
				title={post.pinned ? 'Unpin' : 'Pin'}
				on:click={() => (post.pinned = !post.pinned)}
			>
				{#if post.pinned}
					<PinFill class="text-green-600 size-6" />
				{:else}
					<Pin class="text-slate-400 group-hover:text-green-600 size-6 transition-all" />
				{/if}
			</button>
		</form>
		<form
			method="post"
			action="?/save"
			use:enhance={() => {
				const { promise, resolve, reject } = promiseWithResolvers();
				toast.promise(promise, {
					pending: 'Loading...',
					fulfilled: saved ? 'Saved!' : 'Unsaved!',
					rejected: `Failed to ${saved ? 'save' : 'unsave'} post ${post._id}. Please try again later.`
				});
				return async ({ result, update }) => {
					await update({ reset: true, invalidateAll: false });
					if (result.type === 'success') {
						resolve();
					} else {
						reject();
						saved = !saved;
					}
				};
			}}
		>
			<input type="hidden" name="_id" value={post._id} />
			<input hidden type="checkbox" name="saved" bind:checked={saved} />
			<button
				class="group rounded-full p-2 hover:bg-white hover:bg-opacity-25 transition-all"
				type="submit"
				title={saved ? 'Unsave' : 'Save'}
				on:click={() => ((saved = !saved), (post.pinned = false))}
			>
				{#if saved}
					<BookmarkFill class="text-white size-6" />
				{:else}
					<Bookmark class="text-slate-400 group-hover:text-white size-6 transition-all" />
				{/if}
			</button>
		</form>
	</div>

	<!-- Content -->
	{#if post.media}
		<img
			loading="lazy"
			width={post.media.width}
			height={post.media.height}
			src={post.media.link}
			class="w-full rounded-lg mb-2"
			alt="..."
		/>
	{/if}

	<!-- Title -->
	<h1 class="text-2xl px-3 text-slate-200 font-bold mb-2">{post.title}</h1>

	<!-- Selftext -->
	{#if post.selftext}
		<p class="text-slate-400 mb-2">
			{#if post.selftext.length > 500}
				{post.selftext.slice(0, 500)}...
			{:else}
				{post.selftext}
			{/if}
		</p>
	{/if}

	<!-- Buttons -->
	<div class="flex px-3 gap-4">
		<div class="flex items-center gap-1 py-2 px-3 bg-slate-600 text-slate-200 rounded-full">
			<ArrowUp class="size-5" />
			{post.score}
			<ArrowDown class="size-5" />
		</div>

		<a
			href="{BASE_URL}{post.permalink}"
			target="_blank"
			class="flex items-center gap-1 py-2 px-3 bg-slate-600 hover:bg-slate-500 text-slate-200 rounded-full"
		>
			<Message class="size-5" />
			{post.num_comments}
		</a>
	</div>
</article>
