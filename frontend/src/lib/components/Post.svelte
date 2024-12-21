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
	interface Props {
		post: RedditCard;
	}

	let { post }: Props = $props();

	const BASE_URL = 'https://www.reddit.com';
	let saved = $state(true);
	let pinned = $state(post.pinned);
</script>

<!-- Card -->
<article
	class="flex max-w-md flex-col rounded-xl border border-slate-700 bg-slate-800 py-3 transition-all hover:scale-105 hover:bg-slate-700"
>
	<!-- Header -->
	<div class="mb-2 flex items-center px-3">
		<div class="mr-auto flex flex-col">
			<div>
				<a
					href="{BASE_URL}/r/{post.subreddit}"
					target="_blank"
					class="font-medium text-slate-200 hover:text-orange-600 hover:underline"
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
					class="font-medium text-slate-200 hover:text-orange-600 hover:underline"
					>u/{post.author}</a
				>
				{#if post.link_author}
					<span class="text-slate-400">replied to</span>
					<a
						href="{BASE_URL}/u/{post.link_author}"
						target="_blank"
						class="font-medium text-slate-200 hover:text-orange-600 hover:underline"
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
					fulfilled: pinned ? 'Pinned!' : 'Unpinned!',
					rejected: `Failed to ${pinned ? 'pin' : 'unpin'} post ${post._id}. Please try again later.`
				});
				return async ({ result, update }) => {
					await update({ reset: true, invalidateAll: false });
					if (result.type === 'success') {
						resolve();
					} else {
						reject();
						pinned = !pinned;
					}
				};
			}}
		>
			<input type="hidden" name="_id" value={post._id} />
			<input hidden type="checkbox" name="pinned" checked={pinned} />
			<button
				class="group rounded-full p-2 transition-colors hover:bg-green-600/25"
				type="submit"
				title={pinned ? 'Unpin' : 'Pin'}
				onclick={() => (pinned = !pinned)}
			>
				{#if pinned}
					<PinFill class="size-6 text-green-600" />
				{:else}
					<Pin class="size-6 text-slate-400 transition-colors group-hover:text-green-600" />
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
			<input hidden type="checkbox" name="saved" checked={saved} />
			<button
				class="group rounded-full p-2 transition-colors hover:bg-white/25"
				type="submit"
				title={saved ? 'Unsave' : 'Save'}
				onclick={() => ((saved = !saved), (pinned = false))}
			>
				{#if saved}
					<BookmarkFill class="size-6 text-white" />
				{:else}
					<Bookmark class="size-6 text-slate-400 transition-colors group-hover:text-white" />
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
			class="mb-2 w-full rounded-lg"
			alt="..."
		/>
	{/if}

	<!-- Title -->
	<h1 class="mb-2 break-words px-3 text-xl font-semibold text-slate-200">{post.title}</h1>

	<!-- Selftext -->
	{#if post.selftext}
		<p class="mb-2 break-words px-3 text-slate-400">
			{#if post.selftext.length > 500}
				{post.selftext.slice(0, 500)}...
			{:else}
				{post.selftext}
			{/if}
		</p>
	{/if}

	<!-- Buttons -->
	<div class="flex gap-4 border-t border-slate-700 px-3 pt-3">
		<div class="flex items-center gap-1 rounded-full bg-slate-600 px-3 py-2 text-sm text-slate-200">
			<ArrowUp class="size-4" />
			{post.score}
			<ArrowDown class="size-4" />
		</div>

		<a
			href="{BASE_URL}{post.permalink}"
			target="_blank"
			class="flex items-center gap-1 rounded-full bg-slate-600 px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-500"
		>
			<Message class="size-4" />
			{post.num_comments}
		</a>
	</div>
</article>
