<script>
	import { Layout, Code, Smartphone, Server, Palette } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	let services = $state([
		{
			icon: Code,
			title: 'Web Development',
			text: 'Modern web applications using latest technologies'
		},
		{ icon: Smartphone, title: 'Mobile Apps', text: 'Cross-platform mobile solutions' },
		{ icon: Server, title: 'Backend Services', text: 'Scalable API development & database design' },
		{ icon: Layout, title: 'Full-Stack Solutions', text: 'End-to-end product development' },
		{ icon: Palette, title: 'UI/UX Design', text: 'User-centered interface design' }
	]);
</script>

<section
	id="services"
	class="bg-background py-16"
	transition:slide={{ delay: 300, duration: 500, direction: 'right' }}
>
	<div class="container mx-auto max-w-6xl px-4">
		<div class="mb-12 text-center">
			<h2 class="mb-4 text-3xl font-bold text-gray-900 dark:text-white">What I Offer</h2>
			<p class="mx-auto max-w-xl text-gray-600 dark:text-gray-300">
				Comprehensive digital solutions tailored to your business needs
			</p>
		</div>

		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each services as service}
				<div class="group p-6 transition-all hover:border-blue-400">
					<div class="mb-4 flex items-center gap-4">
						<div class="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
							<service.icon class="h-6 w-6 text-blue-400" />
						</div>
						<h3 class="text-xl font-semibold text-gray-900 dark:text-white">
							{service.title}
						</h3>
					</div>
					<p class="text-gray-600 dark:text-gray-300">{service.text}</p>
					<div
						class="absolute inset-0 -z-10 rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
					></div>
				</div>
			{/each}
		</div>
	</div>
</section>
