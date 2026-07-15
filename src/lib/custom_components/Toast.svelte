<script>
	import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let { message = '', type = 'success', visible = $bindable(), duration = 3500 } = $props();

	let timer;

	$effect(() => {
		if (visible && duration > 0) {
			clearTimeout(timer);
			timer = setTimeout(() => {
				visible = false;
			}, duration);
		}
	});

	const icons = {
		success: CheckCircle,
		error: XCircle,
		warning: AlertCircle
	};

	const styles = {
		success: 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400',
		error: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400',
		warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
	};

	const Icon = icons[type] || icons.success;
</script>

{#if visible}
	<div class="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border {styles[type]} px-4 py-3 shadow-xl backdrop-blur-md animate-in">
		<Icon size={18} />
		<p class="text-sm font-medium">{message}</p>
		<button type="button" onclick={() => (visible = false)} class="ml-2 rounded-md p-0.5 opacity-60 hover:opacity-100">
			<X size={14} />
		</button>
	</div>
{/if}

<style>
	@keyframes toast-in {
		from {
			opacity: 0;
			transform: translateY(16px) scale(0.96);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
	.animate-in {
		animation: toast-in 260ms cubic-bezier(0.22, 1, 0.36, 1) both;
	}
</style>
