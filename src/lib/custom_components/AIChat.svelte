<script>
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/state';
	import { decrypt, encrypt } from '$lib';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { models } from '$lib/state.svelte';
	import {
		BotMessageSquare,
		Maximize2,
		Mic,
		Minimize,
		Minimize2,
		Send,
		Volume2Icon,
		X
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	let { isMobile } = $props();

	//messages from user will have the sender as "user", from ai as "assistant"
	let messages = $state([
		{
			sender: 'assistant',
			message: "Hi there! 👋 Ask me about Lethabo's skills, projects, or how to get in touch!"
		}
	]);
	let formMessage = $state('');
	let chat = $state({
		state: 'minimized', //closed, minimized or open
		isTyping: false,
		isRedirecting: false,
		redirectPage: '',
		model: null,
		element: null,
		isSpeaking: false
	});
	const handleChatStateChange = (state) => {
		chat.state = state;
		localStorage.setItem('chatState', chat.state);
		if (chat.state == 'open') {
			setTimeout(() => scrollToBottom(chat.element), 10);
		}
	};
	const handleModelChange = () => {
		chat.model = models.getModel(modelIndex);
	};
	let modelIndex = $state(0);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (formMessage.length === 0) {
			return;
		}
		messages.push({
			sender: 'user',
			message: formMessage.trim()
		});
		setTimeout(() => scrollToBottom(chat.element), 1);

		chat.isTyping = true;

		if (!chat.model) {
			//get a random model
			chat.model = models.getRandomModel();
		}

		//the question
		models.question = formMessage.trim() + '\nCurrent page is ' + page.url.pathname;

		//call the api
		const chatRes = await fetch('/api/ai', {
			method: 'POST',
			body: JSON.stringify({ model: chat.model.id, message: models.promptMessage() })
		});

		//the response
		const response = await chatRes.json();

		chat.isTyping = false;

		if (!response.success) {
			//add it to the messages
			messages.push({
				sender: 'assistant',
				message: 'This model could not process your prompt, try a different model'
			});
			chat.model = models.getRandomModel();
		}

		//for redirect/navigation feat
		let answer = response.response.trim();
		const inLower = answer.toLowerCase();
		const searchString = 'redirect(';
		if (inLower.includes(searchString)) {
			//get the page,
			const startIndex = inLower.lastIndexOf(searchString) + searchString.length;
			const endIndex = inLower.indexOf(')', startIndex);
			let page = inLower.substring(startIndex, endIndex);
			if (page.includes('about')) {
				page = ''; //root page
			}
			answer = answer.replace(
				inLower.substring(startIndex - searchString.length, endIndex + 1),
				'Taking you to: ' + page + ' page'
			);
			chat.isRedirecting = true;
			chat.redirectPage = page;
			goto((isMobile ? '#' : '/') + page);
		}
		//add it to the messages
		messages.push({
			sender: 'assistant',
			message: answer
		});
		speak(answer);
		localStorage.setItem('lclmsgs', encrypt(JSON.stringify(messages)));
		setTimeout(() => scrollToBottom(chat.element), 1);
		formMessage = '';
	};

	afterNavigate(() => {
		chat.isRedirecting = false;
		chat.redirectPage = '';
	});
	const scrollToBottom = (node) => {
		node.scroll({
			top: node.scrollHeight,
			behaviour: 'smooth'
		});
	};
	onMount(() => {
		chat.state = localStorage.getItem('chatState') || 'closed';
		try {
			const raw = localStorage.getItem('lclmsgs');
			if (raw) {
				messages = JSON.parse(decrypt(raw)) || messages;
				setTimeout(() => scrollToBottom(chat.element), 1);
			}
		} catch (err) {
			// Optionally reset or ignore
		}
	});

	const handleSpeechToText = (e) => {
		if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
			try {
				const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
				const recognition = new SpeechRecognition();
				recognition.lang = 'en-US';
				recognition.interimResults = false;
				recognition.maxAlternatives = 1;

				recognition.onresult = (event) => {
					const voiceInput = event.results[0][0].transcript;
					formMessage = voiceInput;
					handleSubmit(e);
				};

				recognition.start();
			} catch (error) {
				alert('Something went wrong while starting speech recognition.');
			}
		} else {
			alert(
				"Sorry, your browser doesn't support voice search. Please use Chrome on desktop or Android."
			);
		}
	};
	const speak = (text) => {
		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = 'en-ZA';
		utterance.pitch = 1;
		utterance.rate = 1;
		utterance.volume = 1;

		const setVoiceAndSpeak = () => {
			const voices = speechSynthesis.getVoices();

			// Try to find a male voice (preferring en-ZA or English)
			const maleVoice =
				voices.find(
					(v) => v.lang === 'en-ZA' && /male|david|google uk english male/i.test(v.name)
				) ||
				voices.find(
					(v) => /en/.test(v.lang) && /male|david|google uk english male/i.test(v.name)
				) ||
				voices.find((v) => /en/.test(v.lang)); // fallback

			if (maleVoice) {
				utterance.voice = maleVoice;
			}

			speechSynthesis.speak(utterance);
			chat.isSpeaking = true;
		};

		// Voices may not be loaded yet
		if (speechSynthesis.getVoices().length === 0) {
			speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
		} else {
			setVoiceAndSpeak();
		}
	};
</script>

{#if chat.state == 'closed'}
	<Button onclick={() => handleChatStateChange('open')} class="fixed bottom-4 right-10">
		<BotMessageSquare />
		Ask LeeAI
	</Button>
{:else}
	<div
		class=" fixed bottom-4 z-50 flex shadow-lg lg:right-10 {chat.state == 'open'
			? 'h-[80svh]'
			: ''} w-[92svw] flex-col justify-between rounded-2xl border bg-background p-2
        shadow-xl lg:w-2/6"
		transition:slide
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<header
			name="header"
			id="header"
			data-name="header"
			onclick={(e) => {
				if (chat.state == 'minimized' && e.target.dataset.name == 'header') {
					handleChatStateChange('open');
				}
			}}
			class="border-current/60 flex items-center justify-between p-2"
		>
			<div>
				LeeAI Assistant
				<p class="text-xs text-green-700">{chat.isTyping ? 'typing...' : ''}</p>
			</div>
			<div class="flex gap-2">
				{#if speechSynthesis.speaking}
					<Button variant="ghost" onclick={() => speechSynthesis.cancel}>
						<Volume2Icon />
					</Button>
				{/if}
				{#if chat.state == 'minimized'}
					<Button variant="ghost" onclick={() => handleChatStateChange('open')}>
						<Maximize2 />
					</Button>
				{:else}
					<Button variant="ghost" onclick={() => handleChatStateChange('minimized')}>
						<Minimize2 />
					</Button>
				{/if}
				<Button
					class="text-destructive"
					variant="ghost"
					onclick={() => handleChatStateChange('closed')}
				>
					<X />
				</Button>
			</div>
		</header>
		{#if chat.state == 'open'}
			<main
				bind:this={chat.element}
				class="h-full w-full space-y-2 overflow-auto border-t p-2"
				transition:slide
			>
				{#each messages as message}
					{#if message.sender == 'assistant'}
						<div class="flex w-full justify-start">
							<div class="max-w-[70%] overflow-clip whitespace-pre-wrap rounded-xl bg-gray-500 p-2">
								{message.message}
							</div>
						</div>
					{:else}
						<div class="flex w-full justify-end">
							<div
								class="max-w-2/3 max-w-[70%] overflow-clip whitespace-pre-wrap rounded-xl border p-2"
							>
								{message.message}
							</div>
						</div>
					{/if}
				{/each}
				{#if chat.isTyping}
					<div class="w-full">
						<div class="max-w-2/3 end-0 animate-ping whitespace-pre-wrap rounded-xl">typing...</div>
					</div>
				{/if}
				{#if chat.isRedirecting}
					<div class="w-full">
						<div class="max-w-2/3 end-0 whitespace-pre-wrap rounded-xl">
							Taking you to: {chat.redirectPage}
						</div>
					</div>
				{/if}
			</main>
			<div transition:slide class="my-2 flex gap-3">
				Model:
				<select
					class="rounded-2xl border-current bg-background text-current"
					bind:value={modelIndex}
					onchange={handleModelChange}
				>
					{#each models.data as llm, i}
						<option value={i}>{llm.id}</option>
					{/each}
				</select>
			</div>
			<form
				transition:slide
				method="POST"
				onsubmit={handleSubmit}
				class="flex w-full items-center gap-1 border-t p-2 shadow-lg"
			>
				<Input bind:value={formMessage} type="text" placeholder="Ask me anything" />
				{#if formMessage.length == 0}
					<Button onclick={handleSpeechToText} type="button" variant="ghost" class="">
						<Mic />
					</Button>
				{:else}
					<Button disabled={formMessage.length == 0} type="submit" variant="ghost" class="">
						<Send />
					</Button>
				{/if}
			</form>
		{/if}
	</div>
{/if}
