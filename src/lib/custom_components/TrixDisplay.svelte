<script>
	let { content } = $props();
</script>

<article class="prose prose-lg w-full rounded-lg">
	{@html content}
</article>

<style>
	article {
		border-radius: 0.5rem;
		padding: 1rem;
	}

	article :global(h1) {
		@apply mb-2 text-2xl font-bold;
	}

	article :global(blockquote) {
		@apply border-l-4 pl-4 italic;
	}

	article :global(pre) {
		@apply rounded p-2 font-mono text-sm;
	}

	article :global(a) {
		@apply underline;
	}

	article :global(ul) {
		@apply list-inside list-disc;
	}

	article :global(ol) {
		@apply list-inside list-decimal;
	}

	article :global(ul li::marker),
	article :global(ol li::marker) {
	}
</style>
