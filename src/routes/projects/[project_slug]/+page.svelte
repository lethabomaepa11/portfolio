<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import { onMount } from 'svelte';
	import TrixDisplay from '$lib/custom_components/TrixDisplay.svelte';
	let { data } = $props();
	let mobile = $state(new IsMobile());
	let isMobile = $state(mobile.current);
	let viewState = $state('image');
	const handleViewStateChange = (state) => {
		viewState = state;
	};
	onMount(() => {
		window.addEventListener('resize', () => {
			mobile = new IsMobile();
			isMobile = mobile.current;
		});
	});
</script>

<svelte:head>
	<title>{data.project.title} | DevLethabo</title>
	<meta name="description" content={data.project.description} />
</svelte:head>

<main class="md:py-12">
	<h1 class="text-3xl font-extrabold text-blue-400 drop-shadow-lg">
		<Button
			variant="ghost"
			href={isMobile ? `/#${data.project.slug}` : `/projects#${data.project.slug}`}
			><ArrowLeft /></Button
		>
		{data.project.title}
	</h1>
	<section class="w-full space-y-5 p-5">
		{#if !isMobile && data.project.demoUrl.includes('https://')}
			<div class="flex w-full gap-2">
				<Button
					onclick={() => handleViewStateChange('image')}
					variant={viewState === 'image' ? 'default' : 'ghost'}>View Screenshot</Button
				>
				<Button
					onclick={() => handleViewStateChange('iframe')}
					variant={viewState === 'iframe' ? 'default' : 'ghost'}>View Embedded site</Button
				>
			</div>
		{/if}

		{#if viewState === 'iframe' && data.project.demoUrl}
			<iframe title={data.project.title} src={data.project.demoUrl} class="h-[500px] w-full rounded"
			></iframe>
		{:else}
			<img src={data.project.image} alt={data.project.title} class="w-full rounded" />
		{/if}
		<p>{data.project.description}</p>
		<TrixDisplay content={data.project.case_study} />
	</section>
</main>
