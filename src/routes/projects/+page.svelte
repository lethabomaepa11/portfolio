<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import Seo from '$lib/custom_components/SEO.svelte';
	import { Github } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	let { data } = $props();
	let activeFilter = $state('All');
	let projects = $state([]);
	let filters = $state(['All']);
	const projectOutcome = (project) => {
		if (project.demoUrl?.includes('https://')) return 'Live deployment available';
		if (project.githubUrl?.includes('https://')) return 'Production-style codebase available';
		return 'Implementation details available in case study';
	};

	$effect(() => {
		const allProjects = data?.projects ?? [];
		projects = allProjects;

		const technologies = new Set();
		for (const project of allProjects) {
			for (const tech of project.technologies ?? []) {
				technologies.add(tech);
			}
		}
		filters = ['All', ...Array.from(technologies)];
	});

	const handleFilter = (filter) => {
		activeFilter = filter;
		if (filter === 'All') {
			projects = data.projects;
			return;
		}
		projects = data.projects.filter((project) => project.technologies?.includes(filter));
	};
</script>

<Seo title="Projects" desc="Selected case studies and shipped work." />

<section id="projects" class="section-wrap py-10 md:py-12" in:fade={{ duration: 220 }}>
	<div class="panel">
		<p class="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Projects</p>
		<h1 class="mt-2 text-2xl font-bold md:text-3xl">Recent work</h1>
		<p class="mt-3 text-sm text-muted-foreground">
			A focused selection of products I have built and delivered.
		</p>

		<div class="mt-6 flex flex-wrap gap-2">
			{#each filters as filter}
				<Button
					onclick={() => handleFilter(filter)}
					variant={activeFilter === filter ? 'default' : 'outline'}
					size="sm"
				>
					{filter}
				</Button>
			{/each}
		</div>

		{#if projects.length === 0}
			<div class="mt-6 text-sm text-muted-foreground">No projects found for this filter.</div>
		{:else}
			<div class="mt-6 space-y-3">
				{#each projects as project}
					<article id={project.slug} class="item-card">
						<div class="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)] md:items-start">
							<img
								src={project.image}
								alt={`Preview of ${project.title}`}
								class="w-full rounded-md border border-white/10 object-cover"
							/>
							<div>
								<h2 class="text-xl font-semibold">{project.title}</h2>
								<p class="mt-2 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
								<div class="mt-3 grid gap-2 text-sm">
									<p><span class="font-semibold text-foreground">Focus:</span> Solve a clear user problem with a maintainable implementation.</p>
									<p>
										<span class="font-semibold text-foreground">Outcome:</span>
										{projectOutcome(project)}
									</p>
								</div>

								<div class="mt-3 flex flex-wrap gap-2">
									{#each project.technologies ?? [] as tech}
										<span class="text-xs text-muted-foreground">{tech}</span>
									{/each}
								</div>

								<div class="mt-4 flex flex-wrap gap-2">
									<Button href={`/projects/${project.slug}`} variant="default">Case Study</Button>

									{#if project.githubUrl?.includes('https://')}
										<Button href={project.githubUrl} variant="outline" target="_blank" rel="noreferrer">
											<Github size={16} />
											GitHub
										</Button>
									{/if}

									{#if project.demoUrl?.includes('https://')}
										<Button href={project.demoUrl} variant="outline" target="_blank" rel="noreferrer">
											Live Demo
										</Button>
									{/if}
								</div>
							</div>
						</div>
					</article>
				{/each}
			</div>
		{/if}
	</div>
</section>
