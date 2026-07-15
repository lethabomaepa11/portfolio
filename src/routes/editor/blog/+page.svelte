<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import RichTextEditor from '$lib/custom_components/RichTextEditor.svelte';
	import Toast from '$lib/custom_components/Toast.svelte';
	import { ArrowLeft, Save, LoaderCircle, Image, X } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';

	let isSaving = $state(false);

	let formData = $state({
		id: null,
		title: '',
		slug: '',
		excerpt: '',
		content: '',
		cover_image: '',
		coverFile: null,
		coverPreview: '',
		tags: '',
		published: false
	});

	let errors = $state({});

	let toastVisible = $state(false);
	let toastMessage = $state('');
	let toastType = $state('success');

	const showToast = (msg, type = 'success') => {
		toastMessage = msg;
		toastType = type;
		toastVisible = false;
		queueMicrotask(() => { toastVisible = true; });
	};

	const isEdit = $derived(!!formData.id);

	const generateSlug = (title) =>
		title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');

	const handleTitleInput = (e) => {
		formData.title = e.target.value;
		if (!formData.id) {
			formData.slug = generateSlug(e.target.value);
		}
	};

	const validate = () => {
		const e = {};
		if (!formData.title.trim()) e.title = 'Title is required';
		if (!formData.slug.trim()) e.slug = 'Slug is required';
		if (!formData.content.trim()) e.content = 'Content is required';
		if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
			e.slug = 'Slug must be lowercase with hyphens only (e.g. my-post-title)';
		}
		errors = e;
		return Object.keys(e).length === 0;
	};

	const savePost = async (e) => {
		e.preventDefault();
		if (!validate()) return;

		isSaving = true;

		const fd = new FormData();
		fd.append('title', formData.title.trim());
		fd.append('slug', formData.slug.trim().toLowerCase());
		fd.append('excerpt', formData.excerpt.trim());
		fd.append('content', formData.content);
		fd.append('tags', formData.tags);
		fd.append('published', String(formData.published));

		if (formData.id) {
			fd.append('id', formData.id);
		}

		if (formData.coverFile) {
			fd.append('cover_image_file', formData.coverFile);
		} else if (formData.cover_image && !formData.coverPreview) {
			fd.append('cover_image', formData.cover_image);
		}

		try {
			const endpoint = formData.id ? '/api/blog/edit' : '/api/blog/create';
			const res = await fetch(endpoint, { method: 'POST', body: fd });
			const result = await res.json();

			if (result.success) {
				showToast(isEdit ? 'Post updated' : 'Post created');
				localStorage.removeItem('blogPostData');
				setTimeout(() => goto('/editor'), 800);
			} else {
				showToast(result.error || 'Failed to save post', 'error');
			}
		} catch {
			showToast('Network error saving post', 'error');
		} finally {
			isSaving = false;
		}
	};

	const handleCoverFile = (e) => {
		const file = e.target.files[0];
		if (file) {
			formData.coverFile = file;
			formData.coverPreview = URL.createObjectURL(file);
			formData.cover_image = '';
		}
	};

	const clearCover = () => {
		formData.coverFile = null;
		formData.coverPreview = '';
		formData.cover_image = '';
	};

	onMount(() => {
		const saved = localStorage.getItem('blogPostData');
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				formData = {
					...formData,
					...parsed,
					coverFile: null,
					coverPreview: parsed.cover_image || ''
				};
			} catch { /* ignore corrupt data */ }
		}
	});
</script>

<div class="editor-page-shell mx-auto max-w-3xl p-4 py-8 md:p-8">
	<div class="mb-6 flex items-center justify-between">
		<div class="flex items-center gap-3">
			<Button onclick={() => goto('/editor')} variant="ghost" size="sm" class="text-muted-foreground">
				<ArrowLeft size={18} />
			</Button>
			<h1 class="text-2xl font-bold">{isEdit ? 'Edit' : 'New'} Blog Post</h1>
		</div>
		<Button
			onclick={() => {
				localStorage.removeItem('blogPostData');
				goto('/editor');
			}}
			variant="ghost"
			size="sm"
			class="text-muted-foreground hover:text-red-500"
		>
			Cancel
		</Button>
	</div>

	<form onsubmit={savePost} in:fly={{ y: 16, duration: 320 }} out:fade={{ duration: 180 }} class="space-y-5 rounded-xl border border-border bg-card p-6">
		<div>
			<label for="title" class="mb-1.5 block text-sm font-medium">Title <span class="text-red-500">*</span></label>
			<input
				id="title"
				value={formData.title}
				oninput={handleTitleInput}
				placeholder="Post title"
				class="w-full rounded-lg border bg-background p-2.5 text-sm {errors.title ? 'border-red-500' : 'border-border'}"
			/>
			{#if errors.title}
				<p class="mt-1 text-xs text-red-500">{errors.title}</p>
			{/if}
		</div>

		<div>
			<label for="slug" class="mb-1.5 block text-sm font-medium">Slug <span class="text-red-500">*</span></label>
			<input
				id="slug"
				bind:value={formData.slug}
				placeholder="my-post-slug"
				class="w-full rounded-lg border bg-background p-2.5 text-sm font-mono {errors.slug ? 'border-red-500' : 'border-border'}"
			/>
			{#if errors.slug}
				<p class="mt-1 text-xs text-red-500">{errors.slug}</p>
			{/if}
			<p class="mt-1 text-xs text-muted-foreground">URL: /blog/{formData.slug || '...'}</p>
		</div>

		<div>
			<label for="excerpt" class="mb-1.5 block text-sm font-medium">Excerpt</label>
			<textarea
				id="excerpt"
				bind:value={formData.excerpt}
				placeholder="Short description shown in blog list"
				rows="2"
				class="w-full rounded-lg border border-border bg-background p-2.5 text-sm"
			></textarea>
		</div>

		<div>
			<label for="blog-content" class="mb-1.5 block text-sm font-medium">Content <span class="text-red-500">*</span></label>
			<RichTextEditor bind:value={formData.content} id="blog-content" placeholder="Write your blog post here..." minHeight="400px" />
			{#if errors.content}
				<p class="mt-1 text-xs text-red-500">{errors.content}</p>
			{/if}
		</div>

		<div>
			<label for="cover_image" class="mb-1.5 block text-sm font-medium">Cover Image</label>
			{#if formData.coverPreview}
				<div class="group relative mb-2 overflow-hidden rounded-lg border border-border">
					<img src={formData.coverPreview} alt="Cover preview" class="h-48 w-full object-cover" />
					<button
						type="button"
						onclick={clearCover}
						class="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
						aria-label="Remove cover image"
					>
						<X size={14} />
					</button>
				</div>
			{/if}
			<div class="flex items-center gap-3">
				<input
					id="cover_image"
					type="file"
					accept="image/*"
					onchange={handleCoverFile}
					class="w-full rounded-lg border border-border bg-background text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary"
				/>
				<span class="text-xs text-muted-foreground">or</span>
				<input
					type="url"
					bind:value={formData.cover_image}
					oninput={() => { formData.coverFile = null; formData.coverPreview = formData.cover_image; }}
					placeholder="https://example.com/image.jpg"
					class="flex-1 rounded-lg border border-border bg-background p-2.5 text-sm"
				/>
			</div>
		</div>

		<div>
			<label for="tags" class="mb-1.5 block text-sm font-medium">Tags</label>
			<input
				id="tags"
				bind:value={formData.tags}
				placeholder="svelte, supabase, webdev (comma separated)"
				class="w-full rounded-lg border border-border bg-background p-2.5 text-sm"
			/>
		</div>

		<div class="flex items-center gap-2">
			<input
				id="published"
				type="checkbox"
				bind:checked={formData.published}
				class="h-4 w-4 rounded border-border text-primary focus:ring-primary"
			/>
			<label for="published" class="text-sm font-medium">Published</label>
		</div>

		<Button type="submit" class="w-full" disabled={isSaving}>
			{#if isSaving}
				<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
				Saving...
			{:else}
				<Save class="mr-2" size={16} />
				{isEdit ? 'Update' : 'Publish'} Post
			{/if}
		</Button>
	</form>
</div>

<Toast bind:visible={toastVisible} message={toastMessage} type={toastType} />
