<script>
	import { flip } from 'svelte/animate';
	import { deleteToast, toasts } from './store';
	import { scale } from 'svelte/transition';
	import Check from '$lib/components/Check.svelte';
	import Cross from '$lib/components/Cross.svelte';
</script>

<div
	class="toast-container position-fixed top-0 start-50 translate-middle-x p-3 d-flex flex-column justify-content-center align-items-center"
>
	{#each $toasts as toast (toast.id)}
		<div
			animate:flip={{ duration: 300 }}
			in:scale={{ duration: 300 }}
			out:scale={{ duration: 300 }}
			class="toast show mb-2 w-auto"
			role="alert"
			aria-live="assertive"
			aria-atomic="true"
		>
			<div class="toast-body d-flex justify-content-center align-items-center">
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
					type="button"
					on:click={() => deleteToast(toast)}
					class="btn-close ms-1"
					aria-label="Close"
				></button>
			</div>
		</div>
	{/each}
</div>

<style>
	.toast {
		backdrop-filter: blur(3px);
	}
</style>
