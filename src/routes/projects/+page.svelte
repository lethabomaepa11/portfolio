<script>
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Seo from '$lib/custom_components/SEO.svelte';
	import { trackRecruiterAction } from '$lib/recruiter-tools.js';
	import { Github } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	let { data } = $props();
	let activeFilter = $state('All');
	let activeRolePreset = $state('general');
	let projects = $state([]);
	let filters = $state(['All']);
	let projectInsights = $state({});
	let insightsLoading = $state(false);
	const recruiterGithub = $derived(data?.info?.github ?? '');
	const recruiterRolePresets = [
		{
			id: 'general',
			label: 'General Fit',
			role: 'Software Engineer',
			keywords: []
		},
		{
			id: 'frontend',
			label: 'Frontend',
			role: 'Frontend Engineer',
			keywords: ['frontend', 'ui', 'ux', 'svelte', 'react', 'css', 'tailwind']
		},
		{
			id: 'backend',
			label: 'Backend',
			role: 'Backend Engineer',
			keywords: ['backend', 'api', 'database', 'sql', 'server', 'auth', 'node', 'dotnet']
		},
		{
			id: 'fullstack',
			label: 'Full-Stack',
			role: 'Full-Stack Engineer',
			keywords: ['frontend', 'backend', 'api', 'sveltekit', 'next', 'database', 'full-stack']
		}
	];

	const currentRolePreset = $derived.by(
		() => recruiterRolePresets.find((preset) => preset.id === activeRolePreset) ?? recruiterRolePresets[0]
	);

	const projectEvidenceTags = (project) => {
		const tags = ['Case Study'];
		if (project.demoUrl?.startsWith('https://')) tags.push('Live Demo');
		if (project.githubUrl?.startsWith('https://')) tags.push('GitHub');
		if ((project.technologies ?? []).length >= 4) tags.push('Broad Stack');
		return tags;
	};

	const defaultFocus = (project) => {
		const stack = (project.technologies ?? []).slice(0, 3).join(', ');
		return stack
			? `Build a practical solution using ${stack} with maintainable delivery.`
			: 'Solve a clear user problem with practical, maintainable implementation.';
	};

	const defaultOutcome = (project) => {
		if (project.demoUrl?.includes('https://')) return 'Live deployment available';
		if (project.githubUrl?.includes('https://')) return 'Production-style codebase available';
		return 'Implementation details available in case study';
	};

	const projectFocus = (project) => projectInsights?.[project.slug]?.focus || defaultFocus(project);
	const projectOutcome = (project) => projectInsights?.[project.slug]?.outcome || defaultOutcome(project);
	const scoreForRole = (project, preset) => {
		if (!preset?.keywords?.length) return 0;
		const haystack = [
			project.title,
			project.description,
			...(project.technologies ?? []),
			project.githubUrl,
			project.demoUrl
		]
			.join(' ')
			.toLowerCase();

		let score = 0;
		for (const keyword of preset.keywords) {
			if (haystack.includes(keyword)) score += 2;
		}
		if (project.githubUrl?.startsWith('https://')) score += 1;
		if (project.demoUrl?.startsWith('https://')) score += 1;
		return score;
	};

	const visibleProjects = $derived.by(() => {
		if (activeRolePreset === 'general') return projects;
		const preset = currentRolePreset;
		return [...projects].sort((a, b) => scoreForRole(b, preset) - scoreForRole(a, preset));
	});

	const aiPortfolioHref = $derived.by(
		() => `/ai-portfolio?role=${encodeURIComponent(currentRolePreset.role)}`
	);

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
		trackRecruiterAction('projects_filter_change', { filter, source: 'projects_page' });
		if (filter === 'All') {
			projects = data.projects;
			return;
		}
		projects = data.projects.filter((project) => project.technologies?.includes(filter));
	};

	const handleRolePreset = (preset) => {
		activeRolePreset = preset.id;
		trackRecruiterAction('role_focus_select', { role: preset.role, source: 'projects_page' });
	};

	const loadProjectInsights = async () => {
		if (!data?.projects?.length) return;
		insightsLoading = true;
		try {
			const payload = {
				projects: data.projects.slice(0, 8).map((project) => ({
					slug: project.slug,
					title: project.title,
					description: project.description,
					technologies: project.technologies ?? [],
					demoUrl: project.demoUrl,
					githubUrl: project.githubUrl
				}))
			};

			const response = await fetch('/api/projects/insights', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
			const result = await response.json();

			if (result?.success && result?.insights) {
				projectInsights = result.insights;
				trackRecruiterAction('project_insights_loaded', {
					count: Object.keys(result.insights).length,
					source: 'projects_page'
				});
			}
		} catch {
			// fallback copy remains active
		} finally {
			insightsLoading = false;
		}
	};

	onMount(() => {
		loadProjectInsights();
	});
</script>

<Seo title="Projects" desc="Selected case studies and shipped work." />

<section id="projects" class="section-wrap py-10 md:py-12" in:fade={{ duration: 220 }}>
	<div class="panel">
		<p class="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Projects</p>
		<h1 class="mt-2 text-2xl font-bold md:text-3xl">Recent work</h1>
		<p class="mt-3 text-sm text-muted-foreground">
			A focused selection of products I have built and delivered.
		</p>
		{#if recruiterGithub?.startsWith('https://')}
			<div class="mt-4 rounded-lg border border-primary/35 bg-primary/10 p-3">
				<div class="flex flex-wrap items-center justify-between gap-3">
					<p class="text-sm text-muted-foreground">
						Recruiter shortcut: open full GitHub profile for direct code review.
					</p>
					<Button
						href={recruiterGithub}
						variant="outline"
						target="_blank"
						rel="noreferrer"
						onclick={() => trackRecruiterAction('open_github_profile', { source: 'projects_page' })}
					>
						<Github size={16} />
						GitHub Profile
					</Button>
				</div>
			</div>
		{/if}
		{#if insightsLoading}
			<p class="mt-1 text-xs text-primary">Generating AI project focus and outcomes...</p>
		{/if}

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
		<div class="mt-3 flex flex-wrap items-center gap-2">
			{#each recruiterRolePresets as preset}
				<Button
					size="sm"
					variant={activeRolePreset === preset.id ? 'default' : 'outline'}
					onclick={() => handleRolePreset(preset)}
				>
					{preset.label}
				</Button>
			{/each}
			<Button
				size="sm"
				variant="outline"
				href={aiPortfolioHref}
				onclick={() => trackRecruiterAction('open_ai_generated_portfolio', { role: currentRolePreset.role, source: 'projects_page' })}
			>
				AI Role Page
			</Button>
		</div>
		{#if activeRolePreset !== 'general'}
			<p class="mt-2 text-xs text-muted-foreground">
				Projects ranked for <span class="text-foreground">{currentRolePreset.role}</span>.
			</p>
		{/if}

		{#if visibleProjects.length === 0}
			<div class="mt-6 text-sm text-muted-foreground">No projects found for this filter.</div>
		{:else}
			<div class="mt-6 space-y-3">
				{#each visibleProjects as project}
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
								<div class="mt-3 flex flex-wrap gap-1.5">
									{#each projectEvidenceTags(project) as tag (tag)}
										<span
											class="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-primary"
										>
											{tag}
										</span>
									{/each}
								</div>
								<div class="mt-3 grid gap-2 text-sm">
									<p>
										<span class="font-semibold text-foreground">Focus:</span>
										{projectFocus(project)}
									</p>
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
									<Button
										href={`/projects/${project.slug}`}
										variant="default"
										onclick={() => trackRecruiterAction('open_project_case_study', { slug: project.slug, source: 'projects_page' })}
									>
										Case Study
									</Button>

									{#if project.githubUrl?.includes('https://')}
										<Button
											href={project.githubUrl}
											variant="outline"
											target="_blank"
											rel="noreferrer"
											onclick={() => trackRecruiterAction('open_project_github', { slug: project.slug, source: 'projects_page' })}
										>
											<Github size={16} />
											GitHub
										</Button>
									{/if}

									{#if project.demoUrl?.includes('https://')}
										<Button
											href={project.demoUrl}
											variant="outline"
											target="_blank"
											rel="noreferrer"
											onclick={() => trackRecruiterAction('open_project_demo', { slug: project.slug, source: 'projects_page' })}
										>
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
