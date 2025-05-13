<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import { auth } from '$lib/state.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();
	let mobile = new IsMobile();
	let isMobile = $state(mobile.current);
	let password = $state('');
	let isLoading = $state(false);

	let error = $state('');
	const handleLogin = async (e) => {
		isLoading = true;
		error = '';
		const response = await fetch('/api/auth', {
			method: 'POST',
			body: JSON.stringify({ key: password })
		});
		const res = await response.json();
		if (res.success) {
			auth.isAuthenticated = true;
			localStorage.setItem('a', res.key);
		} else {
			const errors = [
				"What's happening?👀👀",
				"Bro, you're not me☠️",
				'Craaaazzzyyy, try again😅😅',
				"That's funny😅"
			];
			error = errors[Math.floor(Math.random() * errors.length)];
		}
		isLoading = false;
	};

	onMount(async () => {
		window.addEventListener('resize', () => {
			mobile = new IsMobile();
			isMobile = mobile.current;
		});
		password = localStorage.getItem('a');
		if (password) {
			handleLogin(null);
		}
		password = '';
	});
</script>

{#if !auth.isAuthenticated}
	<div class="flex min-h-screen items-center justify-center bg-background">
		<form onsubmit={handleLogin} class="w-96">
			<h2 class="mb-4 text-2xl font-bold">Who are you?👀👀</h2>
			<input
				type="password"
				bind:value={password}
				class="mb-4 w-full rounded border bg-background p-2"
				placeholder="Enter whatever you wanna enter🚶🏿🚶🏿"
			/>
			{#if error}
				<p class="mb-4 text-red-500">{error}</p>
			{/if}
			<Button type="submit" class="w-full">Proceed</Button>
		</form>
	</div>
{:else}
	{@render children()}
{/if}
