<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import About from '$lib/pages/About.svelte';
	import Contact from '$lib/pages/Contact.svelte';
	import Experience from '$lib/pages/Experience.svelte';
	import Services from '$lib/pages/Services.svelte';
	import Skills from '$lib/pages/Skills.svelte';
	import Seo from '$lib/custom_components/SEO.svelte';
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
	const recruiterSignals = [
		'Open to Graduate / Junior Software Developer roles',
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
	desc={data?.data?.info?.headline || 'Graduate developer building practical web products.'}
/>

<section class="py-6 md:py-10" in:fade={{ duration: 240 }}>
	<div class="panel">
		<p class="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Graduate Developer</p>
		<h1 class="mt-3 max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
			Lethabo Maepa
		</h1>
		<p class="mt-4 max-w-3xl text-base text-muted-foreground md:text-lg">{data.data.info.headline}</p>
		<p class="mt-2 text-sm text-primary">
			Actively seeking graduate-level software engineering opportunities.
		</p>

		<div class="mt-6 flex flex-wrap gap-3">
			<Button href="/projects">View Projects</Button>
			<Button href="/contact" variant="outline">Contact Me</Button>
			<Button href="/pricing" variant="outline">Pricing</Button>
			{#if data.data.info.resume}
				<Button href={data.data.info.resume} target="_blank" variant="outline">
					<Download size={15} />
					Resume
				</Button>
			{/if}
		</div>

		<div class="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
			<a href={data.data.info.linkedin} target="_blank" rel="noreferrer" class="inline-flex items-center gap-2 hover:text-primary">
				<Linkedin size={16} />
				LinkedIn
			</a>
			<a href={data.data.info.github} target="_blank" rel="noreferrer" class="inline-flex items-center gap-2 hover:text-primary">
				<Github size={16} />
				GitHub
			</a>
			<a href={`mailto:${data.data.info.email}`} class="inline-flex items-center gap-2 hover:text-primary">
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
			{#each recruiterSignals as signal}
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
			{#each featuredProjects as project}
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

{#if isMobile}
	<ProjectsPage data={{ projects: data.data.projects }} />
	<Skills pageData={data.data} />
	<Experience />
	<Services />
	<Contact pageData={data.data} />
{/if}
