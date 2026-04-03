<script>
	import { page } from '$app/stores';
	import { pages } from '$lib/pages.svelte';

	let { isMobile } = $props();

	const linkFor = (item) => {
		if (isMobile && item.url) {
			return `/#${item.url}`;
		}

		return item.url ? `/${item.url}` : '/';
	};
</script>

<nav class="flex h-full w-full flex-col gap-3 p-2">
	<div class="rounded-2xl border bg-card/85 p-4 shadow-sm backdrop-blur">
		<p class="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Navigation</p>
		<div class="mt-3 flex flex-col gap-2">
			{#each pages as item}
				<a
					href={linkFor(item)}
					class="flex items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-sm font-medium transition-all hover:border-primary/25 hover:bg-primary/5 {$page.url.pathname === `/${item.url}` || ($page.url.pathname === '/' && item.url === '')
						? 'border-primary/30 bg-primary/10 text-primary'
						: 'text-foreground'}"
					aria-label={item.title}
				>
					<item.icon size={17} />
					<span>{item.title}</span>
				</a>
			{/each}
		</div>
	</div>

	{#if !isMobile}
		<div class="rounded-2xl border bg-card/75 p-4 shadow-sm">
			<p class="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
				Currently Focused On
			</p>
			<ul class="mt-3 space-y-2 text-sm text-muted-foreground">
				<li>Building production-ready full-stack products</li>
				<li>Clean UI systems with strong performance</li>
				<li>SvelteKit, Supabase, and modern web delivery</li>
			</ul>
		</div>
	{/if}
</nav>
