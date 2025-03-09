<script>
	import { fade, slide } from 'svelte/transition';
	let { pageData } = $props();
	console.log(pageData);
</script>

<div
	id="projects"
	class="mx-auto max-w-6xl bg-gradient-to-br from-gray-900 to-black px-6 py-12"
	transition:slide={{ delay: 300, duration: 500, direction: 'right' }}
>
	<h1 class="text-center text-5xl font-extrabold text-blue-400 drop-shadow-lg">My Projects</h1>
	<p class="mt-3 text-center text-lg text-gray-300">Check out some of my best work below.</p>

	<div class="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
		{#each pageData.projects as project}
			<div
				class="rounded-xl bg-gray-800 p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
			>
				<img src={project.image} alt={project.title} class="mx-auto mb-4 h-48 w-full opacity-80 rounded-lg" />
				<h2 class="text-2xl font-semibold text-white">{project.title}</h2>
				<p class="mt-2  text-gray-400 max-w-full break-words line-clamp-3">
					{project.description}
				  </p>				<span class="mt-2 text-center text-gray-400 space-x-2">{#each project.technologies as tech}
					<span class="inline-block rounded-2xl text-xs bg-gray-700 px-2 py-1">{tech}</span>
				{/each}</span>
				<div class="mt-6 flex justify-between">
					<a
						href={project.githubUrl}
						class="text-lg font-medium text-blue-400 transition hover:text-blue-300"
						target="_blank">GitHub</a
					>
					{#if project.demoUrl}
					<a
						href={project.demoUrl}
						class="rounded-lg bg-blue-500 px-5 py-2 text-lg font-bold text-white shadow-lg transition hover:bg-blue-600"
						target="_blank">Live Demo</a
					>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
