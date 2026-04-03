<script>
	import { portfolioContext } from '$lib/state.svelte';
	import { fade } from 'svelte/transition';
</script>

<section id="services" class="section-wrap border-t border-white/10 py-10 md:py-12" in:fade={{ duration: 220 }}>
	<div class="panel">
		<p class="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Services</p>
		<h2 class="mt-2 text-2xl font-bold md:text-3xl">How I can help</h2>
		<p class="mt-3 max-w-2xl text-sm text-muted-foreground">
			Practical engineering support for teams and founders building dependable products.
		</p>

		<div class="mt-6 grid gap-3 md:grid-cols-2">
			{#each portfolioContext.services as service}
				<div class="item-card">
					<div class="flex items-center gap-2">
						<service.icon class="h-4 w-4 text-primary" />
						<h3 class="font-semibold">{service.title}</h3>
					</div>
					<p class="mt-2 text-sm text-muted-foreground">{service.text}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
