<script>
	import Button from '$lib/components/ui/button/button.svelte';

	import { User, Award, Briefcase, Download } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	let { pageData } = $props();
	let stats = $state([
		{ icon: Award, value: '5+', label: 'Years Experience' },
		{ icon: Briefcase, value: '50+', label: 'Projects Completed' },
		{ icon: User, value: '100%', label: 'Client Satisfaction' }
	]);
</script>

<section
	id="about"
	class="bg-background"
	transition:slide={{ delay: 300, duration: 500, direction: 'right' }}
>
	<div class="container mx-auto max-w-6xl px-4">
		<div class="grid items-center gap-12 md:grid-cols-2">
			<div>
				<h2 class="mb-6 text-3xl font-bold text-gray-900 dark:text-white">About Me</h2>
				<p class="mb-8 leading-relaxed text-gray-600 dark:text-gray-300">
					{pageData.info.about}
				</p>

				<div class="mb-8 hidden grid-cols-3 gap-4">
					{#each stats as stat}
						<div class="rounded-lg bg-blue-50 p-4 text-center dark:bg-gray-700">
							<stat.icon class="mx-auto mb-2 h-6 w-6 text-blue-400" />
							<p class="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
							<p class="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
						</div>
					{/each}
				</div>

				<Button target="_blank" href={pageData.info.resume} class="w-full md:w-auto">
					<Download class="mr-2" /> Download Resume
				</Button>
			</div>
		</div>
	</div>
</section>
