<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import About from '$lib/pages/About.svelte';
	import Contact from '$lib/pages/Contact.svelte';
	import Projects from '$lib/pages/Projects.svelte';
	import Services from '$lib/pages/Services.svelte';
	import Skills from '$lib/pages/Skills.svelte';
	import { Linkedin, Github, Mail, Download } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';

	// Props for customizable content
	let { title = 'Full-Stack Developer', subtitle = 'Turning ideas into digital reality',data } =
		$props();
	const pages = [
		{
			title: 'About',
			children: About
		},
		{
			title: 'Projects',
			children: Projects
		},
		{
			title: 'Skills',
			children: Skills
		},
		{
			title: 'Services',
			children: Services
		},

		{
			title: 'Contact',
			children: Contact
		}
	];
	let mobile = $state(new IsMobile());
	let isMobile = $state(mobile.current);

	onMount(() => {
		window.addEventListener('resize', () => {
			mobile = new IsMobile();
			isMobile = mobile.current;
		});
	});
</script>

<title>Home | Lethabo Maepa</title>

<section class="bg-gradient-to-b from-gray-900 to-gray-800 px-4 py-10 md:py-10">
	<div class="container mx-auto max-w-6xl">
		<div class="flex flex-col items-center gap-12 md:flex-row" transition:fade={{ duration: 500 }}>
			<!-- Text Content -->
			<div class="text-center md:w-1/2 md:text-left">
				<div in:slide={{ delay: 300, duration: 500 }}>
					<h1 class="mb-6 text-4xl font-bold md:text-6xl">
						Hi, I'm <span oncopy={() => {if(prompt("Wish to copy my name?") == "edit"){alert("Okay");window.location.href = "/editor"}}} class="text-blue-400">Lethabo Maepa</span>
					</h1>
					<p class="mb-8 text-xl md:text-2xl">
						{data.data.info.headline}
					</p>
				</div>

				<!-- Call to Action Buttons -->
				<div class="mb-12 flex justify-center gap-4 md:justify-start" in:fade={{ delay: 600 }}>
					<Button color="alternative" class="group" href="#projects">
						View Work
						<span class="ml-2 transition-transform group-hover:translate-x-1">
							<Download size={20} />
						</span>
					</Button>
					<Button color="blue" href="#contact">Get in Touch</Button>
				</div>

				<!-- Social Links -->
				<div class="flex justify-center gap-6 md:justify-start" in:fade={{ delay: 900 }}>
					<a href={data.data.info.linkedin} class="text-gray-400 transition-colors hover:text-blue-400">
						<Linkedin size={24} />
					</a>
					<a href={data.data.info.github} class="text-gray-400 transition-colors hover:text-blue-400">
						<Github size={24} />
					</a>
					<a href={`mailto:${data.data.info.email}`} class="text-gray-400 transition-colors hover:text-blue-400">
						<Mail size={24} />
					</a>
				</div>
			</div>

			<!-- Profile Image -->
			<div
				class="mt-12 animate-pulse md:mt-0 md:w-1/2"
				in:slide={{ delay: 300, duration: 500, direction: 'right' }}
			>
				<div class="group relative">
					<div
						class="absolute -inset-2 rounded-full bg-blue-400/30 blur-lg transition-opacity group-hover:opacity-75"
					></div>
					<img
						src="/coder.png"
						alt="Lethabo Maepa"
						class="relative mx-auto w-full max-w-md transform rounded-2xl transition-transform group-hover:-translate-y-2"
					/>
				</div>
			</div>
		</div>
	</div>
</section>
{#if isMobile}
	{#each pages as page}
		<page.children pageData={data.data} />
	{/each}
{/if}

<style>
	.container {
		view-transition-name: hero-container;
	}

	h1 {
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	img {
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
	}
</style>
