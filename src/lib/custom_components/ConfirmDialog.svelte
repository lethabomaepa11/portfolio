<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import { X } from 'lucide-svelte';

	let { open = $bindable(), title = 'Confirm', message = 'Are you sure?', confirmLabel = 'Delete', cancelLabel = 'Cancel', variant = 'destructive', onConfirm = () => {} } = $props();

	const handleConfirm = () => {
		onConfirm();
		open = false;
	};
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div role="dialog" aria-modal="true" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onclick={() => (open = false)} onkeydown={(e) => e.key === 'Escape' && (open = false)}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div role="document" class="w-[min(420px,92vw)] rounded-xl border border-border bg-card p-6 shadow-2xl" onclick={(e) => e.stopPropagation()}>
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-lg font-semibold">{title}</h3>
				<button type="button" onclick={() => (open = false)} class="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
					<X size={16} />
				</button>
			</div>
			<p class="mb-6 text-sm text-muted-foreground">{message}</p>
			<div class="flex justify-end gap-3">
				<Button variant="outline" onclick={() => (open = false)}>{cancelLabel}</Button>
				<Button variant={variant} onclick={handleConfirm}>{confirmLabel}</Button>
			</div>
		</div>
	</div>
{/if}
