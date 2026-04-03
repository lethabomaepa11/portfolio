<script>
	import { pages } from '$lib/pages.svelte';
</script>

<footer class="mt-10 border-t border-white/10 pt-6">
	<nav class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
		{#each pages as item}
			<a href={item.url ? `/#${item.url}` : '/#about'} class="hover:text-primary">{item.title}</a>
		{/each}
	</nav>

	<p class="mt-4 text-xs text-muted-foreground">
		&copy; {new Date().getFullYear()} Lethabo Maepa. All rights reserved.
	</p>
</footer>
