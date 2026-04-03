<script>
	import { portfolioContext } from '$lib/state.svelte';
	import { fade } from 'svelte/transition';
</script>

<section id="skills" class="section-wrap border-t border-white/10 py-10 md:py-12" in:fade={{ duration: 220 }}>
	<div class="panel">
		<p class="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Skills</p>
		<h2 class="mt-2 text-2xl font-bold md:text-3xl">Technical capabilities</h2>

		<div class="mt-6 grid gap-3 md:grid-cols-2">
			{#each portfolioContext.skills as skill}
				<div class="item-card">
					<div class="flex items-center justify-between gap-3">
						<div class="flex items-center gap-2">
							<skill.icon class="h-4 w-4 text-primary" />
							<p class="font-semibold">{skill.name}</p>
						</div>
						{#if skill.level}
							<p class="text-xs text-muted-foreground">{skill.level}%</p>
						{/if}
					</div>
					<p class="mt-1 text-sm text-muted-foreground">{skill.tools}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
