<script>
	import Seo from '$lib/custom_components/SEO.svelte';
	import About from '$lib/pages/About.svelte';
	import Contact from '$lib/pages/Contact.svelte';
	import Experience from '$lib/pages/Experience.svelte';
	import Services from '$lib/pages/Services.svelte';
	import Skills from '$lib/pages/Skills.svelte';
	import { onMount } from 'svelte';
	import { derived } from 'svelte/store';

	let { data } = $props();
	let validPages = $state(['skills', 'experience', 'contact', 'services']);

	const pages = [
		{
			title: 'Skills',
			children: Skills,
			description: 'View My Skills'
		},
		{
			title: 'Experience',
			children: Experience,
			description: 'View My Experiences'
		},
		{
			title: 'Contact',
			children: Contact,
			description: "Here's how to Contact Me"
		},
		{
			title: 'Services',
			children: Services,
			description: 'View My Services'
		}
	];

	let currentPage = $state(
		pages.find((page) => {
			if (page.title.toLowerCase() === data.page) {
				return page;
			}
		})
	);

	onMount(() => {
		currentPage = pages.find((page) => {
			if (page.title.toLowerCase() === data.page) {
				return page;
			}
		});
	});
</script>

<Seo title={currentPage.title} desc={currentPage.description} />
{#if validPages.includes(data.page)}
	{#each pages as page}
		{#if page.title.toLowerCase() === data.page}
			<title>{page.title} | Lethabo Maepa</title>
			<page.children pageData={data.data} />
		{/if}
	{/each}
{:else}
	<p class="flex min-h-screen items-center justify-center text-center">Page not found</p>
{/if}
