<script>
	import About from '$lib/pages/About.svelte';
	import Contact from '$lib/pages/Contact.svelte';
	import Services from '$lib/pages/Services.svelte';
	import Skills from '$lib/pages/Skills.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();
	let validPages = $state(['skills', 'about', 'contact', 'services']);

	const pages = [

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

{#if validPages.includes(data.page) }
	{#each pages as page}
		{#if page.title.toLowerCase() === data.page}
			<title>{page.title} | Lethabo Maepa</title>
			<page.children pageData={data.data}/>
		{/if}
	{/each}
{:else}
	<p>Page not found</p>
{/if}
