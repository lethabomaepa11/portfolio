<script>
	import Seo from '$lib/custom_components/SEO.svelte';
	import Contact from '$lib/pages/Contact.svelte';
	import Experience from '$lib/pages/Experience.svelte';
	import Services from '$lib/pages/Services.svelte';
	import Skills from '$lib/pages/Skills.svelte';

	let { data } = $props();

	const pages = [
		{ key: 'skills', title: 'Skills', description: 'View technical capabilities', component: Skills },
		{
			key: 'experience',
			title: 'Experience',
			description: 'View professional experience',
			component: Experience
		},
		{
			key: 'contact',
			title: 'Contact',
			description: 'Get in touch',
			component: Contact
		},
		{ key: 'services', title: 'Services', description: 'See available services', component: Services }
	];

	const currentPage = $derived(pages.find((entry) => entry.key === data.page));
</script>

{#if currentPage}
	<Seo title={currentPage.title} desc={currentPage.description} />
	<currentPage.component pageData={data.data} />
{:else}
	<div class="section-wrap py-12">
		<div class="surface-card text-center">
			<p class="text-sm text-muted-foreground">Page not found.</p>
		</div>
	</div>
{/if}
