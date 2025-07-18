<script>
	import { portfolioContext } from '$lib/state.svelte';
	import { slide } from 'svelte/transition';
</script>

<section id="experience" class="bg-background lg:py-16" transition:slide={{ duration: 500 }}>
	<div class="container mx-auto max-w-6xl px-4">
		<h2 class="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
			My Experience
		</h2>

		<ol class="relative border-s border-gray-200 dark:border-gray-700">
			{#each portfolioContext.experience as experience}
				<li class="mb-10 ms-4">
					<div
						class="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"
					></div>
					<time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500"
						>{experience.dates}</time
					>
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
						{experience.title}
					</h3>
					<div class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
						{experience.description}
					</div>
				</li>
			{/each}
		</ol>
	</div>
</section>
