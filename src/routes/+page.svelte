<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import About from '$lib/pages/About.svelte';
	import Contact from '$lib/pages/Contact.svelte';
	import Experience from '$lib/pages/Experience.svelte';
	import Services from '$lib/pages/Services.svelte';
	import Skills from '$lib/pages/Skills.svelte';
	import Seo from '$lib/custom_components/SEO.svelte';
	import { portfolioContext } from '$lib/state.svelte';
	import { ArrowRight, Github, Linkedin, Mail, Download } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import ProjectsPage from './projects/+page.svelte';

	let { data } = $props();
	let isMobile = $state(false);

	const updateIsMobile = () => {
		isMobile = new IsMobile().current;
	};

	const featuredProjects = $derived((data.data.projects ?? []).slice(0, 3));
	const pricingPlans = $derived(portfolioContext.pricing ?? []);
	const githubAvatar = 'https://avatars.githubusercontent.com/u/129387924?v=4';
	const recruiterSignals = [
		'Currently employed; available for selective projects and strategic collaborations.',
		'Shipped projects with source code and live demos',
		'Clear case studies explaining problem-solving approach',
		'Strong foundation in SvelteKit, JavaScript/TypeScript, and APIs',
		'Transparent South African project pricing with clear scope bands'
	];

	onMount(() => {
		updateIsMobile();
		window.addEventListener('resize', updateIsMobile);
		return () => window.removeEventListener('resize', updateIsMobile);
	});
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
			<Button href="/projects">View Projects</Button>
			<Button href="/#contact" variant="outline">Contact Me</Button>
			<Button href="/pricing" variant="outline">Pricing</Button>
			{#if data.data.info.resume}
				<Button href={data.data.info.resume} target="_blank" variant="outline">
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
			>
				<Linkedin size={16} />
				LinkedIn
			</a>
			<a
				href={data.data.info.github}
				target="_blank"
				rel="noreferrer"
				class="inline-flex items-center gap-2 hover:text-primary"
			>
				<Github size={16} />
				GitHub
			</a>
			<a
				href={`mailto:${data.data.info.email}`}
				class="inline-flex items-center gap-2 hover:text-primary"
			>
				<Mail size={16} />
				Email
			</a>
		</div>
	</div>
</section>

<section class="border-t border-white/10 py-8" in:fade={{ duration: 240, delay: 80 }}>
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
			<Button variant="outline" href="/projects">All Projects</Button>
		</div>

		<div class="mt-5 space-y-3">
			{#each featuredProjects as project (project.slug)}
				<a href={`/projects/${project.slug}`} class="item-card block">
					<p class="text-base font-semibold">{project.title}</p>
					<p class="mt-1 text-sm text-muted-foreground">{project.description}</p>
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

<ProjectsPage data={{ projects: data.data.projects }} />
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
			<Button href="/#contact">Request Quote</Button>
			<Button variant="outline" href="/pricing">Full Pricing</Button>
			<Button variant="outline" href="/projects">Full Projects</Button>
		</div>
	</div>
</section>
<Contact pageData={data.data} />
