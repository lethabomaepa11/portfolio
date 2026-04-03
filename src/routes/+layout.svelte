<script>
	import { browser } from '$app/environment';
	import { afterNavigate, beforeNavigate, onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
	import AiChat from '$lib/custom_components/AIChat.svelte';
	import Footer from '$lib/custom_components/Footer.svelte';
	import ModeToggle from '$lib/custom_components/ModeToggle.svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import { models, portfolioContext } from '$lib/state.svelte';
	import { Menu, X } from 'lucide-svelte';
	import { ModeWatcher } from 'mode-watcher';
	import NProgress from 'nprogress';
	import 'nprogress/nprogress.css';
	import { onMount } from 'svelte';
	import '../app.css';

	let { children, data } = $props();
	let isLoading = $state(true);
	let isMobile = $state(false);
	let showMenu = $state(false);

	const links = $state([
		{ title: 'About', href: '/', key: '' },
		{ title: 'Projects', href: '/projects', key: 'projects' },
		{ title: 'Skills', href: '/skills', key: 'skills' },
		{ title: 'Experience', href: '/experience', key: 'experience' },
		{ title: 'Services', href: '/services', key: 'services' },
		{ title: 'Pricing', href: '/pricing', key: 'pricing' },
		{ title: 'Contact', href: '/contact', key: 'contact' }
	]);

	const updateIsMobile = () => {
		isMobile = new IsMobile().current;
	};

	const getModels = async () => {
		try {
			const response = await fetch('/api/ai/models');
			const payload = await response.json();
			models.data = payload?.models?.data ?? [];
		} catch {
			models.data = [];
		}
	};

	beforeNavigate(() => {
		NProgress.start();
	});

	if (browser) {
		onNavigate((navigation) => {
			const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			if (!document.startViewTransition || reduceMotion) return;

			return new Promise((resolve) => {
				document.documentElement.classList.add('route-changing');
				const transition = document.startViewTransition(async () => {
					resolve();
					await navigation.complete;
				});
				transition.finished.finally(() => {
					document.documentElement.classList.remove('route-changing');
				});
			});
		});
	}

	afterNavigate(() => {
		NProgress.done();
		if (isMobile) {
			showMenu = false;
		}
	});

	$effect(() => {
		portfolioContext.info = data.data;
	});

	onMount(async () => {
		const root = document.documentElement;
		requestAnimationFrame(() => {
			root.classList.add('app-ready');
		});

		const handleBeforeUnload = () => {
			root.classList.add('app-leaving');
		};

		updateIsMobile();
		window.addEventListener('resize', updateIsMobile);
		window.addEventListener('beforeunload', handleBeforeUnload);
		await getModels();
		isLoading = false;

		return () => {
			window.removeEventListener('resize', updateIsMobile);
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	});
</script>

<ModeWatcher />

{#if isLoading}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
		<p class="text-sm font-medium tracking-wide text-muted-foreground">Loading portfolio...</p>
	</div>
{/if}

<div class="relative min-h-screen">
	<header class="sticky top-0 z-40 border-b border-white/10 bg-background shadow-[0_1px_0_rgba(255,255,255,0.04)]">
		<div class="section-wrap flex h-16 items-center justify-between">
			<a href="/" class="text-base font-semibold tracking-wide text-foreground md:text-lg">
				Lethabo Maepa
			</a>

			<nav class="hidden items-center gap-1 lg:flex">
				{#each links as item}
					<a
						href={item.href}
						class="rounded-md px-3 py-2 text-sm transition-colors hover:bg-white/5 hover:text-primary {$page.url.pathname === item.href
							? 'bg-primary/15 text-primary'
							: 'text-muted-foreground'}"
					>
						{item.title}
					</a>
				{/each}
			</nav>

			<div class="flex items-center gap-2">
				<ModeToggle />
				{#if isMobile}
					<Button
						variant="outline"
						size="icon"
						aria-label="Toggle Menu"
						onclick={() => (showMenu = !showMenu)}
					>
						{#if showMenu}
							<X size={18} />
						{:else}
							<Menu size={18} />
						{/if}
					</Button>
				{/if}
			</div>
		</div>
	</header>

	{#if isMobile && showMenu}
		<div class="fixed inset-x-4 top-20 z-50 rounded-lg border border-white/10 bg-background p-2">
			<nav class="grid gap-1">
				{#each links as item}
					<a
						href={item.href}
						class="rounded-lg px-3 py-2 text-sm font-medium {$page.url.pathname === item.href
							? 'bg-primary/15 text-primary'
							: 'text-muted-foreground hover:bg-white/5 hover:text-primary'}"
					>
						{item.title}
					</a>
				{/each}
			</nav>
		</div>
	{/if}

	<main class="section-wrap min-h-[70vh] py-10 md:py-12">
		{@render children()}
		<Footer />
	</main>
</div>

<AiChat {isMobile} />
