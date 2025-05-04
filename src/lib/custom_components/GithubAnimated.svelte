<script>
	import { Github } from 'lucide-svelte';

	let { href } = $props();
</script>

<section class="flex items-center justify-center">
	<a
		class="group flex justify-center rounded-md bg-gradient-to-r from-gray-800 to-black p-2 font-semibold text-white drop-shadow-xl transition-all duration-500 hover:translate-y-3 hover:rounded-[50%] hover:from-[#331029] hover:to-[#310413]"
		{href}
	>
		<Github />
		<span
			class="absolute opacity-0 duration-700 group-hover:-translate-y-10 group-hover:text-sm group-hover:text-gray-700 group-hover:opacity-100"
		>
			GitHub
		</span>
	</a>
</section>
