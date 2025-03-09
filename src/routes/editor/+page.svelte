<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import Loading from '$lib/custom_components/Loading.svelte';

	import { Plus, Trash, Edit, Save, BrainCog, Contact, FolderCode, HelpingHand, House, User, X, LogOut } from 'lucide-svelte';
	import { onMount } from 'svelte';
	let {data} = $props();
	let projects = $state(data.data.projects);
	// Sample data structures
	let skills = $state(data.data.skills);
	let aboutInfo = $state({...data.data.info,resume: ""});
	let contactInfo = $state(data.data.info);
	let isLoading = $state(false);

	let activeTab = $state('home');
	let showProjectModal = $state({state:false, type: "",project: {title: '', description: '', image: '', githubUrl: '', demoUrl: '', technologies: []}});
	let currentProject = $state(null);
	let newSkill = $state('');

	// Authentication state (implement proper auth)
	let isAuthenticated = $state(false);
	let password = $state('');
	let error = $state('');
	const handleLogin = async (e) => {
		isLoading = true;
		error = '';
		const response = await fetch('/api/auth', {
			method: 'POST',
			body: JSON.stringify({ key: password })
		});
		const res = await response.json();
		if (res.success) {
			isAuthenticated = true;
			localStorage.setItem('a', "4a258380-e0b0-487f-a7dd-8ddcd215661c");
		} else {
			const errors = ["What's happening?👀👀","Bro, you're not me☠️","Craaaazzzyyy, try again😅😅","That's funny😅"]
			error = errors[Math.floor(Math.random() * errors.length)];
		}
		isLoading = false;
	};

	// Project CRUD operations
	const saveProject = async (e) => {
		//{title: '', description: '', image: '', githubUrl: '', demoUrl: '', technologies: []}
		e.preventDefault();
		isLoading = true;
		const formData = new FormData(e.target);
		formData.append('title', showProjectModal.project.title);
		formData.append('description', showProjectModal.project.description);
		formData.append('image', showProjectModal.project.image);
		formData.append('githubUrl', showProjectModal.project.githubUrl);
		formData.append('demoUrl', showProjectModal.project.demoUrl);
		formData.append('technologies', showProjectModal.project.technologies);//sent as a string, will be processed and sent to db as array
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
				projects = [...projects, showProjectModal.project];
			}
		}
		showProjectModal = false;
		isLoading = false;
	};

	const editProject = async (e) => {
		//{title: '', description: '', image: '', githubUrl: '', demoUrl: '', technologies: []}
		isLoading = true;
		e.preventDefault();
		const formData = new FormData(e.target);
		formData.append('title', showProjectModal.project.title);
		formData.append('description', showProjectModal.project.description);
		formData.append('image', showProjectModal.project.image);
		formData.append('id', showProjectModal.project.id);
		formData.append('githubUrl', showProjectModal.project.githubUrl);
		formData.append('demoUrl', showProjectModal.project.demoUrl);
		formData.append('technologies', showProjectModal.project.technologies);//sent as a string, will be processed and sent to db as array
		const response = await fetch('/api/projects/edit', {
			method: 'POST',
			body: formData
		});
		const res = await response.json();
		if (res.success) {
			currentProject = { ...showProjectModal.project };
			showProjectModal = true;
		}
		isLoading = false;
	};

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
		console.log(formData);
		const response = await fetch('/api/info/update', {
			method: 'POST',
			body: formData, 
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
		console.log(contactInfo);
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
		isAuthenticated = false;
		localStorage.removeItem('a');
		password = '';
	}

	onMount(async () => {
		window.addEventListener('resize', () => {
			mobile = new IsMobile();
			isMobile = mobile.current;
		});
		password = localStorage.getItem('a');
		if(password){
			handleLogin(null);
		}
		password = '';
	});

</script>
<title>Editor | Lethabo Maepa</title>
{#if isLoading}
	<Loading/>
{/if}
{#if !isAuthenticated}
	<div class="flex min-h-screen items-center justify-center bg-background">
		<form onsubmit={handleLogin} class="w-96">
			<h2 class="mb-4 text-2xl font-bold">Who are you?👀👀</h2>
			<input
				type="password"
				bind:value={password}
				class="mb-4 w-full rounded border bg-background p-2"
				placeholder="Enter whatever you wanna enter🚶🏿🚶🏿"
			/>
			{#if error}
				<p class="mb-4 text-red-500">{error}</p>
			{/if}
			<Button type="submit" class="w-full">Proceed</Button>
		</form>
	</div>
{:else}
	<div class="container mx-auto p-6">
		<h1 class="mb-6 text-3xl font-bold">My Portfolio Editor</h1>
 
		<div>
			<div class="flex justify-between md:justify-normal gap-1 z-50 fixed md:static md:w-full w-screen bottom-0 bg-background p-4">
				<Button variant={isMobile ? 'ghost' : 'primary'} class="cursor-pointer rounded-lg {activeTab === 'home' ? 'bg-blue-50 dark:bg-gray-700 text-foreground' : 'bg-none'} px-5 py-6 flex flex-col items-center md:text-lg md:font-bold md:flex-row " onclick={() => (activeTab = 'home')}>
					<House/> Home
				</Button>
				<Button variant={isMobile ? 'ghost' : 'primary'} class="cursor-pointer rounded-lg {activeTab === 'projects' ? 'bg-blue-50 dark:bg-gray-700 text-foreground' : 'bg-none'} px-5 py-6 flex flex-col items-center md:text-lg md:font-bold md:flex-row " onclick={() => (activeTab = 'projects')}>
					<FolderCode/>Projects
				</Button>
				

				<Button variant={isMobile ? 'ghost' : 'primary'} class="cursor-pointer rounded-lg {activeTab === 'contact' ? 'bg-blue-50 dark:bg-gray-700 text-foreground' : 'bg-none'} px-5 py-6  flex flex-col items-center md:text-lg md:font-bold md:flex-row " onclick={() => (activeTab = 'contact')}>
					<Contact/>Contact
				</Button>
				<Button variant={isMobile ? 'ghost' : 'primary'} class="text-red-500 cursor-pointer rounded-lg px-5 py-6 flex flex-col items-center md:text-lg md:font-bold md:flex-row " onclick={handleLogout}>
					<LogOut/>Logout 
				</Button>
			</div>
			

			 {#if activeTab === 'home' && !isLoading}
			 <form enctype="multipart/form-data" onsubmit={updateInfo} class="p-4 flex flex-col gap-4 mb-20">
				<div>
					<label for="about">About</label>
					<textarea id="about" class="w-full rounded bg-background border p-2" placeholder="About" bind:value={aboutInfo.about}></textarea>
				</div>
				<div>
					<label for="headline">Headline</label>
					<input id="headline" class="w-full rounded bg-background border p-2" placeholder="Headline" bind:value={aboutInfo.headline} />
				</div>
				<div class="">
					<label for="resume">Upload New Resume PDF</label>
					<input onchange={(e) => {
						aboutInfo.resume = e.target.files[0];
					  }} id="resume" class="w-full rounded bg-background border" type="file" />

				</div>
				<Button type="submit" class="mt-4"><Save class="mr-2" /> Update Info</Button>
			</form>
			 {:else if activeTab === 'projects' && !isLoading}
			<div class="p-4 mb-20">
				<div class="mb-4 flex justify-between">
					<h2 class="text-xl font-semibold">Manage Projects</h2>
					<Button
						onclick={() => {
							currentProject = {};
							showProjectModal = {...showProjectModal, state:true, type: 'add', project: {}};
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
						<div class="flex justify-between mb-4">
							<Button onclick={() => showProjectModal = {state:true, type: 'edit', project: {...project, image: ""}}}><Edit class="mr-2" /></Button>
							<Button onclick={() => deleteProject(project.id)}><Trash class="mr-2" /></Button>
						</div>
						<img src={project.image} alt={project.title} class="mx-auto mb-4 h-48 w-full opacity-80 rounded-lg" />
						<h2 class=" text-2xl font-semibold text-white">{project.title}</h2>
						<p class="mt-2  text-gray-400 max-w-full break-words line-clamp-3">
							{project.description}
						  </p>					
						  <span class="mt-2 text-center text-gray-400 space-x-2">
							{#each project.technologies as tech}
							<span class="inline-block rounded-2xl text-xs bg-gray-700 px-2 py-1">{tech}</span>
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
			<div class="p-4 mb-20">
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
			<div class="p-4 mb-20">
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
						<input name="linkedin" bind:value={contactInfo.linkedin} class="w-full rounded border p-2" />
					</div>
					<div>
						<label for="github" class="mb-2 block">Github</label>
						<input name="github" bind:value={contactInfo.github} class="w-full rounded border p-2" />
					</div>

					<Button><Save class="mr-2" /> Save Contact Info</Button>
				</div>
			</div>
			{/if}
		</div>
{#if showProjectModal.state && !isLoading}
		<div class="fixed top-0 left-0 z-50 flex flex-col p-4 py-20  max-h-screen w-screen items-center justify-center bg-background overflow-auto">
			<h2 class="text-2xl font-bold flex justify-between items-center w-full md:w-2/4">{showProjectModal.type === 'edit' ? 'Edit' : 'Add'} Project
				<Button onclick={() => showProjectModal = false} variant="ghost" class="text-xl"><X class="mr-2" /></Button>
			</h2>
			<form enctype="multipart/form-data" onsubmit={showProjectModal.type === 'edit' ? editProject : saveProject} class="space-y-4 md:w-2/4">
				
				<div>
				<label for="title">Title</label>
				<input name="title"
					bind:value={showProjectModal.project.title}
					placeholder="Project Title"
					class="w-full rounded border p-2 bg-background"
				/>
				</div>
				<div>
				<label for="description">Description</label>
				<textarea name="description"
					bind:value={showProjectModal.project.description}
					placeholder="Project Description"
					class="h-32 w-full rounded border p-2 bg-background"
				/>
				</div>
				<div>
					<label for="image">Image</label>
					<input name="image" type="file" onchange={(e) => showProjectModal.project.image = e.target.files[0]} class="w-full rounded border bg-background" />
				</div>
				<span class="flex gap-4 w-full">
					<div class="w-1/2">
						<label for="githubUrl">GitHub URL</label>
						<input name="githubUrl"
							bind:value={showProjectModal.project.githubUrl}
							placeholder="GitHub URL"
							class="w-full rounded border p-2 bg-background"
						/>
						</div>
					
					<div class="w-1/2">
					<label for="demoUrl">Demo URL</label>
					<input name="demoUrl"
						bind:value={showProjectModal.project.demoUrl}
						placeholder="Demo URL"
						class="w-full rounded border p-2 bg-background"
					/>
					</div>
				</span>
				
				<div>
					<label for="technologies">Technologies</label>
					<input name="technologies"
						bind:value={showProjectModal.project.technologies}
						placeholder="Technologies"
						class="w-full rounded border p-2 bg-background"
					/>
					</div>
				<Button type="submit" class="w-full">
					<Save class="mr-2" /> Save Project
				</Button>
			</form>
		</div>
		{/if}
	</div>
{/if}

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
	}

	
</style>
