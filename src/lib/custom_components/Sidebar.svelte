<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		BrainCog,
		BriefcaseBusiness,
		Contact,
		FolderCode,
		HelpingHand,
		House,
		User
	} from 'lucide-svelte';
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';
	import { pages } from '$lib/pages.svelte';
	let { isMobile } = $props();

	let menuItems = pages;
</script>

{#if isMobile}
	<nav
		class="flex h-full w-full flex-col gap-1 p-2"
		transition:slide={{ delay: 300, duration: 300, direction: 'right' }}
	>
		<div class="flex h-full flex-col items-start gap-5">
			{#each menuItems as item}
				<a
					href={!isMobile ? `/${item.url}` : `/#${item.url}`}
					class="flex w-full items-center gap-2 p-3 {isMobile
						? $page.url.hash === `#${item.url}`
						: ''} {$page.url?.pathname === `/${item.url}`
						? ' bg-blue-400/50'
						: ''}   justify-center rounded-lg {item.class ??
						''} hover:bg-gray-200 hover:dark:bg-gray-800"
					aria-label={item.title}
				>
					<item.icon
						size={24}
						class="text-muted-foreground transition-colors group-hover:text-foreground"
					/>
					<span class="text-xs font-medium">{item.title}</span>
				</a>
			{/each}
		</div>
	</nav>
{:else}
	<!-- Sidebar (Desktop view, already have links on the header) -->
	<div
		class="mt-10 flex w-full flex-col gap-4 overflow-y-auto p-2"
		transition:slide={{ delay: 300, duration: 300, direction: 'right' }}
	>
		<!-- GitHub Stats Card -->
		<img
			class="w-[250px] rounded-lg"
			src="https://github-readme-stats.vercel.app/api?username=lethabomaepa11&theme=tokyonight&show_icons=true&hide_border=true&count_private=true&include_all_commits=true"
			alt="GitHub Stats"
		/>

		<!-- GitHub Streak -->
		<img
			class="w-[250px] rounded-lg"
			src="https://streak-stats.demolab.com?user=lethabomaepa11&theme=tokyonight&hide_border=true"
			alt="GitHub Streak"
		/>

		<!-- Top Languages -->
		<img
			class="w-[250px] rounded-lg"
			src="https://github-readme-stats.vercel.app/api/top-langs/?username=lethabomaepa11&layout=compact&theme=tokyonight&hide_border=true"
			alt="Top Languages"
		/>

		<!-- Tech Stack Icons -->
		<div class="flex flex-wrap gap-2">
			<img
				src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
				class="h-6 w-6"
				alt="JavaScript"
			/>
			<img
				src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
				class="h-6 w-6"
				alt="TypeScript"
			/>
			<img
				src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
				class="h-6 w-6"
				alt="React"
			/>
			<img
				src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg"
				class="h-6 w-6"
				alt="Svelte"
			/>
			<img
				src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
				class="h-6 w-6"
				alt="Node.js"
			/>
		</div>

		<!-- Quick Contacts -->
		<div class=" flex gap-4">
			<a href="https://github.com/lethabomaepa11" target="_blank" aria-label="GitHub">
				<svg class="h-5 w-5 text-white hover:text-blue-400" fill="currentColor" viewBox="0 0 24 24"
					><path
						d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.84 10.9.57.1.78-.25.78-.55v-1.9c-3.19.7-3.86-1.54-3.86-1.54-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.74 2.67 1.24 3.32.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.44-2.28 1.18-3.08-.12-.29-.51-1.44.11-3 0 0 .96-.31 3.13 1.18a10.93 10.93 0 012.85-.38c.97 0 1.95.13 2.85.38 2.17-1.5 3.13-1.18 3.13-1.18.63 1.56.24 2.71.12 3 .74.8 1.18 1.83 1.18 3.08 0 4.4-2.7 5.37-5.26 5.65.41.36.76 1.09.76 2.2v3.26c0 .3.2.65.79.54A10.5 10.5 0 0023.5 12C23.5 5.65 18.35.5 12 .5z"
					/></svg
				>
			</a>
			<a href="https://linkedin.com/in/lethabomaepa11" target="_blank" aria-label="LinkedIn">
				<svg class="h-5 w-5 text-white hover:text-blue-400" fill="currentColor" viewBox="0 0 24 24"
					><path
						d="M20.452 20.452h-3.728v-5.569c0-1.328-.026-3.036-1.85-3.036-1.85 0-2.134 1.445-2.134 2.939v5.666H9.012V9h3.582v1.561h.05c.498-.945 1.713-1.944 3.527-1.944 3.77 0 4.465 2.482 4.465 5.707v6.128zM5.337 7.433a2.17 2.17 0 110-4.341 2.17 2.17 0 010 4.34zm1.865 13.019H3.472V9h3.73v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.728v20.543C0 23.224.792 24 1.771 24h20.451C23.206 24 24 23.224 24 22.271V1.728C24 .774 23.206 0 22.225 0z"
					/></svg
				>
			</a>
		</div>
	</div>
{/if}
