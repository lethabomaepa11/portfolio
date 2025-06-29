<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import About from '$lib/pages/About.svelte';
	import Contact from '$lib/pages/Contact.svelte';
	import Services from '$lib/pages/Services.svelte';
	import Skills from '$lib/pages/Skills.svelte';
	import { Linkedin, Github, Mail, Download, Youtube } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import Page from './projects/+page.svelte';

	// Props for customizable content
	let {
		title = 'Full-Stack Developer',
		subtitle = 'Turning ideas into digital reality',
		data
	} = $props();
	const pages = [
		{
			title: 'About',
			children: About
		},
		{
			title: 'Projects',
			children: Page
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

<svelte:head>
	<title>Lethabo Maepa</title>
	<meta name="description" content={data.data.info.headline} />
</svelte:head>

<section class="bg-gradient-to-b from-gray-900 to-gray-800 px-4 py-10 md:py-10">
	<div class="container mx-auto max-w-6xl">
		<div class="flex flex-col items-center gap-12 md:flex-row" transition:slide={{ duration: 500 }}>
			<!-- Text Content -->
			<div class="text-center md:w-1/2 md:text-left">
				<div in:slide={{ delay: 300, duration: 500 }}>
					<h1 class="mb-6 text-4xl font-bold md:text-6xl">
						Hey, I'm <span
							oncopy={() => {
								if (prompt('Wish to copy my name?') == 'edit') {
									alert('Okay');
									window.location.href = '/editor';
								}
							}}
							class="text-blue-400">Lethabo Maepa</span
						>
					</h1>
					<p class="mb-8 text-xl md:text-2xl">
						{data.data.info.headline}
					</p>
				</div>

				<!-- Call to Action Buttons -->
				<div class="mb-12 flex justify-center gap-4 md:justify-start" in:fade={{ delay: 600 }}>
					<Button color="alternative" class="group" href={isMobile ? '#projects' : '/projects'}>
						View my projects
						<span class="ml-2 transition-transform group-hover:translate-x-1">
							<Download size={20} />
						</span>
					</Button>
					<Button color="blue" href={isMobile ? '#contact' : '/contact'}>Get in Touch</Button>
				</div>

				<!-- Social Links -->
				<div class="flex justify-center gap-6 md:justify-start" in:fade={{ delay: 900 }}>
					<a
						href={data.data.info.linkedin}
						target="_blank"
						class="text-gray-400 transition-colors hover:text-blue-400"
					>
						<Linkedin size={24} />
					</a>
					<a
						href={data.data.info.github}
						target="_blank"
						class="text-gray-400 transition-colors hover:text-blue-400"
					>
						<Github size={24} />
					</a>
					<a
						href={`mailto:${data.data.info.email}`}
						target="_blank"
						class="text-gray-400 transition-colors hover:text-blue-400"
					>
						<Mail size={24} />
					</a>
					<a
						href="https://www.youtube.com/@lethabomaepa11"
						target="_blank"
						class="text-gray-400 transition-colors hover:text-blue-400"
					>
						<Youtube size={24} />
					</a>
				</div>
			</div>

			<!-- Profile Image -->
			<div
				class="mt-12 md:mt-0 md:w-1/2"
				in:slide={{ delay: 300, duration: 500, direction: 'right' }}
			>
				<div class="group relative">
					<img
						src="/coder.png"
						alt="Lethabo Maepa"
						class="relative mx-auto w-full max-w-md transform transition-transform group-hover:-translate-y-2"
					/>
				</div>
			</div>
		</div>
	</div>
</section>
{#if isMobile}
	{#each pages as page}
		<page.children pageData={data.data} data={data.data} />
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
