<script>
	import About from '$lib/pages/About.svelte';
	import Contact from '$lib/pages/Contact.svelte';
	import Projects from '$lib/pages/Projects.svelte';
	import Services from '$lib/pages/Services.svelte';
	import Skills from '$lib/pages/Skills.svelte';

	let { data } = $props();
	let validPages = $state(['skills', 'about', 'contact', 'services', 'projects']);

	const pages = [
		{
			title: 'Projects',
			children: Projects
		},
		{
			title: 'Skills',
			children: Skills
		},
		{
			title: 'About',
			children: About
		},
		{
			title: 'Contact',
			children: Contact
		},
		{
			title: 'Services',
			children: Services
		}
	];
</script>

{#if validPages.includes(data.page)}
	{#each pages as page}
		{#if page.title.toLowerCase() === data.page}
			<title>{page.title} | Lethabo Maepa</title>
			<page.children />
		{/if}
	{/each}
{:else}
	<p>Page not found</p>
{/if}
