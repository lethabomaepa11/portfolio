<script>
	import { supabase } from '$lib/supabase';
	import { Bold, Italic, Heading1, Heading2, Heading3, Link, List, ListOrdered, Quote, Image, Undo, Redo } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let { value = $bindable(), id = 'rte', placeholder = 'Start writing...', minHeight = '300px' } = $props();

	let editorEl;
	let isFocused = $state(false);

	const exec = (cmd, val = null) => {
		document.execCommand(cmd, false, val);
		editorEl?.focus();
	};

	const handleInput = () => {
		if (editorEl) {
			value = editorEl.innerHTML;
		}
	};

	const handlePaste = async (e) => {
		const items = e.clipboardData?.items;
		if (!items) return;

		for (const item of items) {
			if (item.type.startsWith('image/')) {
				e.preventDefault();
				const file = item.getAsFile();
				if (!file) continue;
				const url = await uploadImage(file);
				if (url) {
					exec('insertImage', url);
				}
				return;
			}
		}
	};

	const uploadImage = async (file) => {
		try {
			const ext = file.name?.split('.').pop() || 'png';
			const fileName = `editor/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
			const { error } = await supabase.storage.from('files').upload(fileName, file);
			if (error) throw error;
			const { data: { publicUrl } } = supabase.storage.from('files').getPublicUrl(fileName);
			return publicUrl;
		} catch (err) {
			console.error('Image upload failed:', err);
			return null;
		}
	};

	const insertLink = () => {
		const url = prompt('Enter link URL:');
		if (url) exec('createLink', url);
	};

	const addHeading = (level) => {
		exec('formatBlock', `<h${level}>`);
	};

	const handleToolbarAction = (fn) => (e) => {
		e.preventDefault();
		fn();
	};

	onMount(() => {
		if (editorEl && value) {
			editorEl.innerHTML = value;
		}
	});
</script>

<div class="rte-wrapper" class:rte-focused={isFocused}>
	<div class="rte-toolbar" role="toolbar" aria-label="Text formatting">
		<button type="button" onclick={handleToolbarAction(() => addHeading(1))} title="Heading 1" class="rte-btn"><Heading1 size={16} /></button>
		<button type="button" onclick={handleToolbarAction(() => addHeading(2))} title="Heading 2" class="rte-btn"><Heading2 size={16} /></button>
		<button type="button" onclick={handleToolbarAction(() => addHeading(3))} title="Heading 3" class="rte-btn"><Heading3 size={16} /></button>
		<span class="rte-separator"></span>
		<button type="button" onclick={handleToolbarAction(() => exec('bold'))} title="Bold" class="rte-btn"><Bold size={16} /></button>
		<button type="button" onclick={handleToolbarAction(() => exec('italic'))} title="Italic" class="rte-btn"><Italic size={16} /></button>
		<button type="button" onclick={handleToolbarAction(insertLink)} title="Insert Link" class="rte-btn"><Link size={16} /></button>
		<span class="rte-separator"></span>
		<button type="button" onclick={handleToolbarAction(() => exec('insertUnorderedList'))} title="Bullet List" class="rte-btn"><List size={16} /></button>
		<button type="button" onclick={handleToolbarAction(() => exec('insertOrderedList'))} title="Numbered List" class="rte-btn"><ListOrdered size={16} /></button>
		<button type="button" onclick={handleToolbarAction(() => exec('formatBlock', '<blockquote>'))} title="Blockquote" class="rte-btn"><Quote size={16} /></button>
		<span class="rte-separator"></span>
		<button type="button" onclick={handleToolbarAction(() => exec('undo'))} title="Undo" class="rte-btn"><Undo size={16} /></button>
		<button type="button" onclick={handleToolbarAction(() => exec('redo'))} title="Redo" class="rte-btn"><Redo size={16} /></button>
	</div>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={editorEl}
		contenteditable
		role="textbox"
		aria-multiline="true"
		aria-label={placeholder}
		class="rte-editor"
		style="min-height: {minHeight}"
		oninput={handleInput}
		onpaste={handlePaste}
		onfocus={() => (isFocused = true)}
		onblur={() => (isFocused = false)}
	></div>

	{#if !editorEl?.innerHTML?.trim() || editorEl?.innerHTML === '<br>'}
		<p class="rte-placeholder">{placeholder}</p>
	{/if}
</div>

<style>
	.rte-wrapper {
		@apply rounded-lg border border-border bg-background transition-colors;
	}

	.rte-wrapper.rte-focused {
		@apply border-primary/50 ring-1 ring-primary/20;
	}

	.rte-toolbar {
		@apply flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/30 px-2 py-1.5;
		border-radius: 0.5rem 0.5rem 0 0;
	}

	.rte-btn {
		@apply inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground;
	}

	.rte-btn:active {
		@apply bg-muted/80;
	}

	.rte-separator {
		@apply mx-1 h-5 w-px bg-border;
	}

	.rte-editor {
		@apply w-full bg-transparent p-4 text-foreground outline-none;
	}

	.rte-editor :global(h1) {
		@apply mb-2 text-2xl font-bold;
	}

	.rte-editor :global(h2) {
		@apply mb-1.5 text-xl font-semibold;
	}

	.rte-editor :global(h3) {
		@apply mb-1 text-lg font-semibold;
	}

	.rte-editor :global(blockquote) {
		@apply my-2 border-l-4 border-muted-foreground/30 pl-4 italic text-muted-foreground;
	}

	.rte-editor :global(pre) {
		@apply my-2 rounded bg-muted p-3 font-mono text-sm;
	}

	.rte-editor :global(code) {
		@apply rounded bg-muted px-1.5 py-0.5 font-mono text-sm;
	}

	.rte-editor :global(a) {
		@apply text-primary underline;
	}

	.rte-editor :global(ul) {
		@apply list-inside list-disc;
	}

	.rte-editor :global(ol) {
		@apply list-inside list-decimal;
	}

	.rte-editor :global(img) {
		@apply my-2 max-w-full rounded-lg;
	}

	.rte-placeholder {
		@apply pointer-events-none absolute left-4 top-[calc(3rem+8px)] text-sm text-muted-foreground/50;
	}
</style>
