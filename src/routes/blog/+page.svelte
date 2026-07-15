<script>
	import Seo from '$lib/custom_components/SEO.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Calendar, Tag, Eye, Heart, MessageCircle } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	let { data } = $props();
	let posts = $derived(data.posts);
</script>

<Seo title="Blog" desc="Thoughts on software, design, and building things." />

<section id="blog" class="section-wrap py-10 md:py-12" in:fade={{ duration: 220 }}>
	<div class="panel">
		<p class="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Blog</p>
		<h1 class="mt-2 text-2xl font-bold md:text-3xl">Writing</h1>
		<p class="mt-3 text-sm text-muted-foreground">
			Thoughts on software, design, and building things.
		</p>

		{#if posts.length === 0}
			<div class="mt-6 text-sm text-muted-foreground">No posts yet. Check back soon.</div>
		{:else}
			<div class="mt-6 space-y-4">
				{#each posts as post (post.id)}
					<article class="item-card">
						<div class="flex flex-col gap-3 md:flex-row">
							{#if post.cover_image}
								<img
									src={post.cover_image}
									alt={post.title}
									class="h-36 w-full rounded-md border border-white/10 object-cover md:h-auto md:w-48"
								/>
							{/if}
							<div class="flex flex-1 flex-col">
								<h2 class="text-lg font-semibold">{post.title}</h2>
								<p class="mt-1 text-sm leading-relaxed text-muted-foreground">
									{post.excerpt}
								</p>
								<div class="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
									<span class="flex items-center gap-1">
										<Calendar size={12} />
										{new Date(post.created_at).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'short',
											day: 'numeric'
										})}
									</span>
									{#if post.tags?.length}
										<span class="flex items-center gap-1">
											<Tag size={12} />
											{post.tags.join(', ')}
										</span>
									{/if}
								</div>
								<div class="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
									<span class="flex items-center gap-1">
										<Eye size={12} />
										{post.view_count ?? 0}
									</span>
									<span class="flex items-center gap-1">
										<Heart size={12} />
										{post.like_count ?? 0}
									</span>
									<span class="flex items-center gap-1">
										<MessageCircle size={12} />
										{post.comment_count ?? 0}
									</span>
								</div>
								<div class="mt-3">
									<Button href={`/blog/${post.slug}`} variant="outline" size="sm">
										Read more
									</Button>
								</div>
							</div>
						</div>
					</article>
				{/each}
			</div>
		{/if}
	</div>
</section>
