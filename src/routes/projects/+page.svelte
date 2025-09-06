<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import AnimatedButton from '$lib/custom_components/AnimatedButton.svelte';
	import GithubAnimated from '$lib/custom_components/GithubAnimated.svelte';
	import LaptopMockUp from '$lib/custom_components/LaptopMockUp.svelte';
	import Seo from '$lib/custom_components/SEO.svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import { Github } from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';
	let { data } = $props();
	let mobile = $state(new IsMobile());
	let isMobile = $state(mobile.current);

	const tabs = $state([
		{ name: 'All', current: true },
		{ name: 'Svelte', current: false },
		{ name: 'NextJS', current: false },
		{ name: 'Vanilla', current: false }
	]);

	let projects = $state(data.projects);

	const handleTabClick = (tab) => {
		tabs.forEach((t) => {
			t.current = false;
		});
		tab.current = true;

		if (tab.name === 'All') {
			projects = data.projects;
			return;
		}

		projects = data.projects.filter((project) => {
			return project.technologies.includes(tab.name);
		});
	};
</script>

<Seo title="Projects" desc="Check out some of my best work" />
<div id="projects" class="mx-auto max-w-6xl px-6 py-12" transition:slide={{ delay: 300 }}>
	<h1 class="text-center text-3xl font-extrabold text-blue-400 drop-shadow-lg">My Projects</h1>

	<div class=" flex w-full items-center gap-2">
		{#each tabs as tab}
			<Button
				onclick={() => handleTabClick(tab)}
				variant={tab.current ? 'default' : 'ghost'}
				class="flex items-center gap-2 transition-all duration-300 hover:text-blue-400"
				>{tab.name}
				{#if tab.current}
					({projects.length})
				{/if}
			</Button>
		{/each}
	</div>
	<p class="mt-5 text-sm">
		Showing {tabs.filter((tab) => tab.current)[0].name} projects
	</p>

	<!-- No projects -->
	{#if projects.length === 0}
		<div class="mt-5 grid grid-cols-1 gap-5">
			<div
				class="flex flex-col items-center gap-10 overflow-hidden rounded-xl p-6 transition-all duration-300 md:flex-row"
			>
				<span class="flex flex-col">
					<h2 class="text-2xl font-semibold text-primary">No projects found</h2>
					<p class="mt-2 line-clamp-3 max-w-full break-words text-gray-400"></p>
				</span>
			</div>
		</div>
	{/if}
	<div class="mt-5 grid grid-cols-1 gap-5">
		{#each projects as project}
			<div
				class="flex flex-col items-center gap-10 overflow-hidden rounded-xl p-6 transition-all duration-300 md:flex-row"
			>
				{#if isMobile}
					<img src={project.image} alt={project.title} class="w-full" />
				{:else}
					<LaptopMockUp image={project.image} />
				{/if}
				<span class="flex flex-col">
					<h2 class="text-2xl font-semibold text-primary">{project.title}</h2>
					<p class="mt-2 line-clamp-3 max-w-full break-words text-gray-400">
						{project.description}
					</p>
					<span class="mt-2 space-x-2 text-gray-400"
						>{#each project.technologies as tech}
							<span class="inline-block rounded-2xl bg-gray-700 px-2 py-1 text-xs">{tech}</span>
						{/each}</span
					>
					<div id={project.slug} class="mt-6 flex flex-wrap items-center justify-between gap-3">
						<Button
							variant=""
							disabled
							size="lg"
							href="/projects/{project.slug}"
							class="flex w-full items-center gap-2"
						>
							<span>About Project</span>
						</Button>
						{#if project.githubUrl.includes('https://')}
							<Button
								variant="outline"
								size="lg"
								href={project.githubUrl}
								class="flex w-full items-center gap-2"
							>
								<Github />
								<span>View on GitHub</span>
							</Button>
						{/if}

						{#if project.demoUrl.includes('https://')}
							<AnimatedButton className="w-full" href={project.demoUrl}
								>Visit live demo</AnimatedButton
							>
						{/if}
					</div>
				</span>
			</div>
		{/each}
	</div>
</div>
