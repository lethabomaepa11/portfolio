<script>
	import { slide } from 'svelte/transition';
</script>

<div class="flex min-h-screen w-screen flex-col items-center justify-center">
	<h1 class="text-4xl text-blue-400">Lethabo Maepa</h1>
	<div
		class="mt-12 animate-pulse md:mt-0 md:w-1/2"
		in:slide={{ delay: 300, duration: 500, direction: 'right' }}
	>
		<div class="group relative">
			<div
				class="absolute -inset-2 rounded-full bg-blue-400/30 blur-lg transition-opacity group-hover:opacity-75"
			></div>
			<img
				src="/coder.png"
				alt="Lethabo Maepa"
				class="relative mx-auto w-full max-w-md transform rounded-2xl transition-transform group-hover:-translate-y-2"
			/>
		</div>
	</div>

	<p class="animate-bounce text-xl font-bold">Loading...</p>
</div>
