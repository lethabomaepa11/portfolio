<script>
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import { pages } from '$lib/pages.svelte';
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';

	let navigator = $state({
		prev: null,
		next: null
	});

	afterNavigate(() => {
		//find the index of the current page, then use that index to find the next and previous page
		const index = pages.findIndex((p) => '/' + p.url === page.url.pathname);
		if (index == -1) return;
		if (index === 0) {
			navigator.prev = null;
		} else {
			navigator.prev = pages[index - 1];
		}
		if (index + 1 === pages.length) {
			navigator.next = null;
		} else {
			navigator.next = pages[index + 1];
		}
	});
</script>

<footer>
	<div class="hidden w-full items-center justify-between lg:flex">
		{#if navigator.prev}
			<Button variant="link" href={navigator.prev?.url}>
				<div class="link">
					<ArrowLeft />
					View {navigator.prev.title}
				</div>
			</Button>
		{/if}
		{#if navigator.next}
			<Button variant="link" href={navigator.next?.url}>
				<div class="link">
					View {navigator.next.title}
					<ArrowRight />
				</div>
			</Button>
		{/if}
	</div>

	<div class="flex flex-col items-center justify-center gap-2">
		<p class="text-center text-sm leading-loose text-muted-foreground">
			&copy; {new Date().getFullYear()} Lethabo Maepa. All rights reserved.
		</p>
	</div>
</footer>

<style>
	.link {
		@apply flex items-center gap-2;
	}
</style>
