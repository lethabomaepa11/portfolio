<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import { BrainCog, Contact, FolderCode, HelpingHand, House, User } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';
	let { isMobile } = $props();

	let menuItems = [
		{
			title: 'Home',
			url: '',
			icon: House,
			variant: 'ghost'
		},
		{
			title: 'Projects',
			url: 'projects',
			icon: FolderCode,
			variant: 'ghost'
		},
		{
			title: 'Skills',
			url: 'skills',
			icon: BrainCog,
			variant: 'ghost'
		},
		{
			title: 'Services',
			url: 'services',
			icon: HelpingHand,
			variant: 'ghost'
		},
		{
			title: 'About',
			url: 'about',
			icon: User,
			variant: 'ghost'
		},
		{
			title: 'Contact',
			url: 'contact',
			icon: Contact,
			variant: 'ghost'
		}
	];
</script>

<nav
	class="flex h-full w-full flex-col gap-1 p-2"
	transition:slide={{ delay: 300, duration: 300, direction: 'right' }}
>
	<div class="flex h-full flex-col items-start gap-5">
		{#each menuItems as item}
			<a
				variant={item.variant}
				size={isMobile ? 'lg' : 'icon'}
				href={!isMobile ? `/${item.url}` : `/#${item.url}`}
				class="group flex w-full items-center gap-2 p-3 {isMobile
					? $page.url.hash === `#${item.url}`
					: ''} {$page.url?.pathname === `/${item.url}`
					? ' bg-blue-400/50'
					: ''}   justify-center rounded-lg {item.class ??
					''} hover:bg-gray-200 hover:dark:bg-gray-800"
				aria-label={item.title}
				stateactive={$page.url?.pathname === item.url}
			>
				<item.icon
					size={24}
					class="text-muted-foreground transition-colors group-hover:text-foreground"
				/>
				<span class="text-xs font-medium">{item.title}</span>
			</a>
		{/each}
	</div>
</nav>
