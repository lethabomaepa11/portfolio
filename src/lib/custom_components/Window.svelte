<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import About from '$lib/pages/About.svelte';
	import Contact from '$lib/pages/Contact.svelte';
	import Projects from '$lib/pages/Projects.svelte';
	import Services from '$lib/pages/Services.svelte';
	import Skills from '$lib/pages/Skills.svelte';
	import { Maximize, Minimize2, MinusIcon, X } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';

	let { page, pageData } = $props();
	let reactivePage = $state(page);
	let targetEl = $state();
	let triggerEl = $state();
	let instanceOptions = $state();
	let options = $state();
	let popover = $state({ options: { triggerType: 'hover' } });
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
	const handleWindowState = () => {
		popover.destroy();
		if (reactivePage.state == 'max') {
			options.triggerType = 'click';
			popover = new Popover(targetEl, triggerEl, options, instanceOptions);
			reactivePage.state = 'min';
		} else {
			options.triggerType = 'hover';
			popover = new Popover(targetEl, triggerEl, options, instanceOptions);
			reactivePage.state = 'max';
		}
	};

	const handleClose = () => {
		options.triggerType = 'click';
		popover = new Popover(targetEl, triggerEl, options, instanceOptions);
		reactivePage.state = 'closed';
		popover.hide();
	};
	onMount(() => {
		// set the popover content element
		targetEl = document.getElementById(`window-${page.title}`);

		// set the element that trigger the popover using hover or click
		triggerEl = document.getElementById(`button-${page.title}`);

		// options with default values
		options = {
			triggerType: 'click',
			offset: 10,
			onHide: () => {
				reactivePage.state == 'closed' ? '' : popover.show();
			},
			onShow: () => {}
		};

		// instance options object
		instanceOptions = {
			id: `window-${page.title}`,
			override: true
		};
		popover = new Popover(targetEl, triggerEl, options, instanceOptions);
	});
</script>

<div
	transition:slide={{ delay: 300, duration: 500, direction: 'right' }}
	data-popover
	id="window-{page.title}"
	role="tooltip"
	onHide={() => console.log('nah')}
	class="min-h[90svh] invisible absolute left-0 inline-block {reactivePage.state == 'max'
		? 'fixed top-0 z-40 -mt-10'
		: 'z-10 rounded-lg'} max-h-[{reactivePage.state == 'max'
		? '100svh'
		: '90svh'}] w-[{reactivePage.state == 'max'
		? '100svw'
		: '60svw'}] overflow-hidden border border-gray-600 bg-gray-800 text-sm text-gray-400 opacity-0 shadow-lg transition-opacity duration-300"
>
	<div
		class="flex items-center justify-between rounded-t-lg border-b border-gray-600 bg-gray-700 px-3 py-2"
	>
		<h3 class="font-semibold text-white">{page.title}</h3>
		<span class="flex">
			{#if reactivePage.state == 'max'}
				<Button variant="ghost" onclick={handleWindowState}><Minimize2 /></Button>
			{:else}
				<Button variant="ghost" onclick={handleWindowState}><Maximize /></Button>
			{/if}
			<Button variant="ghost" class="hover:bg-red-600" onclick={handleClose}><X /></Button>
		</span>
	</div>
	<div class="h-[80svh] w-full overflow-auto px-3 py-2">
		{#each pages as thisPage}
			{#if thisPage.title === page.title}
				<thisPage.children {pageData}/>
			{/if}
		{/each}
	</div>
</div>
