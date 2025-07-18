<script>
	import { portfolioContext } from '$lib/state.svelte';
	import { Code, Database, Cloud, Brush, Rocket } from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';

	let { pageData } = $props();
</script>

<section id="skills" class="bg-background py-16" transition:slide={{ duration: 500 }}>
	<div class="container mx-auto max-w-6xl px-4">
		<h2 class="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
			Tools & Technologies
		</h2>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each portfolioContext.skills as skill, index}
				<div
					in:slide={{ delay: 600 }}
					class="group p-6 transition-all duration-300 hover:border-blue-400"
				>
					<div class="mb-4 flex items-center gap-4">
						<skill.icon class="h-8 w-8 text-blue-400" />
						<h3 class="text-xl font-semibold text-gray-900 dark:text-white">{skill.name}</h3>
					</div>
					<p class="text-sm text-gray-600 dark:text-gray-300">{skill.tools}</p>
					<div
						class="absolute inset-0 -z-10 rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
					></div>
				</div>
			{/each}
		</div>
	</div>
</section>
