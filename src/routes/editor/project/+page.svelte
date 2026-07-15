<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import RichTextEditor from '$lib/custom_components/RichTextEditor.svelte';
	import Toast from '$lib/custom_components/Toast.svelte';
	import { ArrowLeft, Save, LoaderCircle } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';

	let { data } = $props();
	let projects = $state([]);

	$effect(() => {
		if (data?.data?.projects) projects = data.data.projects;
	});

	let projectData = $state({
		state: false,
		type: '',
		project: {
			id: null,
			title: '',
			description: '',
			image: '',
			imageFile: null,
			githubUrl: '',
			demoUrl: '',
			case_study: '',
			technologies: ''
		}
	});
	let currentProject = $state(null);
	let isSaving = $state(false);
	let errors = $state({});

	let toastVisible = $state(false);
	let toastMessage = $state('');
	let toastType = $state('success');

	const showToast = (message, type = 'success') => {
		toastMessage = message;
		toastType = type;
		toastVisible = false;
		queueMicrotask(() => { toastVisible = true; });
	};

	const validate = () => {
		const e = {};
		if (!projectData.project.title.trim()) e.title = 'Title is required';
		if (!projectData.project.description.trim()) e.description = 'Description is required';
		errors = e;
		return Object.keys(e).length === 0;
	};

	const isEdit = $derived(projectData.type === 'edit');

	const saveProject = async (e) => {
		e.preventDefault();
		if (!validate()) return;

		isSaving = true;
		const fd = new FormData();
		fd.append('title', projectData.project.title.trim());
		fd.append('description', projectData.project.description.trim());
		fd.append('githubUrl', projectData.project.githubUrl);
		fd.append('demoUrl', projectData.project.demoUrl);
		fd.append('case_study', projectData.project.case_study);
		fd.append('technologies', projectData.project.technologies);

		if (projectData.project.imageFile) {
			fd.append('image', projectData.project.imageFile);
		}

		try {
			const endpoint = isEdit ? '/api/projects/edit' : '/api/projects/create';
			if (isEdit) fd.append('id', projectData.project.id);

			const response = await fetch(endpoint, { method: 'POST', body: fd });
			const res = await response.json();

			if (res.success) {
				showToast(isEdit ? 'Project updated' : 'Project created');
				localStorage.removeItem('projectData');
				setTimeout(() => goto('/editor'), 800);
			} else {
				showToast(res.error || 'Failed to save project', 'error');
			}
		} catch {
			showToast('Network error saving project', 'error');
		} finally {
			isSaving = false;
		}
	};

	onMount(() => {
		const saved = localStorage.getItem('projectData');
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				projectData = {
					state: parsed.state ?? false,
					type: parsed.type ?? '',
					project: {
						id: parsed.project?.id ?? null,
						title: parsed.project?.title ?? '',
						description: parsed.project?.description ?? '',
						image: parsed.project?.image ?? '',
						imageFile: null,
						githubUrl: parsed.project?.githubUrl ?? '',
						demoUrl: parsed.project?.demoUrl ?? '',
						case_study: parsed.project?.case_study ?? '',
						technologies: Array.isArray(parsed.project?.technologies) ? parsed.project.technologies.join(', ') : (parsed.project?.technologies ?? '')
					}
				};
				currentProject = parsed.project;
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
			<h1 class="text-2xl font-bold">{isEdit ? 'Edit' : 'New'} Project</h1>
		</div>
		<Button
			onclick={() => {
				localStorage.removeItem('projectData');
				goto('/editor');
			}}
			variant="ghost"
			size="sm"
			class="text-muted-foreground hover:text-red-500"
		>
			Cancel
		</Button>
	</div>

	<form
		in:fly={{ y: 16, duration: 320 }}
		out:fade={{ duration: 180 }}
		enctype="multipart/form-data"
		onsubmit={saveProject}
		class="space-y-5 rounded-xl border border-border bg-card p-6"
	>
		<div>
			<label for="title" class="mb-1.5 block text-sm font-medium">Title <span class="text-red-500">*</span></label>
			<input
				id="title"
				name="title"
				bind:value={projectData.project.title}
				placeholder="Project Title"
				class="w-full rounded-lg border bg-background p-2.5 text-sm {errors.title ? 'border-red-500' : 'border-border'}"
			/>
			{#if errors.title}
				<p class="mt-1 text-xs text-red-500">{errors.title}</p>
			{/if}
		</div>

		<div>
			<label for="description" class="mb-1.5 block text-sm font-medium">Description <span class="text-red-500">*</span></label>
			<textarea
				id="description"
				name="description"
				bind:value={projectData.project.description}
				placeholder="Project Description"
				rows="4"
				class="h-32 w-full rounded-lg border bg-background p-2.5 text-sm {errors.description ? 'border-red-500' : 'border-border'}"
			></textarea>
			{#if errors.description}
				<p class="mt-1 text-xs text-red-500">{errors.description}</p>
			{/if}
		</div>

		<div>
			<label for="technologies" class="mb-1.5 block text-sm font-medium">Technologies</label>
			<input
				id="technologies"
				name="technologies"
				bind:value={projectData.project.technologies}
				placeholder="Svelte, Supabase, Tailwind (comma separated)"
				class="w-full rounded-lg border border-border bg-background p-2.5 text-sm"
			/>
		</div>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div>
				<label for="githubUrl" class="mb-1.5 block text-sm font-medium">GitHub URL</label>
				<input
					id="githubUrl"
					name="githubUrl"
					bind:value={projectData.project.githubUrl}
					placeholder="https://github.com/..."
					class="w-full rounded-lg border border-border bg-background p-2.5 text-sm"
				/>
			</div>
			<div>
				<label for="demoUrl" class="mb-1.5 block text-sm font-medium">Demo URL</label>
				<input
					id="demoUrl"
					name="demoUrl"
					bind:value={projectData.project.demoUrl}
					placeholder="https://demo.example.com"
					class="w-full rounded-lg border border-border bg-background p-2.5 text-sm"
				/>
			</div>
		</div>

		<div>
			<label for="image" class="mb-1.5 block text-sm font-medium">Image</label>
			<input
				id="image"
				name="image"
				type="file"
				accept="image/*"
				onchange={(e) => {
					const file = e.target.files[0];
					if (file) {
						projectData.project.imageFile = file;
						projectData.project.image = URL.createObjectURL(file);
					}
				}}
				class="w-full rounded-lg border border-border bg-background text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary"
			/>
			{#if projectData.project.image && typeof projectData.project.image === 'string'}
				<div class="mt-2 overflow-hidden rounded-lg border border-border">
					<img src={projectData.project.image} alt="Preview" class="h-40 w-full object-cover" />
				</div>
			{/if}
		</div>

		<div>
			<label for="project-case-study" class="mb-1.5 block text-sm font-medium">Case Study / Long Description</label>
			<RichTextEditor bind:value={projectData.project.case_study} id="project-case-study" placeholder="Write a detailed case study..." />
		</div>

		<Button type="submit" class="w-full" disabled={isSaving}>
			{#if isSaving}
				<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
				Saving...
			{:else}
				<Save class="mr-2" size={16} />
				{isEdit ? 'Update' : 'Create'} Project
			{/if}
		</Button>
	</form>
</div>

<Toast bind:visible={toastVisible} message={toastMessage} type={toastType} />
