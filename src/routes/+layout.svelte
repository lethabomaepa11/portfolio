<script>
	import ModeToggle from '$lib/custom_components/ModeToggle.svelte';
	import Sidebar from '$lib/custom_components/Sidebar.svelte';
	import {
		AppWindow,
		ArrowDown,
		ArrowUp,
		BrainCog,
		Contact,
		FolderCode,
		HelpingHand,
		House,
		Menu,
		User,
		X
	} from 'lucide-svelte';
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import Button from '$lib/components/ui/button/button.svelte';
	import MenuPopUp from '$lib/custom_components/MenuPopUp.svelte';
	import { page } from '$app/stores';
	import moment from 'moment';
	import Window from '$lib/custom_components/Window.svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import { onMount } from 'svelte';
	import { fly, slide } from 'svelte/transition';
	import Loading from '$lib/custom_components/Loading.svelte';

	let { children, data } = $props();
	let isLoading = $state(true);
	const taskBarItems = [
		{
			title: 'Home',
			url: '/',
			icon: House
		},
		{
			title: 'Projects',
			url: '/projects',
			icon: FolderCode
		},
		{
			title: 'Skills',
			url: '/skills',
			icon: BrainCog
		},
		{
			title: 'Services',
			url: '/services',
			icon: HelpingHand
		},
		{
			title: 'About',
			url: '/about',
			icon: User
		},
		{
			title: 'Contact',
			url: '/contact',
			icon: Contact
		}
	];

	let time = $state(moment().format('HH:mm'));
	let date = $state(moment().format('YYYY/MM/DD'));
	let openWindows = $state([]); //should have a store instead, to detect how many windows are open
	/**There must not be a limit to the number of open windows
	 * State of the windows can either be minimized, maximized or closed.
	 * Also add a feature where windows open side by side.
	 */
	setInterval(() => {
		time = moment().format('HH:mm');
		date = moment().format('YYYY/MM/DD');
	}, 1000);
	let mobile = $state(new IsMobile());
	let isMobile = $state(mobile.current);
	let showSidebar = $state(!isMobile);
	let navBarAtTop = $state(true);
	onMount(() => {
		window.addEventListener('resize', () => {
			mobile = new IsMobile();
			isMobile = mobile.current;
			showSidebar = !isMobile;
		});
		let localNb = localStorage.getItem('navBarAtTop');
		if (localNb) {
			navBarAtTop = localNb === 'true';
		}
		isLoading = false;
	});

	const toggleNavBarAtTop = () => {
		navBarAtTop = !navBarAtTop;
		localStorage.setItem('navBarAtTop', navBarAtTop);
	};
</script>

<ModeWatcher />
{#if isLoading}
	<title>Loading...</title>
	<Loading />
{:else}
	<main class="flex items-center justify-center divide-x">
		{#if showSidebar}
			<div
				transition:fly
				class="{navBarAtTop && !isMobile ? '-mt-16' : 'top-0 h-[92svh]'} min-w-[13svw] {isMobile
					? 'fixed left-0  z-50 h-screen w-[40svw] bg-background/95'
					: ''}"
			>
				{#if isMobile}
					<h2 class="flex w-full items-center justify-between p-1 text-xl font-bold text-blue-400">
						Menu
						<Button variant="ghost" size="icon" onclick={() => (showSidebar = false)}><X /></Button>
					</h2>
				{/if}
				<Sidebar {isMobile} />
			</div>
		{:else}
			<header
				transition:slide={{ delay: 150, duration: 500, direction: 'right' }}
				class="fixed top-0 z-50 flex h-14 w-full items-center justify-between bg-background/95 p-3 bg-blend-overlay"
			>
				<a href="/" class="  text-xl font-bold text-blue-400"><h1>Lethabo Maepa</h1></a>
				<span class="space-x-4">
					<ModeToggle />
					<Button onclick={() => (showSidebar = true)}><Menu /></Button>
				</span>
			</header>
		{/if}
		<div
			class="h-screen w-screen py-20 {navBarAtTop
				? 'md:h-[100svh]'
				: 'md:h-[91-svh]'} md:w-[85svw] md:overflow-auto lg:p-5"
		>
			{@render children()}
		</div>
	</main>
	{#if !isMobile}
		<section
			transition:slide={{ delay: 300, duration: 500, direction: 'right' }}
			class="fixed {navBarAtTop
				? 'top-0'
				: 'bottom-0'} bottom-0 left-0 right-0 z-50 flex h-[8svh] w-screen items-center justify-between gap-3 bg-background/80 p-3 backdrop-blur-sm"
		>
			<div id="left" class="flex items-center gap-3">
				<ModeToggle />
				<a href="/" class="  text-xl font-bold text-blue-400"><h1>Lethabo Maepa</h1></a>
			</div>
			<div id="center" class="flex items-center gap-5">
				{#each taskBarItems as item}
					<!--When hovering on an icon, if there's a window open for that icon, display the contents of that window otherwise
		just show the title of the icon on the tooltip-->
					<Button
						id="button-{item.title}"
						data-tooltip-target="tooltip-{item.url}"
						variant={'ghost'}
						class="group flex flex-col hover:-translate-y-1 {$page.url?.pathname === item.url
							? ' rounded-none border-b border-blue-400 p-5'
							: ''}   justify-center  transition-all {item.class ?? ''}"
					>
						<p class="">{item.title}</p>
					</Button>
					<Window pageData={data.data} page={item} />
					<div
						id="tooltip-{item.url}"
						role="tooltip"
						class="shadow-xs tooltip invisible absolute z-50 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 transition-opacity duration-300 dark:bg-gray-700"
					>
						{item.title}
						<div class="tooltip-arrow" data-popper-arrow></div>
					</div>
				{/each}
			</div>
			<div id="right" class="flex animate-bounce items-center gap-5 text-xs">
				<button type="button" onclick={toggleNavBarAtTop}>
					{#if navBarAtTop}
						<ArrowDown />
					{:else}
						<ArrowUp />
					{/if}
				</button>
			</div>
		</section>
	{/if}
{/if}
