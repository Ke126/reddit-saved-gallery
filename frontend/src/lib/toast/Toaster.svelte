<script>
	import { flip } from 'svelte/animate';
	import { toasts } from './store';
	import { scale } from 'svelte/transition';
	import Check from '$lib/components/Check.svelte';
	import Cross from '$lib/components/Cross.svelte';
	import Spinner from '$lib/svg/Spinner.svelte';
</script>

<div
	class="fixed inset-x-0 top-0 p-0 flex flex-col items-center justify-center pointer-events-none z-50"
>
	{#each $toasts as toast (toast.id)}
		<article
			animate:flip={{ duration: 300 }}
			in:scale={{ duration: 300 }}
			out:scale={{ duration: 300 }}
			class="flex items-center justify-center gap-2 rounded-md bg-slate-800 border border-slate-700 mt-4 p-2"
			role="alert"
		>
			{#if toast.state === 'fulfilled'}
				<Check />
			{:else if toast.state === 'rejected'}
				<Cross />
			{:else}
				<Spinner class="size-5 text-slate-200" />
			{/if}
			<p class="text-slate-200 text-sm">
				{toast.message}
			</p>
			<!-- X button -->
			<!-- <button
				type="button"
				on:click={() => deleteToast(toast)}
			></button> -->
		</article>
	{/each}
</div>
