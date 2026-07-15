<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import ConfirmDialog from '$lib/custom_components/ConfirmDialog.svelte';
	import Toast from '$lib/custom_components/Toast.svelte';
	import Loading from '$lib/custom_components/Loading.svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';

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
		NotebookPen,
		User,
		X
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { auth } from '$lib/state.svelte.js';
	import { goto } from '$app/navigation';

	let { data } = $props();
	let projects = $state([]);
	let skills = $state([]);
	let aboutInfo = $state({ resume: '' });
	let contactInfo = $state({});
	let isLoading = $state(false);

	let activeTab = $state('home');

	let newSkill = $state('');

	let blogPosts = $state([]);
	let blogLoading = $state(false);

	let mobile = $state(new IsMobile());
	let isMobile = $state(false);

	// Confirm dialog state
	let confirmOpen = $state(false);
	let confirmTitle = $state('');
	let confirmMessage = $state('');
	let confirmAction = $state(null);

	// Toast state
	let toastVisible = $state(false);
	let toastMessage = $state('');
	let toastType = $state('success');

	const showToast = (message, type = 'success') => {
		toastMessage = message;
		toastType = type;
		toastVisible = false;
		// Use microtask to restart animation
		queueMicrotask(() => {
			toastVisible = true;
		});
	};

	const confirmThen = (title, message, fn) => {
		confirmTitle = title;
		confirmMessage = message;
		confirmAction = fn;
		confirmOpen = true;
	};

	const deleteProject = async (id) => {
		isLoading = true;
		try {
			const response = await fetch('/api/projects/delete', {
				method: 'POST',
				body: JSON.stringify({ id })
			});
			const res = await response.json();
			if (res.success) {
				projects = projects.filter((p) => p.id !== id);
				showToast('Project deleted');
			} else {
				showToast(res.error || 'Failed to delete project', 'error');
			}
		} catch {
			showToast('Network error deleting project', 'error');
		} finally {
			isLoading = false;
		}
	};

	const fetchBlogPosts = async () => {
		blogLoading = true;
		try {
			const res = await fetch('/api/blog/list');
			const json = await res.json();
			blogPosts = json.posts ?? [];
		} catch {
			blogPosts = [];
			showToast('Failed to load blog posts', 'error');
		} finally {
			blogLoading = false;
		}
	};

	const deleteBlogPost = async (id) => {
		try {
			const res = await fetch('/api/blog/delete', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id })
			});
			const result = await res.json();
			if (result.success) {
				blogPosts = blogPosts.filter((p) => p.id !== id);
				showToast('Blog post deleted');
			} else {
				showToast(result.error || 'Failed to delete post', 'error');
			}
		} catch {
			showToast('Network error deleting post', 'error');
		}
	};

	const updateInfo = async (e) => {
		e.preventDefault();
		isLoading = true;
		try {
			const formData = new FormData();
			if (aboutInfo.resume instanceof File) {
				formData.append('resume', aboutInfo.resume);
			}
			formData.append('id', 1);
			formData.append('about', aboutInfo.about);
			formData.append('headline', aboutInfo.headline);
			const response = await fetch('/api/info/update', {
				method: 'POST',
				body: formData
			});
			const res = await response.json();
			if (res.success) {
				showToast('Info updated');
			} else {
				showToast(res.error || 'Failed to update info', 'error');
			}
		} catch {
			showToast('Network error updating info', 'error');
		} finally {
			isLoading = false;
		}
	};

	const updateContactInfo = async (e) => {
		e.preventDefault();
		isLoading = true;
		try {
			const response = await fetch('/api/contact/update', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					contactInfo: {
						email: contactInfo.email,
						phone: contactInfo.phone,
						linkedin: contactInfo.linkedin,
						github: contactInfo.github
					}
				})
			});
			const res = await response.json();
			if (res.success) {
				showToast('Contact info updated');
			} else {
				showToast(res.error || 'Failed to update contact', 'error');
			}
		} catch {
			showToast('Network error updating contact', 'error');
		} finally {
			isLoading = false;
		}
	};

	const addSkill = async () => {
		const trimmed = newSkill.trim();
		if (!trimmed) return;
		try {
			const res = await fetch('/api/skills/create', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ skill: { skill: trimmed } })
			});
			const json = await res.json();
			if (json.success) {
				skills = [...skills, json.data];
				newSkill = '';
				showToast('Skill added');
			} else {
				showToast(json.error || 'Failed to add skill', 'error');
			}
		} catch {
			showToast('Network error adding skill', 'error');
		}
	};

	const deleteSkill = async (id) => {
		try {
			const res = await fetch('/api/skills/delete', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id })
			});
			const json = await res.json();
			if (json.success) {
				skills = skills.filter((s) => s.id !== id);
				showToast('Skill removed');
			} else {
				showToast(json.error || 'Failed to remove skill', 'error');
			}
		} catch {
			showToast('Network error removing skill', 'error');
		}
	};

	$effect(() => {
		if (data?.data) {
			projects = data.data.projects ?? [];
			skills = data.data.skills ?? [];
			aboutInfo = { ...data.data.info, resume: '' };
			contactInfo = data.data.info ?? {};
		}
	});

	$effect(() => {
		isMobile = mobile.current;
	});

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

<div class="editor-page-shell mx-auto max-w-6xl p-4 md:p-6">
	<div>
		<div class="fixed bottom-0 left-0 right-0 z-50 flex justify-between gap-1 border-t border-border bg-background p-2 md:static md:border-t-0 md:bg-transparent md:p-0">
			<button
				type="button"
				class="flex cursor-pointer flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors md:flex-row md:gap-2 md:px-4 md:py-3 md:text-sm {activeTab === 'home'
					? 'bg-primary/10 text-primary'
					: 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
				onclick={() => (activeTab = 'home')}
			>
				<House size={16} /> Home
			</button>
			<button
				type="button"
				class="flex cursor-pointer flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors md:flex-row md:gap-2 md:px-4 md:py-3 md:text-sm {activeTab === 'projects'
					? 'bg-primary/10 text-primary'
					: 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
				onclick={() => (activeTab = 'projects')}
			>
				<FolderCode size={16} />Projects
			</button>
			<button
				type="button"
				class="flex cursor-pointer flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors md:flex-row md:gap-2 md:px-4 md:py-3 md:text-sm {activeTab === 'blog'
					? 'bg-primary/10 text-primary'
					: 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
				onclick={() => {
					activeTab = 'blog';
					fetchBlogPosts();
				}}
			>
				<NotebookPen size={16} />Blog
			</button>
			<button
				type="button"
				class="flex cursor-pointer flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors md:flex-row md:gap-2 md:px-4 md:py-3 md:text-sm {activeTab === 'contact'
					? 'bg-primary/10 text-primary'
					: 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
				onclick={() => (activeTab = 'contact')}
			>
				<Contact size={16} />Contact
			</button>
		</div>

		{#key activeTab}
			<section class="mt-4 md:mt-6" in:fly={{ y: 24, duration: 340 }} out:fade={{ duration: 180 }}>
				{#if activeTab === 'home' && !isLoading}
					<form onsubmit={updateInfo} class="mb-20 space-y-5 rounded-xl border border-border bg-card p-6">
						<h2 class="text-xl font-semibold">About / Home</h2>
						<div>
							<label for="about" class="mb-1.5 block text-sm font-medium">About</label>
							<textarea
								id="about"
								class="w-full rounded-lg border border-border bg-background p-3 text-sm"
								rows="5"
								placeholder="Write your about section..."
								bind:value={aboutInfo.about}
							></textarea>
						</div>
						<div>
							<label for="headline" class="mb-1.5 block text-sm font-medium">Headline</label>
							<input
								id="headline"
								class="w-full rounded-lg border border-border bg-background p-3 text-sm"
								placeholder="e.g. Full-Stack Developer"
								bind:value={aboutInfo.headline}
							/>
						</div>
						<div>
							<label for="resume" class="mb-1.5 block text-sm font-medium">Upload New Resume PDF</label>
							<input
								onchange={(e) => {
									aboutInfo.resume = e.target.files[0];
								}}
								id="resume"
								class="w-full rounded-lg border border-border bg-background text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary"
								type="file"
								accept=".pdf"
							/>
						</div>
						<Button type="submit" class="w-full md:w-auto"><Save class="mr-2" size={16} /> Update Info</Button>
					</form>

					<div class="mb-20 rounded-xl border border-border bg-card p-6">
						<h2 class="mb-4 text-xl font-semibold">Skills</h2>
						<div class="mb-4 flex gap-2">
							<input
								bind:value={newSkill}
								class="flex-1 rounded-lg border border-border bg-background p-2.5 text-sm"
								placeholder="Add a new skill..."
								onkeydown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
							/>
							<Button onclick={addSkill} disabled={!newSkill.trim()}>
								<Plus class="mr-2" size={16} /> Add
							</Button>
						</div>
						{#if skills.length === 0}
							<p class="text-sm text-muted-foreground">No skills yet. Add your first one above.</p>
						{:else}
							<div class="flex flex-wrap gap-2">
								{#each skills as skill (skill.id)}
									<div class="group flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm">
										{skill.skill ?? skill}
										<button
											type="button"
											onclick={() => deleteSkill(skill.id)}
											class="rounded-full p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
											aria-label="Remove {skill.skill ?? skill}"
										>
											<X size={12} />
										</button>
									</div>
								{/each}
							</div>
						{/if}
					</div>

				{:else if activeTab === 'projects' && !isLoading}
					<div class="mb-20">
						<div class="mb-6 flex items-center justify-between">
							<h2 class="text-xl font-semibold">Manage Projects</h2>
							<Button onclick={() => goto('/editor/project')}>
								<Plus class="mr-2" size={16} /> Add Project
							</Button>
						</div>

						{#if projects.length === 0}
							<div class="rounded-xl border border-border bg-card p-12 text-center">
								<p class="text-sm text-muted-foreground">No projects yet.</p>
							</div>
						{:else}
							<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
								{#each projects as project (project.id)}
									<div class="group rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-md">
										<div class="relative">
											{#if project.image}
												<img
													src={project.image}
													alt={project.title}
													class="h-44 w-full rounded-t-xl object-cover"
												/>
											{/if}
											<div class="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
												<Button
													size="sm"
													variant="outline"
													onclick={() => {
														localStorage.setItem(
															'projectData',
															JSON.stringify({
																state: true,
																type: 'edit',
																project: { ...project, image: '' }
															})
														);
														goto('/editor/project');
													}}
												>
													<Edit size={14} />
												</Button>
												<Button
													size="sm"
													variant="outline"
													onclick={() =>
														confirmThen(
															'Delete Project',
															`Permanently delete "${project.title}"?`,
															() => deleteProject(project.id)
														)}
												>
													<Trash size={14} />
												</Button>
											</div>
										</div>
										<div class="space-y-2 p-4">
											<h3 class="font-semibold">{project.title}</h3>
											<p class="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
											{#if project.technologies?.length}
												<div class="flex flex-wrap gap-1">
													{#each project.technologies as tech}
														<span class="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{tech}</span>
													{/each}
												</div>
											{/if}
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>

				{:else if activeTab === 'contact' && !isLoading}
					<form onsubmit={updateContactInfo} class="mb-20 space-y-5 rounded-xl border border-border bg-card p-6">
						<h2 class="text-xl font-semibold">Contact Information</h2>
						<div>
							<label for="email" class="mb-1.5 block text-sm font-medium">Email</label>
							<input
								id="email"
								name="email"
								type="email"
								bind:value={contactInfo.email}
								class="w-full rounded-lg border border-border bg-background p-2.5 text-sm"
							/>
						</div>
						<div>
							<label for="phone" class="mb-1.5 block text-sm font-medium">Phone</label>
							<input
								id="phone"
								name="phone"
								bind:value={contactInfo.phone}
								class="w-full rounded-lg border border-border bg-background p-2.5 text-sm"
							/>
						</div>
						<div>
							<label for="linkedin" class="mb-1.5 block text-sm font-medium">LinkedIn</label>
							<input
								id="linkedin"
								name="linkedin"
								type="url"
								bind:value={contactInfo.linkedin}
								class="w-full rounded-lg border border-border bg-background p-2.5 text-sm"
								placeholder="https://linkedin.com/in/..."
							/>
						</div>
						<div>
							<label for="github" class="mb-1.5 block text-sm font-medium">GitHub</label>
							<input
								id="github"
								name="github"
								type="url"
								bind:value={contactInfo.github}
								class="w-full rounded-lg border border-border bg-background p-2.5 text-sm"
								placeholder="https://github.com/..."
							/>
						</div>
						<Button type="submit" class="w-full md:w-auto"><Save class="mr-2" size={16} /> Save Contact Info</Button>
					</form>

				{:else if activeTab === 'blog'}
					<div class="mb-20">
						<div class="mb-6 flex items-center justify-between">
							<h2 class="text-xl font-semibold">Manage Blog Posts</h2>
							<Button onclick={() => goto('/editor/blog')}>
								<Plus class="mr-2" size={16} /> Add Post
							</Button>
						</div>

						{#if blogLoading}
							<div class="flex items-center justify-center py-12">
								<p class="text-sm text-muted-foreground">Loading posts...</p>
							</div>
						{:else if blogPosts.length === 0}
							<div class="rounded-xl border border-border bg-card p-12 text-center">
								<p class="text-sm text-muted-foreground">No blog posts yet.</p>
							</div>
						{:else}
							<div class="space-y-3">
								{#each blogPosts as post (post.id)}
									<div class="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/30">
										<div class="min-w-0 flex-1">
											<div class="flex items-center gap-2">
												<h3 class="font-semibold">{post.title}</h3>
												<span class="rounded-full px-2 py-0.5 text-xs font-medium {post.published ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'}">
													{post.published ? 'Published' : 'Draft'}
												</span>
											</div>
											<p class="mt-0.5 truncate text-sm text-muted-foreground">/{post.slug}</p>
											<div class="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
												<span>{post.view_count ?? 0} views</span>
												<span>&middot;</span>
												<span>{new Date(post.created_at).toLocaleDateString()}</span>
											</div>
										</div>
										<div class="flex gap-2">
											<Button
												size="sm"
												variant="outline"
												onclick={() => {
													localStorage.setItem(
														'blogPostData',
														JSON.stringify({
															id: post.id,
															title: post.title,
															slug: post.slug,
															excerpt: post.excerpt || '',
															content: post.content || '',
															cover_image: post.cover_image || '',
															tags: (post.tags ?? []).join(', '),
															published: post.published
														})
													);
													goto('/editor/blog');
												}}
											>
												<Edit size={14} />
											</Button>
											<Button
												size="sm"
												variant="outline"
												onclick={() =>
													confirmThen(
														'Delete Blog Post',
														`Permanently delete "${post.title}"?`,
														() => deleteBlogPost(post.id)
													)}
											>
												<Trash size={14} />
											</Button>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{/if}
			</section>
		{/key}
	</div>
</div>

<ConfirmDialog
	bind:open={confirmOpen}
	title={confirmTitle}
	message={confirmMessage}
	onConfirm={confirmAction ?? (() => {})}
/>

<Toast bind:visible={toastVisible} message={toastMessage} type={toastType} />
