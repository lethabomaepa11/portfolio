<script>
	import { browser } from '$app/environment';
	import { afterNavigate, beforeNavigate, goto, onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
	import AiChat from '$lib/custom_components/AIChat.svelte';
	import Footer from '$lib/custom_components/Footer.svelte';
	import ModeToggle from '$lib/custom_components/ModeToggle.svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import { models, portfolioContext } from '$lib/state.svelte';
	import { Menu, MousePointer2, X } from 'lucide-svelte';
	import { ModeWatcher } from 'mode-watcher';
	import NProgress from 'nprogress';
	import 'nprogress/nprogress.css';
	import { onMount } from 'svelte';
	import '../app.css';

	let { children, data } = $props();
	let isLoading = $state(true);
	let isMobile = $state(false);
	let showMenu = $state(false);
	let showBootOverlay = $state(true);
	let introMessage = $state('Loading portfolio');
	let introTone = $state('default');
	let showExitOverlay = $state(false);
	let exitMessage = $state('Leaving page');
	let activeSection = $state('about');
	let navFeedbackVisible = $state(false);
	let navFeedbackTitle = $state('');
	let showCustomCursor = $state(false);
	let customCursorX = $state(0);
	let customCursorY = $state(0);
	let customCursorMode = $state('default');
	let timelinePoints = $state([]);
	let scrollProgress = $state(0);
	let reloadIntent = false;
	let isExiting = false;
	let pendingSection = '';
	let scrollRaf = 0;

	const links = $state([
		{ title: 'About', href: '/#about', key: 'about' },
		{ title: 'Projects', href: '/#projects', key: 'projects' },
		{ title: 'Skills', href: '/#skills', key: 'skills' },
		{ title: 'Experience', href: '/#experience', key: 'experience' },
		{ title: 'Services', href: '/#services', key: 'services' },
		{ title: 'Pricing', href: '/#pricing', key: 'pricing' },
		{ title: 'Contact', href: '/#contact', key: 'contact' }
	]);
	const sectionKeys = new Set(links.map((link) => link.key));

	const updateIsMobile = () => {
		isMobile = new IsMobile().current;
	};

	const normalizeSection = (value) => {
		const normalized = String(value ?? '')
			.replace(/^#/, '')
			.trim()
			.toLowerCase();
		return sectionKeys.has(normalized) ? normalized : null;
	};

	const getSectionFromHash = (hash) => normalizeSection(hash);

	const getActiveSectionFromViewport = () => {
		let nearest = 'about';
		let nearestDistance = Number.POSITIVE_INFINITY;
		for (const section of links) {
			const element = document.getElementById(section.key);
			if (!element) continue;
			const distance = Math.abs(element.getBoundingClientRect().top - 120);
			if (distance < nearestDistance) {
				nearestDistance = distance;
				nearest = section.key;
			}
		}
		activeSection = nearest;
	};

	const updateTimelineMetrics = () => {
		if (!browser) return;
		const doc = document.documentElement;
		const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
		scrollProgress = Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100));

		timelinePoints = links
			.map((section) => {
				const element = document.getElementById(section.key);
				if (!element) return null;
				const top = Math.max(0, element.getBoundingClientRect().top + window.scrollY);
				const position = Math.min(100, Math.max(0, (top / maxScroll) * 100));
				return { ...section, position };
			})
			.filter(Boolean);
	};

	const stopNavFeedback = () => {
		navFeedbackVisible = false;
		navFeedbackTitle = '';
		if (scrollRaf) {
			window.cancelAnimationFrame(scrollRaf);
			scrollRaf = 0;
		}
	};

	const startNavFeedback = (section) => {
		const link = links.find((item) => item.key === section);
		navFeedbackTitle = link?.title ?? section;
		navFeedbackVisible = true;
	};

	const resolveCursorMode = (target) => {
		if (!(target instanceof Element)) return 'default';
		const editableTarget = target.closest(
			'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, [contenteditable="true"], [contenteditable=""], [role="textbox"]'
		);
		if (editableTarget) return 'text';

		const interactiveTarget = target.closest(
			'a, button, summary, select, label, [role="button"], [role="link"], [tabindex]'
		);
		if (interactiveTarget) return 'pointer';

		const computedCursor = window.getComputedStyle(target).cursor;
		if (computedCursor.includes('text')) return 'text';
		if (computedCursor.includes('pointer')) return 'pointer';
		return 'default';
	};

	const scrollToSection = (section) => {
		if (!browser) return;
		const targetSection = normalizeSection(section);
		if (!targetSection) return;

		const targetElement = document.getElementById(targetSection);
		if (!targetElement) {
			stopNavFeedback();
			return;
		}

		const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 64;
		const offset = headerHeight + 14;
		const top = Math.max(0, window.scrollY + targetElement.getBoundingClientRect().top - offset);
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const maxDuration = reduceMotion ? 180 : 2400;

		startNavFeedback(targetSection);
		window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
		activeSection = targetSection;

		const startedAt = performance.now();
		const checkArrival = () => {
			const distance = Math.abs(window.scrollY - top);
			const targetRect = targetElement.getBoundingClientRect();
			const anchorLine = offset + 8;
			const arrived =
				distance < 6 || (targetRect.top <= anchorLine && targetRect.bottom > anchorLine);
			const timedOut = performance.now() - startedAt > maxDuration;
			if (arrived || timedOut) {
				window.history.replaceState({}, '', `/#${targetSection}`);
				activeSection = targetSection;
				pendingSection = '';
				updateTimelineMetrics();
				stopNavFeedback();
				return;
			}
			scrollRaf = window.requestAnimationFrame(checkArrival);
		};

		if (scrollRaf) window.cancelAnimationFrame(scrollRaf);
		scrollRaf = window.requestAnimationFrame(checkArrival);
	};

	const handleSectionNavigation = async (event, section) => {
		if (
			event.button !== 0 ||
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey ||
			event.defaultPrevented
		) {
			return;
		}

		event.preventDefault();
		const targetSection = normalizeSection(section) ?? 'about';
		if (isMobile) showMenu = false;

		if ($page.url.pathname !== '/') {
			pendingSection = targetSection;
			startNavFeedback(targetSection);
			await goto(`/#${targetSection}`);
			return;
		}

		scrollToSection(targetSection);
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

	const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

	const startExitTransition = (message, callback) => {
		if (!browser) return;
		if (isExiting) return;
		isExiting = true;
		exitMessage = message;
		showExitOverlay = true;
		document.documentElement.classList.add('app-leaving');

		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		window.setTimeout(
			() => {
				callback?.();
			},
			reduceMotion ? 0 : 320
		);
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

		if (!browser) return;
		if ($page.url.pathname !== '/') {
			stopNavFeedback();
			return;
		}

		const sectionFromHash = getSectionFromHash($page.url.hash) ?? pendingSection;
		if (sectionFromHash) {
			window.setTimeout(() => scrollToSection(sectionFromHash), 30);
			return;
		}

		getActiveSectionFromViewport();
		updateTimelineMetrics();
	});

	$effect(() => {
		portfolioContext.info = data.data;
	});

	onMount(async () => {
		const root = document.documentElement;
		requestAnimationFrame(() => {
			root.classList.add('app-ready');
		});

		const handleKeydown = (event) => {
			const key = event.key?.toLowerCase();
			if (event.key === 'F5' || ((event.ctrlKey || event.metaKey) && key === 'r')) {
				reloadIntent = true;
				event.preventDefault();
				startExitTransition('Reloading page', () => window.location.reload());
			}
		};

		const handleBeforeUnload = () => {
			if (isExiting) return;
			root.classList.add('app-leaving');
			exitMessage = reloadIntent ? 'Reloading page' : 'Leaving page';
			showExitOverlay = true;
		};
		const handleScroll = () => {
			if ($page.url.pathname === '/') {
				getActiveSectionFromViewport();
				updateTimelineMetrics();
			}
		};
		const handleHashChange = () => {
			if ($page.url.pathname !== '/') return;
			const section = getSectionFromHash(window.location.hash);
			if (!section) return;
			pendingSection = section;
			scrollToSection(section);
		};
		const supportsFinePointer = window.matchMedia('(pointer: fine)').matches;
		const handleMouseMove = (event) => {
			customCursorX = event.clientX + 16;
			customCursorY = event.clientY + 16;
			customCursorMode = resolveCursorMode(event.target);
			showCustomCursor = true;
		};
		const handleMouseLeave = () => {
			showCustomCursor = false;
		};
		const handleMouseEnter = () => {
			showCustomCursor = true;
		};
		const handleResize = () => {
			updateIsMobile();
			if ($page.url.pathname === '/') {
				updateTimelineMetrics();
				getActiveSectionFromViewport();
			}
		};

		const navigationEntry = performance.getEntriesByType('navigation')?.[0];
		const isReload = navigationEntry?.type === 'reload';
		const hasVisited = sessionStorage.getItem('portfolio_visited') === '1';

		if (isReload) {
			introMessage = 'Reloading page';
			introTone = 'reload';
		} else if (!hasVisited) {
			introMessage = 'Welcome, glad you are here.';
			introTone = 'warm';
		} else {
			introMessage = 'Loading portfolio';
			introTone = 'default';
		}
		sessionStorage.setItem('portfolio_visited', '1');

		updateIsMobile();
		window.addEventListener('resize', handleResize);
		window.addEventListener('keydown', handleKeydown);
		window.addEventListener('beforeunload', handleBeforeUnload);
		window.addEventListener('hashchange', handleHashChange);
		window.addEventListener('scroll', handleScroll, { passive: true });
		if (supportsFinePointer) {
			document.documentElement.classList.add('custom-cursor');
			window.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseleave', handleMouseLeave);
			document.addEventListener('mouseenter', handleMouseEnter);
		}
		await Promise.all([getModels(), delay(850)]);
		isLoading = false;
		showBootOverlay = false;
		updateTimelineMetrics();

		const initialSection = getSectionFromHash(window.location.hash);
		if (initialSection) {
			pendingSection = initialSection;
			window.setTimeout(() => scrollToSection(initialSection), 80);
		} else if ($page.url.pathname === '/') {
			getActiveSectionFromViewport();
			updateTimelineMetrics();
		}

		return () => {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('keydown', handleKeydown);
			window.removeEventListener('beforeunload', handleBeforeUnload);
			window.removeEventListener('hashchange', handleHashChange);
			window.removeEventListener('scroll', handleScroll);
			if (supportsFinePointer) {
				document.documentElement.classList.remove('custom-cursor');
				window.removeEventListener('mousemove', handleMouseMove);
				document.removeEventListener('mouseleave', handleMouseLeave);
				document.removeEventListener('mouseenter', handleMouseEnter);
			}
			stopNavFeedback();
		};
	});

</script>

<ModeWatcher />

<div class="relative min-h-screen">
	<header class="sticky top-0 z-40 border-b border-white/10 bg-background shadow-[0_1px_0_rgba(255,255,255,0.04)]">
		<div class="section-wrap flex h-16 items-center justify-between">
			<a href="/" class="flex items-center" aria-label="Lethabo Maepa home">
				<img
					src="/logo/logo-light.svg"
					alt="Lethabo Maepa logo"
					class="h-5 w-auto dark:hidden md:h-6"
					loading="eager"
					decoding="async"
				/>
				<img
					src="/logo/logo.svg"
					alt="Lethabo Maepa logo"
					class="hidden h-5 w-auto dark:block md:h-6"
					loading="eager"
					decoding="async"
				/>
			</a>

			<nav class="hidden items-center gap-1 lg:flex">
				{#each links as item}
					<a
						href={item.href}
						onclick={(event) => handleSectionNavigation(event, item.key)}
						class="rounded-md px-3 py-2 text-sm transition-colors hover:bg-white/5 hover:text-primary {activeSection === item.key
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
						onclick={(event) => handleSectionNavigation(event, item.key)}
						class="rounded-lg px-3 py-2 text-sm font-medium {activeSection === item.key
							? 'bg-primary/15 text-primary'
							: 'text-muted-foreground hover:bg-white/5 hover:text-primary'}"
					>
						{item.title}
					</a>
				{/each}
			</nav>
		</div>
	{/if}

	{#if navFeedbackVisible}
		<div class="pointer-events-none fixed left-1/2 top-20 z-[73] -translate-x-1/2">
			<div class="rounded-full border border-primary/35 bg-card/90 px-4 py-2 shadow-xl backdrop-blur">
				<p class="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary/80">Routing</p>
				<p class="text-sm font-semibold text-foreground">Scrolling to {navFeedbackTitle}</p>
			</div>
		</div>
	{/if}

	{#if $page.url.pathname === '/' && !isMobile}
		<aside class="section-timeline" aria-label="Section timeline">
			<div class="section-timeline__track">
				<div class="section-timeline__progress" style={`height: ${scrollProgress}%;`}></div>
				{#each timelinePoints as point (point.key)}
					<button
						type="button"
						class="section-timeline__point {activeSection === point.key
							? 'section-timeline__point--active'
							: ''}"
						style={`top: ${point.position}%;`}
						title={point.title}
						aria-label={`Jump to ${point.title}`}
						onclick={() => scrollToSection(point.key)}
					>
						<span class="section-timeline__label" aria-hidden="true">
							{point.title}
						</span>
					</button>
				{/each}
			</div>
		</aside>
	{/if}

	{#if showCustomCursor}
		<div
			class="pointer-events-none fixed z-[90] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
			style={`left: ${customCursorX}px; top: ${customCursorY}px;`}
			aria-hidden="true"
		>
			{#if customCursorMode === 'text'}
				<div class="custom-cursor-shell custom-cursor-shell--text">
					<div class="custom-cursor-ibeam"></div>
				</div>
			{:else if customCursorMode === 'pointer'}
				<div class="custom-cursor-shell custom-cursor-shell--pointer">
					<MousePointer2 size={14} class="text-primary" />
				</div>
			{:else}
				<div class="custom-cursor-shell custom-cursor-shell--default">
					<div class="custom-cursor-dot"></div>
				</div>
			{/if}
		</div>
	{/if}

	<main class="section-wrap min-h-[70vh] py-10 md:py-12">
		{@render children()}
		<Footer />
	</main>
</div>

<AiChat {isMobile} />

{#if showExitOverlay || showBootOverlay || isLoading}
	<div
		class="site-intro-overlay {showExitOverlay
			? 'site-intro-overlay--exit'
			: introTone === 'warm'
				? 'site-intro-overlay--warm'
				: introTone === 'reload'
					? 'site-intro-overlay--reload'
					: ''}"
		aria-hidden="true"
	>
		<p class="site-intro-kicker">Portfolio</p>
		<h2 class="site-intro-name">Lethabo Maepa</h2>
		<p class="site-intro-message">{showExitOverlay ? exitMessage : introMessage}</p>
	</div>
{/if}
