<script>
	import { flip } from 'svelte/animate';
	import { toasts } from './store';
	import { scale } from 'svelte/transition';
	import Check from '$lib/components/Check.svelte';
	import Cross from '$lib/components/Cross.svelte';
	import Spinner from '$lib/svg/Spinner.svelte';
</script>

<div
	class="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-center justify-center p-0"
>
	{#each $toasts as toast (toast.id)}
		<article
			animate:flip={{ duration: 300 }}
			in:scale={{ duration: 300 }}
			out:scale={{ duration: 300 }}
			class="mt-4 flex items-center justify-center gap-2 rounded-md border border-slate-700 bg-slate-800 p-2"
			role="alert"
		>
			{#if toast.state === 'fulfilled'}
				<Check />
			{:else if toast.state === 'rejected'}
				<Cross />
			{:else}
				<Spinner class="size-5 text-slate-200" />
			{/if}
			<p class="text-sm text-slate-200">
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
