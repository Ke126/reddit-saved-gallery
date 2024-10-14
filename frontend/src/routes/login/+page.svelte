<script>
	import { page } from '$app/stores';
	import Reddit from '$lib/svg/Reddit.svelte';
	import MagnifyingGlass from '$lib/svg/MagnifyingGlass.svelte';
	import Photo from '$lib/svg/Photo.svelte';
	import Pin from '$lib/svg/Pin.svelte';
	const features = [
		{
			icon: Reddit,
			title: 'Direct integration with Reddit',
			description: [
				'Log in directly using your Reddit account - no extra sign up is needed!',
				'Reddit Saved Gallery will never have access to your password, and will never do anything without your permission.'
			]
		},
		{
			icon: MagnifyingGlass,
			title: 'Advanced search and filter',
			description: [
				"Search through your saved posts using Reddit Saved Gallery's advanced filtering options.",
				'Easily filter posts using multiple criteria like title, author, subreddit, selftext, and more!'
			]
		},
		{
			icon: Photo,
			title: 'Stylish post viewer',
			description: [
				"View the contents of all your saved posts directly on Reddit Saved Gallery's website - no need to switch between multiple tabs!",
				'Live video player and image gallery viewer coming soon!'
			]
		},
		{
			icon: Pin,
			title: 'Simple post management',
			description: [
				"Retrieve, save, and unsave posts directly to your Reddit account, all from the comfort of Reddit Saved Gallery's website!",
				'Pin posts locally to easily mark them for later!'
			]
		}
	];
</script>

<svelte:head>
	<title>Login - Reddit Saved Gallery</title>
	<meta
		name="description"
		content="Log in to Reddit Saved Gallery to view, filter, and manage your Reddit account's saved posts."
	/>
	<meta property="og:title" content="Login - Reddit Saved Gallery" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.origin + '/login'} />
	<meta property="og:image" content={$page.url.origin + '/favicon.png'} />
	<meta
		property="og:description"
		content="Log in to Reddit Saved Gallery to view, filter, and manage your Reddit account's saved posts."
	/>
</svelte:head>

<header class="bg-slate-900">
	<nav class="absolute w-full">
		<div
			class="mx-auto max-w-7xl flex items-center h-16 px-2 border-b border-slate-700 sm:px-6 lg:px-8"
		>
			<a href="/login" class="text-lg font-bold tracking-tight text-slate-200 mr-4 hover:text-orange-600 transition-all">
				Reddit Saved Gallery
			</a>
			<a
				href="#features"
				class="mr-auto rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-all"
				>Features</a
			>
			<button
				form="login"
				type="submit"
				class="rounded-lg px-3 py-1 border-2 hover:border-slate-200 border-orange-600 hover:bg-orange-700 font-bold transition-all bg-orange-600 text-white"
				>Log in</button
			>
		</div>
	</nav>
</header>

<div class="bg-slate-900 h-screen flex items-center justify-center">
	<div class="text-center px-8">
		<h1 class="text-6xl font-extrabold tracking-tight mb-4 text-slate-200">Reddit Saved Gallery</h1>
		<p class="text-2xl text-slate-400 mb-10">View, filter, and manage your Reddit saved posts!</p>
		<form id="login" method="post">
			<button
				type="submit"
				class="mx-auto flex items-center gap-1 h-16 rounded-lg px-6 text-xl border-2 hover:border-slate-200 border-orange-600 hover:bg-orange-700 font-bold transition-all bg-orange-600 text-white"
				>Log in with Reddit<Reddit class="size-8 text-white" />
			</button>
		</form>
	</div>
</div>

<div class="bg-white py-12 min-h-screen">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto max-w-2xl lg:text-center">
			<h2 class="text-base font-semibold leading-7 text-orange-600">Reddit Saved Gallery</h2>
			<p id="features" class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
				Features
			</p>
			<p class="mt-6 text-lg leading-8 text-gray-600">
				Reddit Saved Gallery provides a wide variety of advanced, user-friendly features to make
				your browsing experience the best it can be.
			</p>
		</div>
		<div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
			<dl
				class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16"
			>
				{#each features as Feature, i}
					<div class="relative pl-16">
						<dt class="text-base font-semibold leading-7 text-gray-900">
							<div
								class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-600"
							>
								<Feature.icon class={i === 0 ? 'size-8 text-white' : 'size-6 text-white'} />
							</div>
							{Feature.title}
						</dt>
						<dd class="mt-2 text-base leading-7 text-gray-600">
							{Feature.description.join(' ')}
						</dd>
					</div>
				{/each}
			</dl>
		</div>
	</div>
</div>

<style>
	:root {
		scroll-behavior: smooth;
	}
</style>
