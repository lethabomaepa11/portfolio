<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Mail, Phone, MapPin, Send } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	const contactInfo = [
		{
			title: 'Email',
			value: 'lethabomaepa11@gmail.com',
			icon: Mail
		},
		{
			title: 'Phone',
			value: '+27 63 744 0396',
			icon: Phone
		}
	];
</script>

<section
	id="contact"
	class="bg-background py-16"
	transition:slide={{ delay: 300, duration: 500, direction: 'right' }}
>
	<div class="container mx-auto max-w-6xl px-4">
		<div class="mb-12 text-center">
			<h2 class="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Get in Touch</h2>
			<p class="mx-auto max-w-xl text-gray-600 dark:text-gray-300">
				Have a project in mind? Let's turn your ideas into reality. I'm just one message away!
			</p>
		</div>

		<div class="grid gap-12 md:grid-cols-2">
			<div class="space-y-6">
				{#each contactInfo as contact}
					<div class="flex items-center gap-4 rounded-lg bg-white p-4 dark:bg-gray-800">
						<div class="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
							<contact.icon class="h-6 w-6 text-blue-400" />
						</div>
						<div>
							<h3 class="font-semibold text-gray-900 dark:text-white">{contact.title}</h3>
							<p class="text-gray-600 dark:text-gray-300">{contact.value}</p>
						</div>
					</div>
				{/each}

				<!-- Repeat similar blocks for Phone and address -->

				<div class="h-full rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 p-0.5">
					<div class="h-full rounded-lg bg-white p-6 dark:bg-gray-900">
						<h3 class="mb-4 text-lg font-semibold">Let's Connect</h3>
						<!-- Social media links here -->
					</div>
				</div>
			</div>

			<form class="space-y-4">
				<Input label="Full Name" placeholder="John Doe" />
				<Input type="eMail" label="EMail" placeholder="john@example.com" />
				<textarea
					class="w-full rounded border bg-background p-3"
					label="Message"
					rows="5"
					placeholder="Your message..."
				></textarea>
				<Button color="blue" type="submit" class="w-full">
					<Send class="mr-2" /> Send Message
				</Button>
			</form>
		</div>
	</div>
</section>
