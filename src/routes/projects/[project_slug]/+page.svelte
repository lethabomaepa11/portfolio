<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import TrixDisplay from '$lib/custom_components/TrixDisplay.svelte';
	import { ArrowLeft, MessageCircle, Send } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let { data } = $props();
	let isMobile = $state(false);
	let viewState = $state('image');
	let comments = $state([]);
	let commentsLoading = $state(true);
	let commentName = $state('');
	let commentEmail = $state('');
	let commentBody = $state('');
	let submitting = $state(false);

	const updateIsMobile = () => {
		isMobile = new IsMobile().current;
	};

	const loadComments = async () => {
		commentsLoading = true;
		try {
			const res = await fetch(`/api/projects/${data.project?.slug}/comments`);
			const d = await res.json();
			comments = d.comments ?? [];
		} catch {
			comments = [];
		} finally {
			commentsLoading = false;
		}
	};

	const handleComment = async () => {
		if (!commentName.trim() || !commentBody.trim()) return;
		submitting = true;
		try {
			const res = await fetch(`/api/projects/${data.project?.slug}/comments`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					author_name: commentName.trim(),
					author_email: commentEmail.trim() || null,
					body: commentBody.trim()
				})
			});
			if (res.ok) {
				commentBody = '';
				await loadComments();
			}
		} finally {
			submitting = false;
		}
	};

	onMount(() => {
		updateIsMobile();
		window.addEventListener('resize', updateIsMobile);
		loadComments();
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

		<div class="mt-10 border-t border-white/10 pt-6">
			<h2 class="flex items-center gap-2 text-lg font-semibold">
				<MessageCircle size={18} />
				Comments
			</h2>

			<form
				onsubmit={(e) => { e.preventDefault(); handleComment(); }}
				class="mt-4 space-y-3 rounded-xl border border-border bg-background p-4"
			>
				<div class="flex gap-3">
					<input
						bind:value={commentName}
						placeholder="Your name"
						required
						class="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
					/>
					<input
						bind:value={commentEmail}
						type="email"
						placeholder="Email (optional)"
						class="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
					/>
				</div>
				<textarea
					bind:value={commentBody}
					placeholder="Write a comment..."
					required
					rows="3"
					class="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
				></textarea>
				<Button type="submit" variant="default" size="sm" disabled={submitting}>
					<Send size={14} />
					{submitting ? 'Posting...' : 'Post comment'}
				</Button>
			</form>

			<div class="mt-5 space-y-3">
				{#if commentsLoading}
					<p class="text-sm text-muted-foreground">Loading comments...</p>
				{:else if comments.length === 0}
					<p class="text-sm text-muted-foreground">No comments yet. Start the conversation.</p>
				{:else}
					{#each comments as comment (comment.id)}
						<div class="rounded-lg border border-border bg-background/50 p-3">
							<div class="flex items-center justify-between gap-2">
								<span class="text-sm font-medium">{comment.author_name}</span>
								<span class="text-xs text-muted-foreground">
									{new Date(comment.created_at).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'short',
										day: 'numeric'
									})}
								</span>
							</div>
							<p class="mt-1 text-sm leading-relaxed text-muted-foreground">{comment.body}</p>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</section>
