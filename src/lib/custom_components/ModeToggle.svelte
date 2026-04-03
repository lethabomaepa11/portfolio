<script>
	import { browser } from '$app/environment';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import { onDestroy } from 'svelte';

	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';

	const bubbleSeeds = [
		{ angle: -70, travel: 72, size: 7, delay: 0, dur: 620 },
		{ angle: -35, travel: 66, size: 6, delay: 20, dur: 640 },
		{ angle: -10, travel: 78, size: 8, delay: 45, dur: 660 },
		{ angle: 22, travel: 70, size: 6, delay: 25, dur: 620 },
		{ angle: 55, travel: 76, size: 7, delay: 60, dur: 680 },
		{ angle: 95, travel: 64, size: 5, delay: 40, dur: 640 },
		{ angle: 132, travel: 68, size: 6, delay: 15, dur: 620 },
		{ angle: 168, travel: 74, size: 7, delay: 50, dur: 700 },
		{ angle: 210, travel: 70, size: 6, delay: 20, dur: 640 },
		{ angle: 248, travel: 66, size: 5, delay: 30, dur: 620 },
		{ angle: 286, travel: 80, size: 7, delay: 0, dur: 700 },
		{ angle: 325, travel: 74, size: 6, delay: 35, dur: 680 },
		{ angle: -52, travel: 86, size: 7, delay: 55, dur: 760 },
		{ angle: -20, travel: 90, size: 6, delay: 70, dur: 780 },
		{ angle: 34, travel: 88, size: 8, delay: 65, dur: 790 },
		{ angle: 78, travel: 84, size: 6, delay: 80, dur: 760 },
		{ angle: 145, travel: 90, size: 7, delay: 75, dur: 800 },
		{ angle: 188, travel: 86, size: 6, delay: 62, dur: 770 },
		{ angle: 232, travel: 88, size: 7, delay: 82, dur: 790 },
		{ angle: 302, travel: 92, size: 8, delay: 78, dur: 820 }
	];
	const iconBubbleIndexes = new Set([0, 2, 5, 8, 10, 13, 15, 18, 20]);

	let burstTone = $state('light');
	let burstVisible = $state(false);
	let burstX = $state(0);
	let burstY = $state(0);
	let bubbles = $state([]);
	let cleanupTimer = 0;

	const clearEffects = () => {
		burstVisible = false;
		bubbles = [];
	};

	const createBurstItems = () =>
		bubbleSeeds.map((seed, index) => {
			const isIcon = iconBubbleIndexes.has(index);
			return {
				...seed,
				id: `${Date.now()}-${index}`,
				kind: isIcon ? 'icon' : 'dot',
				size: isIcon ? seed.size + 5 : seed.size,
				travel: isIcon ? seed.travel + 10 : seed.travel
			};
		});

	const triggerThemeAnimation = (event) => {
		if (!browser) return false;
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const target = event.currentTarget;
		if (!(target instanceof HTMLElement)) return false;

		const rect = target.getBoundingClientRect();
		burstX = rect.left + rect.width / 2;
		burstY = rect.top + rect.height / 2;
		burstTone = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
		document.documentElement.style.setProperty('--theme-burst-x', `${burstX}px`);
		document.documentElement.style.setProperty('--theme-burst-y', `${burstY}px`);

		if (reduceMotion) return true;
		clearEffects();
		bubbles = createBurstItems();
		requestAnimationFrame(() => {
			burstVisible = true;
		});
		clearTimeout(cleanupTimer);
		cleanupTimer = setTimeout(() => {
			clearEffects();
		}, 1420);
		return true;
	};

	const handleToggleMode = (event) => {
		triggerThemeAnimation(event);
		toggleMode();
	};

	onDestroy(() => {
		clearTimeout(cleanupTimer);
	});
</script>

<div class="relative">
	<Button onclick={handleToggleMode} variant="ghost" size="icon">
		<Sun
			class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
		/>
		<Moon
			class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
		/>
		<span class="sr-only">Toggle theme</span>
	</Button>
</div>

{#if burstVisible}
	<div
		class="theme-mode-reveal {burstTone === 'light'
			? 'theme-mode-reveal--light'
			: 'theme-mode-reveal--dark'}"
		aria-hidden="true"
	></div>
	<div
		class="theme-mode-reveal theme-mode-reveal--secondary {burstTone === 'light'
			? 'theme-mode-reveal--light'
			: 'theme-mode-reveal--dark'}"
		aria-hidden="true"
	></div>
	<div class="theme-mode-shockwave" style={`left:${burstX}px;top:${burstY}px;`} aria-hidden="true"></div>
	<div
		class="theme-mode-shockwave theme-mode-shockwave--secondary"
		style={`left:${burstX}px;top:${burstY}px;`}
		aria-hidden="true"
	></div>
{/if}

{#each bubbles as bubble (bubble.id)}
	<div
		class="theme-mode-bubble {burstTone === 'light' ? 'theme-mode-bubble--light' : 'theme-mode-bubble--dark'}"
		style={`left:${burstX}px;top:${burstY}px;--bubble-angle:${bubble.angle}deg;--bubble-travel:${bubble.travel}px;--bubble-size:${bubble.size}px;--bubble-delay:${bubble.delay}ms;--bubble-duration:${bubble.dur}ms;`}
		aria-hidden="true"
	>
		{#if bubble.kind === 'icon'}
			{#if burstTone === 'light'}
				<Sun size={10} class="theme-mode-bubble-icon" />
			{:else}
				<Moon size={10} class="theme-mode-bubble-icon" />
			{/if}
		{/if}
	</div>
{/each}
