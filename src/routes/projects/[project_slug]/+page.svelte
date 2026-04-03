<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import TrixDisplay from '$lib/custom_components/TrixDisplay.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let { data } = $props();
	let isMobile = $state(false);
	let viewState = $state('image');

	const updateIsMobile = () => {
		isMobile = new IsMobile().current;
	};

	onMount(() => {
		updateIsMobile();
		window.addEventListener('resize', updateIsMobile);
		return () => window.removeEventListener('resize', updateIsMobile);
	});
</script>

<svelte:head>
	<title>{data?.project?.title} | Lethabo Maepa</title>
	<meta name="description" content={data?.project?.description} />
</svelte:head>

<section class="section-wrap py-8 md:py-10">
	<div class="panel">
		<div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
			<h1 class="text-2xl font-bold md:text-3xl">{data.project?.title}</h1>
			<Button
				variant="outline"
				href={isMobile ? `/#${data.project?.slug}` : `/projects#${data.project?.slug}`}
			>
				<ArrowLeft size={16} />
				Back to projects
			</Button>
		</div>

	{#if !isMobile && data.project?.demoUrl?.includes('https://')}
		<div class="mt-5 flex gap-2">
			<Button
				onclick={() => (viewState = 'image')}
				variant={viewState === 'image' ? 'default' : 'outline'}
				size="sm"
			>
				Screenshot
			</Button>
			<Button
				onclick={() => (viewState = 'iframe')}
				variant={viewState === 'iframe' ? 'default' : 'outline'}
				size="sm"
			>
				Embedded Demo
			</Button>
		</div>
	{/if}

		<div class="mt-5">
			{#if viewState === 'iframe' && data.project?.demoUrl}
				<iframe
					title={data.project?.title}
					src={data.project?.demoUrl}
					class="h-[520px] w-full rounded-md border border-white/10"
				></iframe>
			{:else}
				<img
					src={data.project?.image}
					alt={`Screenshot of ${data.project?.title}`}
					class="w-full rounded-md border border-white/10"
				/>
			{/if}
		</div>

		<p class="mt-5 text-sm leading-relaxed text-muted-foreground">{data.project?.description}</p>
		<div class="prose mt-6 max-w-none dark:prose-invert">
			<TrixDisplay content={data.project?.case_study} />
		</div>
	</div>
</section>
