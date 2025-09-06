<script>
	import { portfolioContext } from '$lib/state.svelte';
	import { Code, Database, Cloud, Brush, Rocket } from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';

	let { pageData } = $props();
</script>

<section id="skills" class="bg-background py-20" transition:fade={{ duration: 600 }}>
	<div class="container mx-auto max-w-7xl px-6">
		<h2 class="mb-16 text-center text-4xl font-extrabold text-gray-900 dark:text-white">
			Skills & Expertise
		</h2>
		<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each portfolioContext.skills as skill, index}
				<div
					in:slide={{ delay: index * 100, duration: 400 }}
					class="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
				>
					<div class="mb-4 flex items-center gap-4">
						<skill.icon class="h-10 w-10 flex-shrink-0 text-blue-400" />
						<h3 class="text-xl font-semibold text-gray-900 dark:text-white">{skill.name}</h3>
					</div>
					<p class="mb-4 text-sm text-gray-600 dark:text-gray-300">{skill.tools}</p>
					{#if skill.proficiency}
						<div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
							<div
								class="h-2.5 rounded-full bg-blue-400 transition-all duration-500"
								style="width: {skill.proficiency}%"
							></div>
						</div>
					{/if}
					<div
						class="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-blue-400/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
					></div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	section {
		scroll-margin-top: 80px;
	}
</style>
