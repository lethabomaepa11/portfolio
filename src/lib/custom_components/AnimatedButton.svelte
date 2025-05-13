<script>
	let { children, href, onclick, className } = $props();
</script>

<a
	{href}
	{onclick}
	class="group bg-primary {className} relative isolation-auto z-10 mx-auto flex items-center justify-center gap-2 overflow-hidden rounded-md border-2 border-gray-50 px-4 py-1.5 text-primary-foreground shadow-xl backdrop-blur-md before:absolute before:-left-full before:-z-10 before:aspect-square before:w-full before:rounded-md before:bg-blue-500 before:transition-all before:duration-700 hover:text-gray-50 before:hover:left-0 before:hover:w-full before:hover:scale-150 before:hover:duration-700 lg:font-semibold"
>
	{@render children()}
</a>
