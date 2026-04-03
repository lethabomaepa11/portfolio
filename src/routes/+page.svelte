<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import About from '$lib/pages/About.svelte';
	import Contact from '$lib/pages/Contact.svelte';
	import Experience from '$lib/pages/Experience.svelte';
	import Services from '$lib/pages/Services.svelte';
	import Skills from '$lib/pages/Skills.svelte';
	import Seo from '$lib/custom_components/SEO.svelte';
	import { trackRecruiterAction } from '$lib/recruiter-tools.js';
	import { portfolioContext } from '$lib/state.svelte';
	import { ArrowRight, Download, Github, Linkedin, Mail } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	let { data } = $props();

	const featuredProjects = $derived((data.data.projects ?? []).slice(0, 3));
	const totalProjects = $derived((data.data.projects ?? []).length);
	const uniqueTechCount = $derived.by(() => {
		const stack = new Set();
		for (const project of data.data.projects ?? []) {
			for (const tech of project.technologies ?? []) {
				stack.add(tech);
			}
		}
		return stack.size;
	});
	const pricingPlans = $derived(portfolioContext.pricing ?? []);
	const githubAvatar = 'https://avatars.githubusercontent.com/u/129387924?v=4';
	const fitSnapshotItems = $derived.by(() => {
		const experienceCount = portfolioContext.experience?.length ?? 0;
		return [
			{ label: 'Shipped Projects', value: String(totalProjects), note: 'Case studies available' },
			{ label: 'Stack Breadth', value: `${uniqueTechCount}+`, note: 'Technologies across projects' },
			{ label: 'Career Highlights', value: String(experienceCount), note: 'Recent milestones and roles' },
			{ label: 'Pricing Clarity', value: '3 bands', note: 'Transparent scope-to-budget ranges' }
		];
	});
	const recruiterSignals = [
		'Currently employed; available for selective projects and strategic collaborations.',
		'Shipped projects with source code and live demos',
		'Clear case studies explaining problem-solving approach',
		'Strong foundation in SvelteKit, JavaScript/TypeScript, and APIs',
		'Transparent South African project pricing with clear scope bands'
	];
	const projectEvidenceTags = (project) => {
		const tags = ['Case Study'];
		if (project.demoUrl?.startsWith('https://')) tags.push('Live Demo');
		if (project.githubUrl?.startsWith('https://')) tags.push('GitHub');
		if (project.technologies?.length) tags.push(`${project.technologies.length} technologies`);
		return tags;
	};

	const trackCta = (action, meta = {}) => {
		trackRecruiterAction(action, { source: 'home', ...meta });
	};

</script>

<Seo
	title="Portfolio"
	desc="Software developer currently employed and open to selective full-time opportunities and high-impact collaborations."
/>

<section class="py-6 md:py-10" in:fade={{ duration: 240 }}>
	<div class="panel">
		<div class="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
			<div class="max-w-3xl">
				<p class="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Software Developer</p>
				<h1 class="mt-3 text-3xl font-bold leading-tight md:text-5xl">Lethabo Maepa</h1>
				<p class="mt-4 text-base text-muted-foreground md:text-lg">
					{data.data.info.headline}
				</p>
				<p class="mt-2 text-sm text-primary">
					Currently employed and available for selective projects and strategic collaborations.
				</p>
			</div>
			<img
				src={githubAvatar}
				alt="Lethabo Maepa GitHub profile picture"
				class="h-24 w-24 self-start rounded-full border border-white/15 object-cover ring-2 ring-primary/25 md:h-32 md:w-32"
				loading="eager"
				decoding="async"
				referrerpolicy="no-referrer"
			/>
		</div>

		<div class="mt-6 flex flex-wrap gap-3">
			<Button href="/projects" onclick={() => trackCta('hero_view_projects')}>View Projects</Button>
			<Button
				href={data.data.info.github}
				target="_blank"
				rel="noreferrer"
				variant="outline"
				onclick={() => trackCta('hero_github_profile')}
			>
				<Github size={15} />
				GitHub Profile
			</Button>
			<Button href="/#contact" variant="outline" onclick={() => trackCta('hero_contact')}>
				Contact Me
			</Button>
			<Button href="/pricing" variant="outline" onclick={() => trackCta('hero_pricing')}>
				Pricing
			</Button>
			{#if data.data.info.resume}
				<Button
					href={data.data.info.resume}
					target="_blank"
					variant="outline"
					onclick={() => trackCta('hero_resume')}
				>
					<Download size={15} />
					Resume
				</Button>
			{/if}
		</div>

		<div class="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
			<a
				href={data.data.info.linkedin}
				target="_blank"
				rel="noreferrer"
				class="inline-flex items-center gap-2 hover:text-primary"
				onclick={() => trackCta('social_linkedin')}
			>
				<Linkedin size={16} />
				LinkedIn
			</a>
			<a
				href={data.data.info.github}
				target="_blank"
				rel="noreferrer"
				class="inline-flex items-center gap-2 hover:text-primary"
				onclick={() => trackCta('social_github')}
			>
				<Github size={16} />
				GitHub
			</a>
			<a
				href={`mailto:${data.data.info.email}`}
				class="inline-flex items-center gap-2 hover:text-primary"
				onclick={() => trackCta('social_email')}
			>
				<Mail size={16} />
				Email
			</a>
		</div>
	</div>
</section>

<section id="projects" class="border-t border-white/10 py-8" in:fade={{ duration: 240, delay: 80 }}>
	<div class="panel mb-6">
		<p class="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Role Fit Snapshot</p>
		<div class="mt-4 grid gap-3 md:grid-cols-4">
			{#each fitSnapshotItems as item (item.label)}
				<article class="item-card">
					<p class="text-xs uppercase tracking-[0.12em] text-muted-foreground">{item.label}</p>
					<p class="mt-2 text-2xl font-bold text-primary">{item.value}</p>
					<p class="mt-1 text-xs text-muted-foreground">{item.note}</p>
				</article>
			{/each}
		</div>
		<div class="mt-4 flex flex-wrap gap-3">
			<Button href="/projects" variant="outline" onclick={() => trackCta('fit_open_projects')}>
				Review Projects
			</Button>
			<Button href="/pricing" variant="outline" onclick={() => trackCta('fit_open_pricing')}>
				View Pricing
			</Button>
		</div>
	</div>

	<div class="panel mb-6">
		<p class="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Recruiter Snapshot</p>
		<ul class="mt-4 grid gap-2 md:grid-cols-2">
			{#each recruiterSignals as signal, index (signal + index)}
				<li class="text-sm text-muted-foreground">{signal}</li>
			{/each}
		</ul>
	</div>

	<div class="panel">
		<div class="flex items-center justify-between gap-3">
			<h2 class="text-xl font-semibold md:text-2xl">Featured Projects</h2>
			<Button variant="outline" href="/projects" onclick={() => trackCta('featured_all_projects')}>
				All Projects
			</Button>
		</div>

		<div class="mt-5 space-y-3">
			{#each featuredProjects as project (project.slug)}
				<a href={`/projects/${project.slug}`} class="item-card block">
					<p class="text-base font-semibold">{project.title}</p>
					<p class="mt-1 text-sm text-muted-foreground">{project.description}</p>
					<div class="mt-3 flex flex-wrap gap-1.5">
						{#each projectEvidenceTags(project) as tag (tag)}
							<span
								class="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-primary"
							>
								{tag}
							</span>
						{/each}
					</div>
					<p class="mt-2 inline-flex items-center gap-1 text-sm text-primary">
						Read Case Study
						<ArrowRight size={14} />
					</p>
				</a>
			{/each}
		</div>
	</div>
</section>

<section class="border-t border-white/10 py-8">
	<div class="panel">
		<About pageData={data.data} />
	</div>
</section>

<Skills pageData={data.data} />
<Experience />
<Services />
<section id="pricing" class="section-wrap border-t border-white/10 py-10 md:py-12">
	<div class="panel">
		<p class="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Pricing</p>
		<h2 class="mt-2 text-2xl font-bold md:text-3xl">Project investment guide</h2>
		<p class="mt-3 max-w-3xl text-sm text-muted-foreground">
			Transparent packages for South African clients. Final investment depends on scope, integrations,
			and delivery timeline.
		</p>
		<div class="mt-6 grid gap-3 md:grid-cols-3">
			{#each pricingPlans as plan}
				<article class="item-card">
					<p class="text-sm font-semibold">{plan.name}</p>
					<p class="mt-2 text-xl font-bold text-primary">{plan.range}</p>
					<p class="mt-1 text-xs text-muted-foreground">{plan.timeline}</p>
					<p class="mt-3 text-sm text-muted-foreground">{plan.ideal_for}</p>
				</article>
			{/each}
		</div>
		<div class="mt-6 flex flex-wrap gap-3">
			<Button href="/#contact" onclick={() => trackCta('pricing_request_quote')}>Request Quote</Button>
			<Button variant="outline" href="/pricing" onclick={() => trackCta('pricing_full_pricing')}>
				Full Pricing
			</Button>
			<Button variant="outline" href="/projects" onclick={() => trackCta('pricing_full_projects')}>
				Full Projects
			</Button>
		</div>
	</div>
</section>
<Contact pageData={data.data} />
