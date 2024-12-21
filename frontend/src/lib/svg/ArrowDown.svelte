<script lang="ts">
	import type Props from './type';

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
	<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
</svg>
