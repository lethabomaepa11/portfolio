<script>
	import { browser } from '$app/environment';
	import { afterNavigate, beforeNavigate, goto, onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import AiChat from '$lib/custom_components/AIChat.svelte';
	import Footer from '$lib/custom_components/Footer.svelte';
	import ModeToggle from '$lib/custom_components/ModeToggle.svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import {
		copyText,
		getRecruiterMetricsSnapshot,
		trackRecruiterAction
	} from '$lib/recruiter-tools.js';
	import { models, portfolioContext } from '$lib/state.svelte';
	import { Command, Menu, MousePointer2, NotebookPen, X } from 'lucide-svelte';
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
	let commandOpen = $state(false);
	let commandQuery = $state('');
	let commandIndex = $state(0);
	let recruiterNotesOpen = $state(false);
	let recruiterNotes = $state('');
	let commandFeedback = $state('');
	let showExitOverlay = $state(false);
	let exitMessage = $state('Leaving page');
	let recruiterPromptOpen = $state(false);
	let recruiterRoleInput = $state('');
	let recruiterProjectDescription = $state('');
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
	let commandFeedbackTimer = 0;
	const recruiterNotesKey = 'recruiter_notes_v1';
	const recruiterPromptSeenKey = 'recruiter_prompt_seen_v1';
	const recruiterRoleKey = 'recruiter_role_pref_v1';
	const recruiterProjectDescriptionKey = 'recruiter_project_desc_v1';

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

	const getTypingContext = (target) =>
		target instanceof Element &&
		Boolean(target.closest('input, textarea, select, [contenteditable="true"], [role="textbox"]'));

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
			trackRecruiterAction('nav_section_jump', { section: targetSection, source: 'menu' });
			await goto(`/#${targetSection}`);
			return;
		}

		trackRecruiterAction('nav_section_jump', { section: targetSection, source: 'menu' });
		scrollToSection(targetSection);
	};

	const setCommandFeedback = (message) => {
		commandFeedback = message;
		clearTimeout(commandFeedbackTimer);
		commandFeedbackTimer = setTimeout(() => {
			commandFeedback = '';
		}, 1400);
	};

	const closeCommandPalette = () => {
		commandOpen = false;
		commandQuery = '';
		commandIndex = 0;
	};

	const openCommandPalette = () => {
		commandOpen = true;
		commandQuery = '';
		commandIndex = 0;
	};

	const jumpToSection = async (section, source = 'command') => {
		const normalized = normalizeSection(section) ?? 'about';
		trackRecruiterAction('nav_section_jump', { section: normalized, source });
		if ($page.url.pathname !== '/') {
			pendingSection = normalized;
			startNavFeedback(normalized);
			await goto(`/#${normalized}`);
			return;
		}
		scrollToSection(normalized);
	};

	const openPath = async (path, action) => {
		trackRecruiterAction(action, { path, source: 'command' });
		await goto(path);
	};

	const openAiGeneratedPortfolio = async () => {
		const role = recruiterRoleInput.trim() || 'Software Engineer';
		const projectDescription = recruiterProjectDescription.trim();
		if (browser) {
			try {
				localStorage.setItem(recruiterPromptSeenKey, '1');
				localStorage.setItem(recruiterRoleKey, role);
				localStorage.setItem(recruiterProjectDescriptionKey, projectDescription);
			} catch {
				// no-op
			}
		}
		recruiterPromptOpen = false;
		trackRecruiterAction('open_ai_generated_portfolio', {
			role,
			hasProjectDescription: Boolean(projectDescription),
			source: 'recruiter_prompt'
		});
		const search = new URLSearchParams();
		search.set('role', role);
		if (projectDescription) search.set('project_description', projectDescription);
		await goto(`/ai-portfolio?${search.toString()}`);
	};

	const dismissRecruiterPrompt = (source = 'dismiss') => {
		recruiterPromptOpen = false;
		if (browser) {
			try {
				localStorage.setItem(recruiterPromptSeenKey, '1');
			} catch {
				// no-op
			}
		}
		trackRecruiterAction('recruiter_prompt_close', { source });
	};

	const openExternal = (url, action) => {
		if (!browser || !url) return;
		trackRecruiterAction(action, { url, source: 'command' });
		window.open(url, '_blank', 'noopener,noreferrer');
	};

	const copyValue = async (value, action, okMessage) => {
		const copied = await copyText(value);
		trackRecruiterAction(action, { copied, source: 'command' });
		setCommandFeedback(copied ? okMessage : 'Clipboard unavailable');
	};

	const encodeShareValue = (value) => {
		if (!value) return '';
		try {
			const bytes = new TextEncoder().encode(value);
			let binary = '';
			for (const byte of bytes) binary += String.fromCharCode(byte);
			return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
		} catch {
			return '';
		}
	};

	const decodeShareValue = (encoded) => {
		if (!encoded) return '';
		try {
			const normalized = encoded.replace(/-/g, '+').replace(/_/g, '/');
			const padding = '='.repeat((4 - (normalized.length % 4)) % 4);
			const binary = atob(normalized + padding);
			const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
			return new TextDecoder().decode(bytes);
		} catch {
			return '';
		}
	};

	const copyRecruiterNotesShareLink = async (source = 'drawer') => {
		if (!browser) return;
		const url = new URL(window.location.href);
		url.searchParams.delete('recruiter_notes');
		const encodedNotes = encodeShareValue(recruiterNotes || '');
		if (encodedNotes) {
			url.searchParams.set('rn', encodedNotes);
		} else {
			url.searchParams.delete('rn');
		}
		const role = recruiterRoleInput.trim();
		url.searchParams.delete('role');
		if (role) {
			url.searchParams.set('rr', encodeShareValue(role));
		} else {
			url.searchParams.delete('rr');
		}
		const projectDescription = recruiterProjectDescription.trim();
		if (projectDescription) {
			url.searchParams.set('rpd', encodeShareValue(projectDescription));
		} else {
			url.searchParams.delete('rpd');
		}
		const copied = await copyText(url.toString());
		trackRecruiterAction('notes_share_link_copy', { copied, source });
		setCommandFeedback(copied ? 'Notes share link copied' : 'Clipboard unavailable');
	};

	const viewMetricsSnapshot = async () => {
		const snapshot = getRecruiterMetricsSnapshot();
		const lines = Object.entries(snapshot.counts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 12)
			.map(([action, count]) => `${action}: ${count}`);
		const payload = lines.length ? lines.join('\n') : 'No recruiter interactions recorded yet.';
		await copyValue(payload, 'analytics_snapshot_copy', 'Analytics snapshot copied');
	};

	const commandActions = $derived.by(() => {
		const info = data?.data?.info ?? {};
		const actions = [
			{ id: 'about', label: 'Jump to About', hint: 'Section', run: () => jumpToSection('about') },
			{
				id: 'projects',
				label: 'Jump to Projects',
				hint: 'Section',
				run: () => jumpToSection('projects')
			},
			{ id: 'skills', label: 'Jump to Skills', hint: 'Section', run: () => jumpToSection('skills') },
			{
				id: 'experience',
				label: 'Jump to Experience',
				hint: 'Section',
				run: () => jumpToSection('experience')
			},
			{
				id: 'services',
				label: 'Jump to Services',
				hint: 'Section',
				run: () => jumpToSection('services')
			},
			{ id: 'pricing', label: 'Jump to Pricing', hint: 'Section', run: () => jumpToSection('pricing') },
			{ id: 'contact', label: 'Jump to Contact', hint: 'Section', run: () => jumpToSection('contact') },
			{
				id: 'projects-page',
				label: 'Open Full Projects Page',
				hint: 'Route',
				run: () => openPath('/projects', 'open_projects_page')
			},
			{
				id: 'pricing-page',
				label: 'Open Full Pricing Page',
				hint: 'Route',
				run: () => openPath('/pricing', 'open_pricing_page')
			},
			{
				id: 'notes',
				label: recruiterNotesOpen ? 'Close Recruiter Notes' : 'Open Recruiter Notes',
				hint: 'Tool',
				run: () => {
					recruiterNotesOpen = !recruiterNotesOpen;
					trackRecruiterAction('notes_toggle', { open: recruiterNotesOpen, source: 'command' });
				}
			},
			{
				id: 'metrics',
				label: 'Copy Recruiter Analytics Snapshot',
				hint: 'Analytics',
				run: viewMetricsSnapshot
			},
			{
				id: 'ai-portfolio',
				label: 'Open AI Generated Portfolio',
				hint: 'Recruiter',
				run: openAiGeneratedPortfolio
			},
			{
				id: 'notes-share',
				label: 'Copy Recruiter Notes Share Link',
				hint: 'Tool',
				run: () => copyRecruiterNotesShareLink('command')
			}
		];

		if (info?.email) {
			actions.push({
				id: 'copy-email',
				label: 'Copy Email Address',
				hint: 'Clipboard',
				run: () => copyValue(info.email, 'copy_email', 'Email copied')
			});
		}

		if (info?.linkedin) {
			actions.push({
				id: 'copy-linkedin',
				label: 'Copy LinkedIn URL',
				hint: 'Clipboard',
				run: () => copyValue(info.linkedin, 'copy_linkedin', 'LinkedIn copied')
			});
		}

		if (info?.github) {
			actions.push({
				id: 'github-profile',
				label: 'Open GitHub Profile',
				hint: 'Profile',
				run: () => openExternal(info.github, 'open_github_profile')
			});
		}

		if (info?.resume) {
			actions.push({
				id: 'copy-resume',
				label: 'Copy Resume URL',
				hint: 'Clipboard',
				run: () => copyValue(info.resume, 'copy_resume', 'Resume link copied')
			});
		}

		return actions;
	});

	const filteredCommands = $derived.by(() => {
		const term = commandQuery.trim().toLowerCase();
		if (!term) return commandActions;
		return commandActions.filter(
			(command) =>
				command.label.toLowerCase().includes(term) || command.hint.toLowerCase().includes(term)
		);
	});

	const runCommand = async (command) => {
		if (!command) return;
		await command.run();
		closeCommandPalette();
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
		if (browser) {
			try {
				localStorage.setItem(recruiterNotesKey, recruiterNotes);
			} catch {
				// no-op
			}
		}
	});

	$effect(() => {
		if (browser) {
			try {
				localStorage.setItem(recruiterRoleKey, recruiterRoleInput || '');
			} catch {
				// no-op
			}
		}
	});

	$effect(() => {
		if (browser) {
			try {
				localStorage.setItem(recruiterProjectDescriptionKey, recruiterProjectDescription || '');
			} catch {
				// no-op
			}
		}
	});

	$effect(() => {
		if (!commandOpen) return;
		if (!filteredCommands.length) {
			commandIndex = 0;
			return;
		}
		if (commandIndex >= filteredCommands.length) {
			commandIndex = 0;
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

		const handleKeydown = (event) => {
			const key = event.key?.toLowerCase();
			const isTyping = getTypingContext(event.target);
			if ((event.ctrlKey || event.metaKey) && key === 'k') {
				event.preventDefault();
				if (commandOpen) {
					closeCommandPalette();
				} else {
					openCommandPalette();
					trackRecruiterAction('open_command_palette', { source: 'keyboard' });
				}
				return;
			}
			if (!isTyping && !event.ctrlKey && !event.metaKey && !event.altKey && key === '/') {
				event.preventDefault();
				openCommandPalette();
				trackRecruiterAction('open_command_palette', { source: 'slash' });
				return;
			}
			if (commandOpen) {
				if (event.key === 'Escape') {
					event.preventDefault();
					closeCommandPalette();
					return;
				}
				if (event.key === 'ArrowDown') {
					event.preventDefault();
					commandIndex = filteredCommands.length
						? (commandIndex + 1) % filteredCommands.length
						: 0;
					return;
				}
				if (event.key === 'ArrowUp') {
					event.preventDefault();
					commandIndex = filteredCommands.length
						? (commandIndex - 1 + filteredCommands.length) % filteredCommands.length
						: 0;
					return;
				}
				if (event.key === 'Enter') {
					event.preventDefault();
					if (!filteredCommands.length) return;
					runCommand(filteredCommands[commandIndex]);
					return;
				}
			}

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
		try {
			recruiterNotes = localStorage.getItem(recruiterNotesKey) ?? '';
			recruiterRoleInput = localStorage.getItem(recruiterRoleKey) ?? '';
			recruiterProjectDescription = localStorage.getItem(recruiterProjectDescriptionKey) ?? '';
		} catch {
			recruiterNotes = '';
			recruiterRoleInput = '';
			recruiterProjectDescription = '';
		}

		const currentUrl = new URL(window.location.href);
		const encodedNotes = currentUrl.searchParams.get('rn');
		const sharedNotes = encodedNotes
			? decodeShareValue(encodedNotes)
			: currentUrl.searchParams.get('recruiter_notes');
		if (sharedNotes) {
			recruiterNotes = sharedNotes.slice(0, 8000);
			recruiterNotesOpen = true;
			trackRecruiterAction('notes_share_link_open', { source: 'url' });
		}
		const encodedRole = currentUrl.searchParams.get('rr');
		const sharedRole = encodedRole ? decodeShareValue(encodedRole) : currentUrl.searchParams.get('role');
		if (sharedRole) {
			recruiterRoleInput = sharedRole.slice(0, 100);
		}
		const encodedProjectDescription = currentUrl.searchParams.get('rpd');
		const sharedProjectDescription = encodedProjectDescription
			? decodeShareValue(encodedProjectDescription)
			: currentUrl.searchParams.get('project_description');
		if (sharedProjectDescription) {
			recruiterProjectDescription = sharedProjectDescription.slice(0, 1200);
		}

		const savedPromptState = localStorage.getItem(recruiterPromptSeenKey) === '1';
		if ($page.url.pathname === '/' && !savedPromptState) {
			window.setTimeout(() => {
				recruiterPromptOpen = true;
				trackRecruiterAction('recruiter_prompt_open', { source: 'auto' });
			}, 1200);
		}

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
			clearTimeout(commandFeedbackTimer);
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
				<a
					href="/ai-portfolio"
					onclick={() => trackRecruiterAction('open_ai_generated_portfolio', { source: 'header_link' })}
					class="rounded-md border border-primary/30 px-3 py-2 text-sm text-primary transition-colors hover:bg-primary/10"
				>
					AI Portfolio
				</a>
			</nav>

			<div class="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					href="/ai-portfolio"
					class="hidden md:inline-flex lg:hidden"
					onclick={() => trackRecruiterAction('open_ai_generated_portfolio', { source: 'header_button' })}
				>
					AI Portfolio
				</Button>
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
				<a
					href="/ai-portfolio"
					onclick={() => {
						showMenu = false;
						trackRecruiterAction('open_ai_generated_portfolio', { source: 'mobile_menu' });
					}}
					class="rounded-lg border border-primary/30 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10"
				>
					AI Portfolio
				</a>
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

	{#if commandOpen}
		<div class="fixed inset-0 z-[82] bg-black/45 backdrop-blur-sm" role="presentation" onclick={closeCommandPalette}>
			<div
				class="mx-auto mt-20 w-[min(680px,92vw)] rounded-xl border border-white/10 bg-card/96 p-3 shadow-2xl"
				role="dialog"
				aria-modal="true"
				onclick={(event) => event.stopPropagation()}
			>
				<div class="flex items-center gap-2 border-b border-white/10 pb-2">
					<Command size={15} class="text-primary" />
					<Input
						placeholder="Jump to section, open route, copy contact..."
						bind:value={commandQuery}
						class="border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
					/>
				</div>
				<div class="mt-2 max-h-[52vh] space-y-1 overflow-auto">
					{#if filteredCommands.length === 0}
						<p class="px-2 py-2 text-sm text-muted-foreground">No matching command.</p>
					{:else}
						{#each filteredCommands as command, index (command.id)}
							<button
								type="button"
								class="flex w-full items-center justify-between rounded-md border border-transparent px-2 py-2 text-left text-sm transition-colors {commandIndex === index
									? 'border-primary/40 bg-primary/12 text-primary'
									: 'text-foreground hover:bg-white/5'}"
								onmouseenter={() => (commandIndex = index)}
								onclick={() => runCommand(command)}
							>
								<span>{command.label}</span>
								<span class="text-xs text-muted-foreground">{command.hint}</span>
							</button>
						{/each}
					{/if}
				</div>
				<p class="mt-3 text-xs text-muted-foreground">Press <kbd>Enter</kbd> to run, <kbd>Esc</kbd> to close.</p>
			</div>
		</div>
	{/if}

	{#if commandFeedback}
		<div class="pointer-events-none fixed left-1/2 top-4 z-[83] -translate-x-1/2 rounded-full border border-primary/30 bg-card/90 px-3 py-1 text-xs text-primary shadow-lg">
			{commandFeedback}
		</div>
	{/if}

	{#if recruiterPromptOpen}
		<div class="fixed inset-0 z-[81] grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
			<div class="w-[min(520px,95vw)] rounded-xl border border-white/10 bg-card/95 p-4 shadow-2xl">
				<p class="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Experimental</p>
				<h2 class="mt-2 text-lg font-semibold">Recruiter assistant mode</h2>
				<p class="mt-2 text-sm text-muted-foreground">
					If you are hiring, enter the role title to open an AI-generated role-fit portfolio page.
				</p>
				<div class="mt-3">
					<label for="recruiter-role" class="mb-1 block text-sm font-medium">Job role</label>
					<Input
						id="recruiter-role"
						placeholder="e.g., Full-Stack Software Engineer"
						bind:value={recruiterRoleInput}
					/>
				</div>
				<details class="mt-3 rounded-md border border-white/10 bg-background/60 p-2">
					<summary class="cursor-pointer text-sm font-medium">Project description (optional)</summary>
					<div class="mt-2">
						<textarea
							id="recruiter-project-description"
							rows="4"
							bind:value={recruiterProjectDescription}
							class="w-full resize-y rounded-md border border-white/10 bg-background px-3 py-2 text-sm"
							placeholder="Paste a short role or project description for a better role-fit AI portfolio."
						></textarea>
					</div>
				</details>
				<div class="mt-4 flex flex-wrap justify-end gap-2">
					<Button variant="outline" onclick={() => dismissRecruiterPrompt('not_recruiter')}>
						Not now
					</Button>
					<Button onclick={openAiGeneratedPortfolio}>Open AI Portfolio</Button>
				</div>
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
						onclick={() => {
							trackRecruiterAction('timeline_point_click', { section: point.key });
							scrollToSection(point.key);
						}}
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

	<div class="fixed bottom-4 left-4 z-[71]">
		{#if recruiterNotesOpen}
			<div class="w-[min(360px,90vw)] rounded-xl border border-white/10 bg-card/95 p-3 shadow-2xl backdrop-blur">
				<div class="mb-2 flex items-center justify-between">
					<p class="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Recruiter Notes</p>
					<button
						type="button"
						class="rounded p-1 text-muted-foreground hover:text-foreground"
						onclick={() => {
							recruiterNotesOpen = false;
							trackRecruiterAction('notes_toggle', { open: false, source: 'drawer' });
						}}
						aria-label="Close recruiter notes"
					>
						<X size={14} />
					</button>
				</div>
				<textarea
					bind:value={recruiterNotes}
					rows="8"
					class="w-full resize-y rounded-md border border-white/10 bg-background p-2 text-sm text-foreground"
					placeholder="Jot role fit notes, interview questions, and next-step reminders..."
				></textarea>
				<div class="mt-2 flex flex-wrap gap-2">
					<Button size="sm" variant="outline" onclick={() => copyRecruiterNotesShareLink('drawer')}>
						Copy share link
					</Button>
				</div>
				<p class="mt-2 text-[11px] text-muted-foreground">Saved locally in your browser.</p>
			</div>
		{:else}
			<Button
				variant="outline"
				size="sm"
				onclick={() => {
					recruiterNotesOpen = true;
					trackRecruiterAction('notes_toggle', { open: true, source: 'drawer' });
				}}
			>
				<NotebookPen size={14} />
				Notes
			</Button>
		{/if}
	</div>

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
