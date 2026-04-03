<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import { Download } from 'lucide-svelte';

	let { pageData } = $props();

	const highlights = [
		'Software developer with hands-on product delivery experience',
		'Strong frontend foundation with practical full-stack capability',
		'Focused on clean implementation, performance, and maintainability'
	];
</script>

<section id="about" class="py-1">
	<p class="text-xs font-semibold uppercase tracking-[0.16em] text-primary">About</p>
	<h2 class="mt-2 text-2xl font-bold md:text-3xl">Profile</h2>
	<p class="mt-4 max-w-3xl leading-relaxed text-muted-foreground">{pageData.info.about}</p>
	<p class="mt-3 text-sm text-primary">
		Currently employed and open to selective collaborations and high-impact opportunities.
	</p>

	<ul class="mt-5 space-y-2 text-sm text-muted-foreground">
		{#each highlights as item}
			<li class="flex gap-2">
				<span class="mt-[7px] h-1.5 w-1.5 rounded-full bg-primary"></span>
				<span>{item}</span>
			</li>
		{/each}
	</ul>

	{#if pageData.info.resume}
		<Button target="_blank" href={pageData.info.resume} variant="outline" class="mt-6">
			<Download size={16} />
			Download Resume
		</Button>
	{/if}
</section>
