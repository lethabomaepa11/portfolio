<script>
	import Seo from '$lib/custom_components/SEO.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Youtube, Github, Palette, Play } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	let { data } = $props();

	let animBox = $state(null);
	let themeAccent = $state('indigo');

	const themes = [
		{ id: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
		{ id: 'emerald', label: 'Emerald', class: 'bg-emerald-500' },
		{ id: 'rose', label: 'Rose', class: 'bg-rose-500' },
		{ id: 'amber', label: 'Amber', class: 'bg-amber-500' },
		{ id: 'cyan', label: 'Cyan', class: 'bg-cyan-500' },
		{ id: 'violet', label: 'Violet', class: 'bg-violet-500' }
	];

	const playAnim = (name) => {
		if (!animBox) return;
		gsap.killTweensOf(animBox);
		switch (name) {
			case 'bounce':
				gsap.to(animBox, { y: -60, duration: 0.5, ease: 'bounce.out', yoyo: true, repeat: 1 });
				break;
			case 'spin':
				gsap.to(animBox, { rotation: 360, duration: 0.8, ease: 'power2.out' });
				break;
			case 'scale':
				gsap.to(animBox, { scale: 1.6, duration: 0.4, ease: 'back.out(3)', yoyo: true, repeat: 1 });
				break;
			case 'wobble':
				gsap.to(animBox, { x: 40, duration: 0.15, ease: 'sine.inOut', yoyo: true, repeat: 5 });
				break;
			case 'fade':
				gsap.to(animBox, { opacity: 0.2, duration: 0.5, ease: 'power2.inOut', yoyo: true, repeat: 1 });
				break;
			case 'explode':
				gsap.to(animBox, { scale: 2, opacity: 0, duration: 0.6, ease: 'back.in(2)' });
				gsap.to(animBox, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out', delay: 0.7 });
				break;
		}
	};

	const animButtons = [
		{ label: 'Bounce', name: 'bounce' },
		{ label: 'Spin', name: 'spin' },
		{ label: 'Scale', name: 'scale' },
		{ label: 'Wobble', name: 'wobble' },
		{ label: 'Fade', name: 'fade' },
		{ label: 'Explode', name: 'explode' }
	];

	$effect(() => {
		document.documentElement.style.setProperty('--demo-accent', `var(--${themeAccent})`);
	});
</script>

<Seo
	title="Playground"
	desc="Interactive demos, experiments, and off-duty content from Lethabo Maepa."
/>

<section class="section-wrap py-10 md:py-12" in:fade={{ duration: 220 }}>
	<div class="panel bg-gradient-to-br from-primary/5 via-background to-amber-500/5">
		<p class="text-xs font-semibold uppercase tracking-[0.16em] text-amber-400">Off-Duty</p>
		<h1 class="mt-2 text-2xl font-bold md:text-3xl">Playground</h1>
		<p class="mt-3 max-w-3xl text-sm text-muted-foreground">
			Interactive demos, visual experiments, and the occasional live stream.
		</p>
		<div class="mt-4 flex flex-wrap gap-3">
			<a
				href="https://www.youtube.com/@lethabomaepa11?sub_confirmation=1"
				target="_blank"
				rel="noreferrer"
				class="inline-flex items-center gap-2 text-sm text-rose-400 transition-colors hover:text-rose-300"
			>
				<Youtube size={16} />
				YouTube
			</a>
			<a
				href={data?.data?.info?.github ?? '#'}
				target="_blank"
				rel="noreferrer"
				class="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
			>
				<Github size={16} />
				GitHub
			</a>
		</div>
	</div>

	<div class="mt-6 grid gap-6 md:grid-cols-2">
		<div class="panel" in:fade={{ duration: 240 }}>
			<p class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">
				<Play size={13} />
				Animation Lab
			</p>
			<h2 class="mt-2 text-lg font-semibold">GSAP Playground</h2>
			<p class="mt-1 text-sm text-muted-foreground">
				Click a button to trigger an animation on the box below.
			</p>

			<div class="mt-5 flex flex-wrap gap-2">
				{#each animButtons as btn}
					<button
						type="button"
						onclick={() => playAnim(btn.name)}
						class="inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
					>
						{btn.label}
					</button>
				{/each}
			</div>

			<div class="mt-6 flex justify-center">
				<div
					bind:this={animBox}
					class="h-24 w-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg"
				></div>
			</div>
		</div>

		<div class="panel" in:fade={{ duration: 240, delay: 80 }}>
			<p class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-purple-400">
				<Palette size={13} />
				Theme Preview
			</p>
			<h2 class="mt-2 text-lg font-semibold">Color Accents</h2>
			<p class="mt-1 text-sm text-muted-foreground">
				Pick an accent color to preview it on the sample card.
			</p>

			<div class="mt-5 flex flex-wrap gap-2">
				{#each themes as theme}
					<button
						onclick={() => (themeAccent = theme.id)}
						class="h-8 w-8 rounded-full {theme.class} transition-transform hover:scale-110 {themeAccent === theme.id ? 'ring-2 ring-white ring-offset-2 ring-offset-background' : ''}"
						aria-label={theme.label}
					></button>
				{/each}
			</div>

			<div
				class="mt-6 rounded-xl border border-border p-4 transition-all duration-300"
				style="border-color: hsl(var(--{themeAccent}-500) / 0.3)"
			>
				<div
					class="mb-3 h-3 w-24 rounded-full transition-colors duration-300"
					style="background: hsl(var(--{themeAccent}-500))"
				></div>
				<div class="mb-2 h-2 w-full rounded-full bg-muted"></div>
				<div class="mb-2 h-2 w-3/4 rounded-full bg-muted"></div>
				<div class="h-2 w-1/2 rounded-full bg-muted"></div>
				<div class="mt-4 flex gap-2">
					<div
						class="rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-colors duration-300"
						style="background: hsl(var(--{themeAccent}-500))"
					>
						Button
					</div>
					<div
						class="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors duration-300"
						style="border-color: hsl(var(--{themeAccent}-500) / 0.5); color: hsl(var(--{themeAccent}-500))"
					>
						Outline
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-6 grid gap-6 md:grid-cols-2">
		<div class="panel">
			<p class="text-xs font-semibold uppercase tracking-[0.16em] text-rose-400">Live</p>
			<h2 class="mt-2 text-xl font-semibold md:text-2xl">Now Streaming</h2>
			<p class="mt-2 text-sm text-muted-foreground">
				If the stream is live, you'll see it here. Come say hi.
			</p>
			<div class="mt-4" style="padding:56.25% 0 0 0;position:relative;">
				<iframe
					src="https://www.youtube.com/embed/live_stream?channel=UCULkdNFaYWpFZhdk-ZnPS1w"
					allow="autoplay"
					allowfullscreen
					frameborder="0"
					style="position:absolute;top:0;left:0;width:100%;height:100%;"
					title="Live stream"
				></iframe>
			</div>
		</div>

		<div class="panel">
			<p class="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">Archive</p>
			<h2 class="mt-2 text-xl font-semibold md:text-2xl">Recent Uploads</h2>
			<p class="mt-2 text-sm text-muted-foreground">
				Missed a stream? Catch the replay.
			</p>
			<div class="mt-4" style="padding:56.25% 0 0 0;position:relative;">
				<iframe
					src="https://www.youtube-nocookie.com/embed/videoseries?list=UUULkdNFaYWpFZhdk-ZnPS1w"
					allow="autoplay"
					allowfullscreen
					frameborder="0"
					style="position:absolute;top:0;left:0;width:100%;height:100%;"
					title="YouTube video playlist"
				></iframe>
			</div>
		</div>
	</div>
</section>
