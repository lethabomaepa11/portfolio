<script>
	import { browser } from '$app/environment';
	import Button from '$lib/components/ui/button/button.svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import { auth } from '$lib/state.svelte';
	import { onDestroy, onMount } from 'svelte';

	let { children } = $props();

	let mobile = new IsMobile();
	let isMobile = $state(mobile.current);
	let password = $state('');
	let isLoading = $state(false);
	let error = $state('');
	let showIntro = $state(true);
	let isLeaving = $state(false);

	const loginErrors = [
		'That key is not valid for editor access.',
		'Access denied. Please try again.',
		'Incorrect key. Try once more.',
		'Authentication failed. Check your key.'
	];

	let removeResizeListener = null;
	let removeBeforeUnloadListener = null;
	let introTimer = null;

	const updateIsMobile = () => {
		mobile = new IsMobile();
		isMobile = mobile.current;
	};

	const handleLogin = async (event) => {
		event?.preventDefault?.();
		isLoading = true;
		error = '';

		try {
			const response = await fetch('/api/auth', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ key: password })
			});
			const res = await response.json();

			if (res.success) {
				auth.isAuthenticated = true;
				localStorage.setItem('a', res.key);
			} else {
				error = loginErrors[Math.floor(Math.random() * loginErrors.length)];
			}
		} catch {
			error = 'Unable to reach auth service right now.';
		} finally {
			isLoading = false;
		}
	};

	onMount(async () => {
		const handleResize = () => updateIsMobile();
		const handleBeforeUnload = () => {
			isLeaving = true;
			document.documentElement.classList.add('editor-page-leaving');
		};

		window.addEventListener('resize', handleResize);
		window.addEventListener('beforeunload', handleBeforeUnload);

		removeResizeListener = () => window.removeEventListener('resize', handleResize);
		removeBeforeUnloadListener = () => window.removeEventListener('beforeunload', handleBeforeUnload);

		password = localStorage.getItem('a') || '';
		if (password) {
			await handleLogin();
		}
		password = '';

		introTimer = window.setTimeout(() => {
			showIntro = false;
		}, 1400);
	});

	onDestroy(() => {
		removeResizeListener?.();
		removeBeforeUnloadListener?.();
		if (introTimer) window.clearTimeout(introTimer);
		if (browser) {
			document.documentElement.classList.remove('editor-page-leaving');
		}
	});
</script>

<div class="editor-shell {isLeaving ? 'editor-shell-leaving' : 'editor-shell-ready'}">
	{#if !auth.isAuthenticated}
		<div class="editor-auth-wrap">
			<form onsubmit={handleLogin} class="editor-auth-form">
				<h2 class="editor-auth-title">Editor Access</h2>
				<p class="editor-auth-copy">Enter your key to open the portfolio workspace.</p>
				<input
					type="password"
					bind:value={password}
					class="mb-4 w-full rounded border bg-background p-2"
					placeholder="Enter access key"
					disabled={isLoading}
				/>
				{#if error}
					<p class="mb-4 text-sm text-red-500">{error}</p>
				{/if}
				<Button type="submit" class="w-full" disabled={isLoading}>
					{isLoading ? 'Checking...' : 'Proceed'}
				</Button>
			</form>
		</div>
	{:else}
		<div class="editor-content-shell">
			{@render children()}
		</div>
	{/if}
</div>

{#if showIntro}
	<div class="editor-intro-overlay" aria-hidden="true">
		<p class="editor-intro-kicker">Portfolio Workspace</p>
		<h1 class="editor-intro-name">Lethabo Maepa</h1>
		<p class="editor-intro-sub">Loading Editor</p>
	</div>
{/if}

{#if isLeaving}
	<div class="editor-exit-overlay" aria-hidden="true">
		<span class="editor-exit-text">Closing editor...</span>
	</div>
{/if}
