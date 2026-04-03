<script>
	import { portfolioContext } from '$lib/state.svelte';
	import { fade } from 'svelte/transition';
</script>

<section id="experience" class="section-wrap border-t border-white/10 py-10 md:py-12" in:fade={{ duration: 220 }}>
	<div class="panel">
		<p class="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Experience</p>
		<h2 class="mt-2 text-2xl font-bold md:text-3xl">Career highlights</h2>

		<ol class="mt-6 space-y-3">
			{#each portfolioContext.experience as experience}
				<li class="item-card">
					<p class="text-xs uppercase tracking-[0.14em] text-muted-foreground">{experience.dates}</p>
					<h3 class="mt-2 text-lg font-semibold">{experience.title}</h3>
					<p class="mt-2 text-sm leading-relaxed text-muted-foreground">{experience.description}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>
