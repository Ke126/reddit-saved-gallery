<script lang="ts">
	import type Props from "./type";

	let { class: _class }: Props = $props();
</script>

<!-- Adapted from https://heroicons.com/ -->
<svg
	class={_class}
	xmlns="http://www.w3.org/2000/svg"
	fill="none"
	viewBox="0 0 24 24"
	stroke-width="1.5"
	stroke="currentColor"
>
	<path
		stroke-linecap="round"
		stroke-linejoin="round"
		d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
	/>
</svg>
