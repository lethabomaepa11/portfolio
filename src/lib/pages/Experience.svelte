<script>
	import { slide } from 'svelte/transition';
</script>

<section id="experience" class="bg-background lg:py-16" transition:slide={{ duration: 500 }}>
	<div class="container mx-auto max-w-6xl px-4">
		<h2 class="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
			My Experience
		</h2>

		<ol class="relative border-s border-gray-200 dark:border-gray-700">
			<li class="mb-10 ms-4">
				<div
					class="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"
				></div>
				<time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500"
					>Nov 2024 - Present</time
				>
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
					Tech Innovation Lead - GKSS NWU
				</h3>
				<div class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
					Led a society of tech students who participated in hackathons and tech events, also led
					the development of the society's website.
				</div>
			</li>
			<li class="mb-10 ms-4">
				<div
					class="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"
				></div>
				<time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500"
					>May 2025</time
				>
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
					2nd Place - Arcademia Global Game Jam
				</h3>
				<p class="text-base font-normal text-gray-500 dark:text-gray-400">
					My Team came joint 2nd place after we created a 2d platformer game called DragonJourney.
				</p>
			</li>
			<li class="mb-10 ms-4">
				<div
					class="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"
				></div>
				<time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500"
					>Oct 2024</time
				>
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
					2nd Place - GeeXpo Innovation Hackathon
				</h3>
				<p class="text-base font-normal text-gray-500 dark:text-gray-400">
					My Team came 2nd in the GeeXpo Innovation category for an awesome idea we had to develop a
					solution that will help Taxis drivers and commuters
				</p>
			</li>
			<li class="mb-10 ms-4">
				<div
					class="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"
				></div>
				<time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500"
					>Oct 2024</time
				>
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
					Freelancer - Thuto And Tsebo Trust
				</h3>
				<p class="text-base font-normal text-gray-500 dark:text-gray-400">
					I worked on a website that showcased their services and also allowed students to apply for
					accommodation.
				</p>
			</li>
		</ol>
	</div>
</section>
