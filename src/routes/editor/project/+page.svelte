<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import TrixEditor from '$lib/custom_components/TrixEditor.svelte';
	import { ArrowLeft, Save, X } from 'lucide-svelte';
	import { onMount } from 'svelte';
	let { data } = $props();
	let projects = $state(data.data.projects);
	let trixValue = $state('');
	let projectData = $state({
		state: false,
		type: '',
		project: {
			title: '',
			description: '',
			image: '',
			githubUrl: '',
			demoUrl: '',
			case_study: '',
			technologies: []
		}
	});
	let currentProject = $state(null);
	// Project CRUD operations
	const saveProject = async (e) => {
		//{title: '', description: '', image: '', githubUrl: '', demoUrl: '', technologies: []}
		e.preventDefault();
		isLoading = true;
		const formData = new FormData(e.target);
		formData.append('title', projectData.project.title);
		formData.append('description', projectData.project.description);
		formData.append('image', projectData.project.image);
		formData.append('githubUrl', projectData.project.githubUrl);
		formData.append('demoUrl', projectData.project.demoUrl);
		formData.append('case_study', projectData.project.case_study);
		formData.append('technologies', projectData.project.technologies); //sent as a string, will be processed and sent to db as array
		const response = await fetch('/api/projects/create', {
			method: 'POST',
			body: formData
		});
		const res = await response.json();
		if (res.success) {
			if (currentProject.id) {
				const index = projects.findIndex((p) => p.id === currentProject.id);
				projects[index] = currentProject;
			} else {
				projects = [...projects, projectData.project];
			}
		}
		projectData = false;
		isLoading = false;
	};

	const editProject = async (e) => {
		//{title: '', description: '', image: '', githubUrl: '', demoUrl: '', technologies: []}
		isLoading = true;
		e.preventDefault();
		const formData = new FormData(e.target);
		formData.append('title', projectData.project.title);
		formData.append('description', projectData.project.description);
		formData.append('image', projectData.project.image);
		formData.append('id', projectData.project.id);
		formData.append('githubUrl', projectData.project.githubUrl);
		formData.append('demoUrl', projectData.project.demoUrl);
		formData.append('case_study', projectData.project.case_study);
		formData.append('technologies', projectData.project.technologies); //sent as a string, will be processed and sent to db as array
		const response = await fetch('/api/projects/edit', {
			method: 'POST',
			body: formData
		});
		const res = await response.json();
		if (res.success) {
			currentProject = { ...projectData.project };
			projectData = true;
		}
		isLoading = false;
	};

	onMount(() => {
		let localData = JSON.parse(localStorage.getItem('projectData'));
		if (localData) {
			projectData = localData;
			currentProject = localData.project;
		}
	});
	let isLoading = $state(false);
</script>

<div class=" flex flex-col bg-background p-4 py-8">
	<h2 class="flex w-full items-center justify-between text-2xl font-bold">
		<span>
			<Button onclick={() => goto('/editor')} variant="ghost" class="text-xl"><ArrowLeft /></Button>
			{projectData.type === 'edit' ? 'Edit' : 'Add'} Project
		</span>

		<Button
			onclick={() => {
				localStorage.removeItem('projectData');
				location.reload();
			}}
			variant="ghost"
			class="bg-red-500 text-primary"
		>
			<X class="mr-2" /> Clear
		</Button>
	</h2>

	<form
		enctype="multipart/form-data"
		onsubmit={projectData.type === 'edit' ? editProject : saveProject}
		class="space-y-4"
	>
		<div>
			<label for="title">Title</label>
			<input
				name="title"
				bind:value={projectData.project.title}
				placeholder="Project Title"
				class="w-full rounded border bg-background p-2"
			/>
		</div>
		<div>
			<label for="description">Description</label>
			<textarea
				name="description"
				bind:value={projectData.project.description}
				placeholder="Project Description"
				class="h-32 w-full rounded border bg-background p-2"
			/>
		</div>
		<div>
			<label for="image">Image</label>
			<input
				name="image"
				type="file"
				onchange={(e) => (projectData.project.image = e.target.files[0])}
				class="w-full rounded border bg-background"
			/>
		</div>
		<span class="flex w-full gap-4">
			<div class="w-1/2">
				<label for="githubUrl">GitHub URL</label>
				<input
					name="githubUrl"
					bind:value={projectData.project.githubUrl}
					placeholder="GitHub URL"
					class="w-full rounded border bg-background p-2"
				/>
			</div>

			<div class="w-1/2">
				<label for="demoUrl">Demo URL</label>
				<input
					name="demoUrl"
					bind:value={projectData.project.demoUrl}
					placeholder="Demo URL"
					class="w-full rounded border bg-background p-2"
				/>
			</div>
		</span>

		<div>
			<label for="technologies">Technologies</label>
			<input
				name="technologies"
				bind:value={projectData.project.technologies}
				placeholder="Technologies"
				class="w-full rounded border bg-background p-2"
			/>
		</div>
		<TrixEditor bind:value={projectData.project.case_study} id="editor" />
		<Button type="submit" class="w-full">
			<Save class="mr-2" /> Save Project
		</Button>
	</form>
</div>
