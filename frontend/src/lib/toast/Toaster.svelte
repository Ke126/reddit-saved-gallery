<script>
	import { flip } from 'svelte/animate';
	import { deleteToast, toasts } from './store';
	import { scale } from 'svelte/transition';
	import Check from '$lib/components/Check.svelte';
	import Cross from '$lib/components/Cross.svelte';
</script>

<div
	class="toast-container position-fixed top-0 start-50 translate-middle-x p-3 text-center"
>
	{#each $toasts as toast (toast.id)}
		<div
			animate:flip={{ duration: 300 }}
			in:scale={{ duration: 300 }}
			out:scale={{ duration: 300 }}
		>
			<div
				class="toast show mb-2 d-inline-flex w-auto"
				role="alert"
				aria-live="assertive"
				aria-atomic="true"
			>
				<div class="toast-body d-inline-flex">
					<div class="me-2">
						{#if toast.state === 'fulfilled'}
							<Check />
						{:else if toast.state === 'rejected'}
							<Cross />
						{:else}
							<div class="spinner-border" role="status" style="width: 20px; height: 20px">
								<span class="visually-hidden">Loading...</span>
							</div>
						{/if}
					</div>
					{toast.message}
					<button
						on:click={() => deleteToast(toast)}
						type="button"
						class="btn-close ms-1"
						aria-label="Close"
					></button>
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	.toast {
		backdrop-filter: blur(3px)
	}
</style>