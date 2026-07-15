<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import TrixDisplay from '$lib/custom_components/TrixDisplay.svelte';
	import { ArrowLeft, Calendar, Tag, Eye, Heart, MessageCircle, Send } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let { data } = $props();
	let post = $derived(data.post);

	let liked = $state(false);
	let likeCount = $state(post.like_count ?? 0);
	let viewCount = $state(post.view_count ?? 0);
	let comments = $state([]);
	let commentsLoading = $state(true);

	let commentName = $state('');
	let commentEmail = $state('');
	let commentBody = $state('');
	let submitting = $state(false);

	const likerId = $derived(() => {
		let id = localStorage.getItem('blog-liker-id');
		if (!id) {
			id = crypto.randomUUID();
			localStorage.setItem('blog-liker-id', id);
		}
		return id;
	});

	const loadComments = async () => {
		commentsLoading = true;
		try {
			const res = await fetch(`/api/blog/${post.slug}/comments`);
			const data = await res.json();
			comments = data.comments ?? [];
		} catch {
			comments = [];
		} finally {
			commentsLoading = false;
		}
	};

	const handleLike = async () => {
		const newLiked = !liked;
		const id = likerId();
		const res = await fetch(`/api/blog/${post.slug}/like`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'x-liker-id': id },
			body: JSON.stringify({ liked: newLiked })
		});
		if (res.ok) {
			liked = newLiked;
			likeCount += newLiked ? 1 : -1;
			localStorage.setItem(`blog-liked-${post.slug}`, String(newLiked));
		}
	};

	const handleComment = async () => {
		if (!commentName.trim() || !commentBody.trim()) return;
		submitting = true;
		try {
			const res = await fetch(`/api/blog/${post.slug}/comments`, {
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

	onMount(async () => {
		fetch(`/api/blog/${post.slug}/view`, { method: 'POST' });
		viewCount += 1;
		liked = localStorage.getItem(`blog-liked-${post.slug}`) === 'true';
		await loadComments();
	});
</script>

<svelte:head>
	<title>{post.title} | Lethabo Maepa</title>
	<meta name="description" content={post.excerpt ?? post.title} />
</svelte:head>

<section class="section-wrap py-8 md:py-10" in:fade={{ duration: 220 }}>
	<div class="panel">
		<div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
			<h1 class="text-2xl font-bold md:text-3xl">{post.title}</h1>
			<Button variant="outline" href="/blog">
				<ArrowLeft size={16} />
				Back to blog
			</Button>
		</div>

		<div class="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
			<span class="flex items-center gap-1">
				<Calendar size={13} />
				{new Date(post.created_at).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})}
			</span>
			{#if post.tags?.length}
				<span class="flex items-center gap-1">
					<Tag size={13} />
					{post.tags.join(', ')}
				</span>
			{/if}
		</div>

		<div class="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
			<span class="flex items-center gap-1">
				<Eye size={13} />
				{viewCount} views
			</span>
			<button
				onclick={handleLike}
				class="flex cursor-pointer items-center gap-1 transition-colors hover:text-red-400"
				class:text-red-400={liked}
			>
				<Heart size={13} fill={liked ? 'currentColor' : 'none'} />
				{likeCount} {likeCount === 1 ? 'like' : 'likes'}
			</button>
			<span class="flex items-center gap-1">
				<MessageCircle size={13} />
				{post.comment_count ?? 0} comments
			</span>
		</div>

		{#if post.cover_image}
			<img
				src={post.cover_image}
				alt={post.title}
				class="mt-5 w-full rounded-md border border-white/10 object-cover"
			/>
		{/if}

		<div class="prose mt-6 max-w-none dark:prose-invert">
			<TrixDisplay content={post.content} />
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
