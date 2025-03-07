<script>
	import { fade, slide } from 'svelte/transition';

	let projects = [
		{
			title: 'Varsity Mate',
			description:
				'A campus social networking app for students with study groups, career center, and goal tracking.',
			github: 'https://github.com/yourusername/varsity-mate',
			demo: 'https://varsitymate.app'
		},
		{
			title: 'Smart Grocery Planner',
			description:
				'AI-powered tool that helps users budget and track grocery expenses in real-time.',
			github: 'https://github.com/yourusername/grocery-planner',
			demo: 'https://groceryplanner.app'
		},
		{
			title: 'Taxi Tracker',
			description:
				'Uber-like app for public transport, showing real-time taxi availability and routes.',
			github: 'https://github.com/yourusername/taxi-tracker',
			demo: 'https://taxitracker.app'
		},
		{
			title: 'Freelancer Hub',
			description:
				'A platform for freelancers to find work and clients to hire skilled professionals.',
			github: 'https://github.com/yourusername/freelancer-hub',
			demo: 'https://freelancerhub.app'
		}
	];
</script>

<div
	id="projects"
	class="mx-auto max-w-6xl bg-gradient-to-br from-gray-900 to-black px-6 py-12"
	transition:slide={{ delay: 300, duration: 500, direction: 'right' }}
>
	<h1 class="text-center text-5xl font-extrabold text-blue-400 drop-shadow-lg">My Projects</h1>
	<p class="mt-3 text-center text-lg text-gray-300">Check out some of my best work below.</p>

	<div class="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
		{#each projects as project}
			<div
				class="rounded-xl bg-gray-800 p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
			>
				<img src="/favicon.png" alt={project.title} class="mx-auto mb-4 h-16 w-16 opacity-80" />
				<h2 class="text-center text-2xl font-semibold text-white">{project.title}</h2>
				<p class="mt-2 text-center text-gray-400">{project.description}</p>
				<div class="mt-6 flex justify-between">
					<a
						href={project.github}
						class="text-lg font-medium text-blue-400 transition hover:text-blue-300"
						target="_blank">GitHub</a
					>
					<a
						href={project.demo}
						class="rounded-lg bg-blue-500 px-5 py-2 text-lg font-bold text-white shadow-lg transition hover:bg-blue-600"
						target="_blank">Live Demo</a
					>
				</div>
			</div>
		{/each}
	</div>
</div>
