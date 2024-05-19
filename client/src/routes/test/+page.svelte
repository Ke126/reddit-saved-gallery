<script>
	import { enhance } from '$app/forms';
	let checked = false;
</script>

<div class="col w-50">
	<div class="card">
		<div class="card-header">
			<div class="row justify-content-between">
				<div class="col-auto">
					<div>
						<a
							href="/"
							target="_blank"
							class="link-body-emphasis link-underline-opacity-0 link-underline-opacity-75-hover"
							>r/subreddit</a
						>
						<span>•</span>
						<span title="Some date">2 mo. ago</span>
					</div>
					<div>
						<a
							href="/"
							target="_blank"
							class="link-body-emphasis link-underline-opacity-0 link-underline-opacity-75-hover"
							>u/author</a
						>
					</div>
				</div>
				<div class="col-auto d-flex align-items-center">
					<form
						method="POST"
						action="?/pin"
						use:enhance={() => {
							return () => {};
						}}
					>
						<input type="hidden" name="_id" value="12345" />
						<input hidden type="checkbox" name="pinned" bind:checked />
						<button
							class="p-0 btn btn-primary border-0"
							type="submit"
							on:click={() => (checked = !checked)}
						>
							{#if checked}
								<i class="bi bi-pin-angle-fill" style="color:lime; font-size: 1.5rem"></i>
							{:else}
								<i class="bi bi-pin-angle" style="font-size: 1.5rem"></i>
							{/if}
						</button>
					</form>
				</div>
			</div>
		</div>
		<div class="card-body">
			<h5 class="card-title">This is the post title</h5>
			<p class="card-text text-body-secondary">This is all of the text inside lol</p>
		</div>
		<div class="card-footer text-body-secondary">
			<span class="badge p-2 bg-dark-subtle border border-dark-subtle rounded-pill">
				<i class="bi bi-arrow-up"></i>
				1234 <i class="bi bi-arrow-down"></i>
			</span>

			<a href="/" target="_blank"
				><span class="badge p-2 bg-dark-subtle border border-dark-subtle rounded-pill">
					<i class="bi bi-chat-left"></i>
					135
				</span></a
			>
		</div>
	</div>
</div>

<style>
	.icon {
	}
	.star-checkbox {
		visibility: hidden;
		position: absolute;
		opacity: 100;
	}

	.star-label {
		position: relative;
		display: inline-block;
		font-size: 24px; /* Adjust the size of the star */
		color: gold; /* Set the color of the star */
		cursor: pointer;
	}

	.star-label::before {
		content: '\2606'; /* Unicode for empty star */
	}

	.star-checkbox:checked + .star-label::before {
		content: '\2605'; /* Unicode for filled star when checked */
	}
</style>
