<script>
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/state';
	import { encrypt } from '$lib';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { models } from '$lib/state.svelte';
	import { marked } from 'marked';
	import { BotMessageSquare, Maximize2, Minimize2, Send, X } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';

	let { isMobile } = $props();

	let messages = $state([
		{
			sender: 'assistant',
			message:
				'Hi, I am Ask AI. I can help recruiters quickly review skills, projects, pricing, and best-fit role evidence.'
		}
	]);
	let formMessage = $state('');
	let chat = $state({
		state: 'closed', // closed | minimized | open
		isTyping: false,
		isRedirecting: false,
		redirectPage: '',
		element: null,
		model: ''
	});

	const quickPrompts = [
		'Summarize candidate fit for a graduate frontend developer role.',
		'Which project should a recruiter open first, and why?',
		'What is the pricing range and what affects scope?',
		'Draft a short recruiter outreach message for interview invitation.'
	];

	const handleChatStateChange = (state) => {
		chat.state = state;
		localStorage.setItem('chatState', chat.state);
		if (chat.state === 'open') {
			setTimeout(() => scrollToBottom(chat.element), 10);
		}
	};

	const scrollToBottom = (node) => {
		if (!node) return;
		node.scroll({
			top: node.scrollHeight,
			behavior: 'smooth'
		});
	};

	const handleThinking = (answer) => {
		const tag = 'think>';
		const endIndex = answer.indexOf('</' + tag);
		if (endIndex === -1) return answer;
		return answer.substring(endIndex + tag.length + 2).trim();
	};

	const handleAutoRedirect = (answer) => {
		const inLower = answer.toLowerCase();
		const searchString = 'redirect(';
		if (!inLower.includes(searchString)) return answer;

		const startIndex = inLower.lastIndexOf(searchString) + searchString.length;
		const endIndex = inLower.indexOf(')', startIndex);
		if (endIndex === -1) return answer;

		let targetPage = inLower.substring(startIndex, endIndex).trim();
		if (targetPage.includes('about')) targetPage = '';

		chat.isRedirecting = true;
		chat.redirectPage = targetPage || 'home';
		goto((isMobile ? '#' : '/') + targetPage);

		return (
			`Taking you to ${targetPage || 'home'} page.\n` +
			answer.replace(inLower.substring(startIndex - searchString.length, endIndex + 1), '')
		);
	};

	const ask = async (prompt) => {
		if (!prompt?.trim()) return;

		messages.push({ sender: 'user', message: prompt.trim() });
		formMessage = '';
		chat.isTyping = true;
		setTimeout(() => scrollToBottom(chat.element), 10);

		models.question =
			prompt.trim() +
			`\nCurrent page: ${page.url.pathname}\nChat history: ${JSON.stringify(messages)}`;

		const chatRes = await fetch('/api/ai', {
			method: 'POST',
			body: JSON.stringify({ message: encrypt(models.promptMessage()) })
		});
		const response = await chatRes.json();

		chat.isTyping = false;

		if (!response.success || !response.response) {
			messages.push({
				sender: 'assistant',
				message: 'I could not process that request right now. Please try again in a moment.'
			});
			return;
		}

		let answer = response.response.trim();
		if (answer.includes('<think>')) answer = handleThinking(answer);
		answer = handleAutoRedirect(answer);

		messages.push({ sender: 'assistant', message: answer });
		chat.model = response.model || '';
		setTimeout(() => scrollToBottom(chat.element), 10);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		await ask(formMessage);
	};

	const handleQuickPrompt = async (prompt) => {
		await ask(prompt);
	};

	afterNavigate(() => {
		chat.isRedirecting = false;
		chat.redirectPage = '';
	});

	onMount(() => {
		chat.state = localStorage.getItem('chatState') || 'closed';
	});
</script>

<div class="pointer-events-none fixed inset-0 z-[70]">
	{#if chat.state === 'closed'}
		<Button
			onclick={() => handleChatStateChange('open')}
			class="pointer-events-auto absolute bottom-5 right-5 rounded-full px-4 py-3 shadow-lg"
		>
			<BotMessageSquare />
			Ask AI
		</Button>
	{:else}
		<div
			class="pointer-events-auto absolute bottom-5 right-5 flex w-[min(420px,92vw)] flex-col rounded-2xl border border-white/10 bg-card/95 shadow-2xl backdrop-blur"
			transition:fade
		>
			<header class="flex items-center justify-between border-b border-white/10 p-3">
				<div class="text-sm font-semibold">
					Ask AI
					<p class="text-xs text-muted-foreground">{chat.isTyping ? 'Thinking...' : 'Recruiter assistant'}</p>
				</div>
				<div class="flex gap-1">
					{#if chat.state === 'minimized'}
						<Button variant="ghost" size="icon" onclick={() => handleChatStateChange('open')}>
							<Maximize2 size={16} />
						</Button>
					{:else}
						<Button variant="ghost" size="icon" onclick={() => handleChatStateChange('minimized')}>
							<Minimize2 size={16} />
						</Button>
					{/if}
					<Button variant="ghost" size="icon" onclick={() => handleChatStateChange('closed')}>
						<X size={16} />
					</Button>
				</div>
			</header>

			{#if chat.state === 'open'}
				<div class="border-b border-white/10 p-2">
					<div class="flex flex-wrap gap-2">
						{#each quickPrompts as prompt}
							<button
								type="button"
								class="rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground hover:text-primary"
								onclick={() => handleQuickPrompt(prompt)}
							>
								{prompt}
							</button>
						{/each}
					</div>
				</div>

				<main bind:this={chat.element} class="h-[52vh] space-y-3 overflow-auto p-3" transition:slide>
					{#each messages as message}
						{#if message.sender === 'assistant'}
							<div class="max-w-[88%] rounded-xl bg-background/70 p-2 text-sm">
								<div class="prose prose-sm max-w-none dark:prose-invert">
									{@html marked(message.message)}
								</div>
							</div>
						{:else}
							<div class="ml-auto max-w-[88%] rounded-xl border border-white/10 bg-primary/10 p-2 text-sm">
								{message.message}
							</div>
						{/if}
					{/each}

					{#if chat.isRedirecting}
						<div class="text-xs text-primary">Navigating to: {chat.redirectPage}</div>
					{/if}
				</main>

				<div class="border-t border-white/10 p-2">
					{#if chat.model}
						<p class="mb-2 text-xs text-muted-foreground">Model: {chat.model}</p>
					{/if}
					<form onsubmit={handleSubmit} class="flex items-center gap-2">
						<Input bind:value={formMessage} type="text" placeholder="Ask about fit, projects, pricing, or contact..." />
						<Button type="submit" size="icon" disabled={chat.isTyping || !formMessage.trim()}>
							<Send size={16} />
						</Button>
					</form>
				</div>
			{/if}
		</div>
	{/if}
</div>
