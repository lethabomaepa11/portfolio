<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import Loading from '$lib/custom_components/Loading.svelte';

	import {
		Plus,
		Trash,
		Edit,
		Save,
		BrainCog,
		Contact,
		FolderCode,
		HelpingHand,
		House,
		User,
		X,
		LogOut
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { auth } from '$lib/state.svelte.js';
	import { goto } from '$app/navigation';
	let { data } = $props();
	let projects = $state(data.data.projects);
	// Sample data structures
	let skills = $state(data.data.skills);
	let aboutInfo = $state({ ...data.data.info, resume: '' });
	let contactInfo = $state(data.data.info);
	let isLoading = $state(false);

	let activeTab = $state('home');

	let newSkill = $state('');

	let password = $state('');
	let error = $state('');

	const deleteProject = async (id) => {
		isLoading = true;
		const response = await fetch('/api/projects/delete', {
			method: 'POST',
			body: JSON.stringify({ id })
		});
		const res = await response.json();
		if (res.success) {
			projects = projects.filter((p) => p.id !== id);
		}
		isLoading = false;
	};

	//Info crud operations
	const updateInfo = async (e) => {
		e.preventDefault();
		isLoading = true;
		const formData = new FormData();
		formData.append('resume', aboutInfo.resume);
		formData.append('id', 1);
		formData.append('about', aboutInfo.about);
		formData.append('headline', aboutInfo.headline);
		const response = await fetch('/api/info/update', {
			method: 'POST',
			body: formData
		});
		const res = await response.json();
		if (res.success) {
			// Update local state
			aboutInfo = { ...aboutInfo, resume: aboutInfo.resume };
		}
		isLoading = false;
	};
	const updateContactInfo = async (e) => {
		e.preventDefault();
		isLoading = true;
		const formData = new FormData(e.target);
		const contactInfo = Object.fromEntries(formData.entries());
		const response = await fetch('/api/contact/update', {
			method: 'POST',
			body: contactInfo
		});
		const res = await response.json();
		if (res.success) {
			// Update local state
			// ...
		}
		isLoading = false;
	};
	let mobile = $state(new IsMobile());
	let isMobile = $state(mobile.current);
	const handleLogout = () => {
		auth.isAuthenticated = false;
		localStorage.removeItem('a');
		password = '';
	};

	onMount(async () => {
		window.addEventListener('resize', () => {
			mobile = new IsMobile();
			isMobile = mobile.current;
		});
	});
</script>

<title>Editor | Lethabo Maepa</title>
{#if isLoading}
	<Loading />
{/if}

<div class="container mx-auto p-6">
	<h1 class="mb-6 text-3xl font-bold">My Portfolio Editor</h1>

	<div>
		<div
			class="fixed bottom-0 z-50 flex w-screen justify-between gap-1 bg-background p-4 md:static md:w-full md:justify-normal"
		>
			<Button
				variant={isMobile ? 'ghost' : 'primary'}
				class="cursor-pointer rounded-lg {activeTab === 'home'
					? 'bg-blue-50 text-foreground dark:bg-gray-700'
					: 'bg-none'} flex flex-col items-center px-5 py-6 md:flex-row md:text-lg md:font-bold "
				onclick={() => (activeTab = 'home')}
			>
				<House /> Home
			</Button>
			<Button
				variant={isMobile ? 'ghost' : 'primary'}
				class="cursor-pointer rounded-lg {activeTab === 'projects'
					? 'bg-blue-50 text-foreground dark:bg-gray-700'
					: 'bg-none'} flex flex-col items-center px-5 py-6 md:flex-row md:text-lg md:font-bold "
				onclick={() => (activeTab = 'projects')}
			>
				<FolderCode />Projects
			</Button>

			<Button
				variant={isMobile ? 'ghost' : 'primary'}
				class="cursor-pointer rounded-lg {activeTab === 'contact'
					? 'bg-blue-50 text-foreground dark:bg-gray-700'
					: 'bg-none'} flex flex-col  items-center px-5 py-6 md:flex-row md:text-lg md:font-bold "
				onclick={() => (activeTab = 'contact')}
			>
				<Contact />Contact
			</Button>
			<Button
				variant={isMobile ? 'ghost' : 'primary'}
				class="flex cursor-pointer flex-col items-center rounded-lg px-5 py-6 text-red-500 md:flex-row md:text-lg md:font-bold "
				onclick={handleLogout}
			>
				<LogOut />Logout
			</Button>
		</div>

		{#if activeTab === 'home' && !isLoading}
			<form
				enctype="multipart/form-data"
				onsubmit={updateInfo}
				class="mb-20 flex flex-col gap-4 p-4"
			>
				<div>
					<label for="about">About</label>
					<textarea
						id="about"
						class="w-full rounded border bg-background p-2"
						placeholder="About"
						bind:value={aboutInfo.about}
					></textarea>
				</div>
				<div>
					<label for="headline">Headline</label>
					<input
						id="headline"
						class="w-full rounded border bg-background p-2"
						placeholder="Headline"
						bind:value={aboutInfo.headline}
					/>
				</div>
				<div class="">
					<label for="resume">Upload New Resume PDF</label>
					<input
						onchange={(e) => {
							aboutInfo.resume = e.target.files[0];
						}}
						id="resume"
						class="w-full rounded border bg-background"
						type="file"
					/>
				</div>
				<Button type="submit" class="mt-4"><Save class="mr-2" /> Update Info</Button>
			</form>
		{:else if activeTab === 'projects' && !isLoading}
			<div class="mb-20 p-4">
				<div class="mb-4 flex justify-between">
					<h2 class="text-xl font-semibold">Manage Projects</h2>
					<Button
						onclick={() => {
							goto('/editor/project');
						}}
					>
						<Plus class="mr-2" /> Add Project
					</Button>
				</div>

				<div class="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{#each projects as project}
						<div
							class="rounded-xl bg-gray-800 p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
						>
							<div class="mb-4 flex justify-between">
								<Button
									onclick={() => {
										let projectData = {
											state: true,
											type: 'edit',
											project: { ...project, image: '' }
										};
										localStorage.setItem('projectData', JSON.stringify(projectData));
										goto('/editor/project');
									}}><Edit class="mr-2" /></Button
								>
								<Button onclick={() => deleteProject(project.id)}><Trash class="mr-2" /></Button>
							</div>
							<img
								src={project.image}
								alt={project.title}
								class="mx-auto mb-4 h-48 w-full rounded-lg opacity-80"
							/>
							<h2 class=" text-2xl font-semibold text-white">{project.title}</h2>
							<p class="mt-2 line-clamp-3 max-w-full break-words text-gray-400">
								{project.description}
							</p>
							<span class="mt-2 space-x-2 text-center text-gray-400">
								{#each project.technologies as tech}
									<span class="inline-block rounded-2xl bg-gray-700 px-2 py-1 text-xs">{tech}</span>
								{/each}
							</span>
							<div class="mt-6 flex justify-between">
								<a
									href={project.githubUrl}
									class="text-lg font-medium text-blue-400 transition hover:text-blue-300"
									target="_blank">GitHub</a
								>
								{#if project.demoUrl}
									<a
										href={project.demoUrl}
										class="rounded-lg bg-blue-500 px-5 py-2 text-lg font-bold text-white shadow-lg transition hover:bg-blue-600"
										target="_blank">Live Demo</a
									>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{:else if activeTab === 'skills' && !isLoading}
			<!-- Skills Tab -->
			<div class="mb-20 p-4">
				<div class="mb-4 flex gap-2">
					<input bind:value={newSkill} class="flex-1 rounded border p-2" placeholder="New skill" />
					<Button
						onclick={() => {
							skills = [...skills, newSkill];
							newSkill = '';
						}}
					>
						<Plus class="mr-2" /> Add Skill
					</Button>
				</div>
				<div class="flex flex-wrap gap-2">
					{#each skills as skill}
						<div class="flex items-center rounded-full bg-background px-3 py-1 text-blue-800">
							{skill}
							<Trash
								size={14}
								class="ml-2 cursor-pointer hover:text-blue-600"
								onclick={() => (skills = skills.filter((s) => s !== skill))}
							/>
						</div>
					{/each}
				</div>
			</div>
		{:else if activeTab === 'contact' && !isLoading}
			<!-- Contact Tab -->
			<div class="mb-20 p-4">
				<div class="space-y-4">
					<div>
						<label for="email" class="mb-2 block">Email</label>
						<input name="email" bind:value={contactInfo.email} class="w-full rounded border p-2" />
					</div>
					<div>
						<label for="phone" class="mb-2 block">Phone</label>
						<input name="phone" bind:value={contactInfo.phone} class="w-full rounded border p-2" />
					</div>
					<div>
						<label for="linkedin" class="mb-2 block">Linkedin</label>
						<input
							name="linkedin"
							bind:value={contactInfo.linkedin}
							class="w-full rounded border p-2"
						/>
					</div>
					<div>
						<label for="github" class="mb-2 block">Github</label>
						<input
							name="github"
							bind:value={contactInfo.github}
							class="w-full rounded border p-2"
						/>
					</div>

					<Button><Save class="mr-2" /> Save Contact Info</Button>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
	}
</style>
