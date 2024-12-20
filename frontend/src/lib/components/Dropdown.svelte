<script lang="ts">
	import { enhance } from '$app/forms';
	import Cloud from '$lib/svg/Cloud.svelte';
	import Logout from '$lib/svg/Logout.svelte';
	import Spinner from '$lib/svg/Spinner.svelte';
	import User from '$lib/svg/User.svelte';
	import { toast } from '$lib/toast/toast';
	import { promiseWithResolvers } from '$lib/utils/promise';
	import type { MouseEventHandler } from 'svelte/elements';

	interface Props {
		username: string;
		pfp: string;
	}

	let { username, pfp }: Props = $props();

	let dropdownButton: HTMLButtonElement;
	// svelte-ignore non_reactive_update
	let dropdownMenu: HTMLDivElement;

	let showDropdown = $state(false);
	let isLoading = $state(false);

	const closeDropdown: MouseEventHandler<Window> = (event) => {
		const target = event.target;
		// only close dropdown if click was not on dropdown button or dropdown menu
		if (target instanceof Node && showDropdown && !dropdownButton.contains(target) && !dropdownMenu.contains(target)) {
			showDropdown = false;
		}
	}
</script>

<svelte:window onclick={closeDropdown} />

<div class="relative inline-block h-10 ml-2">
	<!-- Dropdown button -->
	<button
		bind:this={dropdownButton}
		type="button"
		class="size-10 rounded-full hover:ring-orange-600 focus:ring-orange-600 hover:ring-2 focus:ring-2 hover:ring-offset-2 focus:ring-offset-2 hover:ring-offset-slate-900 focus:ring-offset-slate-900"
		onclick={() => (showDropdown = !showDropdown)}
	>
		<img src={pfp} alt="Profile icon" class="rounded-full" />
	</button>

	<!-- Dropdown menu -->
	{#if showDropdown}
		<div
			bind:this={dropdownMenu}
			class="absolute origin-top-right right-0 w-48 py-1 bg-slate-800 rounded border border-slate-700 z-50"
		>
			<p class="p-2 text-slate-200 text-sm w-full flex items-center gap-1">
				<User class="size-5 text-slate-200" />
				u/{username}
			</p>
			<div class="border-t border-slate-700 my-1"></div>
			<form
				method="post"
				use:enhance={() => {
					showDropdown = false;
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
				action="?/pull"
			>
				{#if isLoading}
					<p class="text-slate-400 text-sm p-2 w-full flex items-center gap-1">
						<Spinner class="size-5 text-slate-400" />
						Loading...
					</p>
				{:else}
					<button
						type="submit"
						class="text-slate-200 text-sm hover:bg-slate-700 p-2 w-full flex items-center gap-1"
					>
						<Cloud class="size-5 text-slate-200" />
						Pull posts from Reddit
					</button>
				{/if}
			</form>
			<form
				method="post"
				use:enhance={() => {
					showDropdown = false;
					return async ({ update }) => {
						await update();
					};
				}}
				action="?/logout"
			>
				<button
					type="submit"
					class="text-slate-200 text-sm hover:bg-slate-700 p-2 w-full flex items-center gap-1"
				>
					<Logout class="size-5 text-slate-200" />
					Log out
				</button>
			</form>
		</div>
	{/if}
</div>
