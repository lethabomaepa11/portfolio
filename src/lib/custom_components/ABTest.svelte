<script>
	import { getVariant, trackEvent } from '$lib/ab-testing.svelte.js';

	let { experiment, variants, onConversion } = $props();

	const variant = $derived(getVariant(experiment));

	function handleConversion(eventData = {}) {
		trackEvent(experiment, variant, 'conversion', eventData);
		onConversion?.();
	}
</script>

{#if variant}
	<div data-ab-experiment={experiment} data-ab-variant={variant}>
		{#each variants as v (v.name)}
			{#if v.name === variant}
				{@render v.content()}
			{/if}
		{/each}
	</div>
{/if}
