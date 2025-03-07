<script>
	import ModeToggle from '$lib/custom_components/ModeToggle.svelte';
	import Sidebar from '$lib/custom_components/Sidebar.svelte';
	import {
		AppWindow,
		BrainCog,
		Contact,
		FolderCode,
		HelpingHand,
		House,
		Menu,
		User
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
	import { slide } from 'svelte/transition';
	import Loading from '$lib/custom_components/Loading.svelte';

	let { children } = $props();
	let isLoading = $state(true);
	const taskBarItems = [
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

	onMount(() => {
		window.addEventListener('resize', () => {
			mobile = new IsMobile();
			isMobile = mobile.current;
		});
		isLoading = false;
	});
</script>

<ModeWatcher />
{#if isLoading}
	<Loading />
{:else}
	<main class="flex items-center justify-center">
		{#if !isMobile}
			<div class="h-[92svh] min-w-[13svw]">
				<Sidebar />
			</div>
		{:else}
			<header
				class="fixed top-0 z-50 flex h-14 w-full items-center justify-between border bg-background/95 p-3 bg-blend-overlay"
			>
				<a href="/" class="  text-xl font-bold text-blue-400"><h1>Lethabo Maepa</h1></a>
				<span>
					<ModeToggle />
					<Button><Menu /></Button>
				</span>
			</header>
		{/if}
		<div
			class="h-screen w-screen py-20 md:h-[91svh] md:w-[85svw] md:overflow-auto md:rounded-lg md:shadow-2xl lg:p-5"
		>
			{@render children()}
		</div>
	</main>
	{#if !isMobile}
		<footer
			transition:slide={{ delay: 300, duration: 500, direction: 'right' }}
			class="fixed bottom-0 z-50 flex h-[8svh] w-screen items-center justify-between gap-3 border bg-background p-3"
		>
			<div id="left" class="flex items-center gap-3">
				<ModeToggle />
				<a href="/" class="  text-xl font-bold text-blue-400"><h1>Lethabo Maepa</h1></a>
			</div>
			<div id="center" class="flex items-center gap-5">
				<Button
					data-tooltip-target="tooltip-menu"
					type="button"
					data-popover-target="popover-click"
					data-popover-trigger="click"
					variant="outline"
					size="icon"
				>
					<AppWindow />
				</Button>
				<div
					id="tooltip-menu"
					role="tooltip"
					class="shadow-xs tooltip invisible absolute z-50 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 transition-opacity duration-300 dark:bg-gray-700"
				>
					Menu
					<div class="tooltip-arrow" data-popper-arrow></div>
				</div>
				<MenuPopUp />
				{#each taskBarItems as item}
					<!--When hovering on an icon, if there's a window open for that icon, display the contents of that window otherwise
		just show the title of the icon on the tooltip-->
					<Button
						id="button-{item.title}"
						data-tooltip-target="tooltip-{item.url}"
						variant={$page.url?.pathname === item.url ? 'default' : 'outline'}
						class="group flex flex-col hover:-translate-y-1 {$page.url?.pathname === item.url
							? ' bg-blue-400/50'
							: ''}   justify-center rounded-lg  transition-all {item.class ?? ''}"
						size="icon"><item.icon /></Button
					>
					<Window page={item} />
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
			<div id="right" class="flex items-center gap-5 text-xs">
				<span class="flex flex-col items-end">
					<p>{time}</p>
					<p>{date}</p>
				</span>
			</div>
		</footer>
	{/if}
{/if}
