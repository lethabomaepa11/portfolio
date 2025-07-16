<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Loading from '$lib/custom_components/Loading.svelte';

	import {
		Mail,
		Phone,
		Linkedin,
		Github,
		Send,
		CheckCheckIcon,
		AlertTriangle,
		Loader2
	} from 'lucide-svelte';
	import { slide, fade } from 'svelte/transition';
	let { pageData } = $props();
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
	let form = $state({
		name: '',
		email: '',
		message: '',
		subject: 'Thank you for reaching out'
	});
	let statuses = $state({
		loading: false,
		success: false,
		error: false
	});
	const handleSubmit = async (e) => {
		e.preventDefault();
		statuses.loading = true;
		statuses.success = false;
		statuses.error = false;
		if (form.name && form.email && form.message) {
			let forMe = form;
			let message = form.message;
			//send email to the person who sent the message
			form.message =
				"Your message has been received: <br/><div class='message'>" + form.message + '</div>';
			form.message +=
				'<br/><br/>Thank you for reaching out, I will get back to you as soon as possible<br/><br/>Best regards,<br/>Lethabo Maepa';
			let res = await fetch('/api/contact/message', {
				method: 'POST',
				body: JSON.stringify({ data: form })
			});
			let r = await res.json();
			if (r.success) {
				//send an email to myself
				forMe.message =
					'You have a new message from ' +
					forMe.name +
					': ' +
					forMe.email +
					' with the following message: <br/><div class="message">' +
					message +
					'</div>';
				forMe.subject = 'New message from ' + forMe.name;
				forMe.name = 'Lethabo Maepa';
				forMe.email = 'lethabomaepa11@gmail.com';
				let res = await fetch('/api/contact/message', {
					method: 'POST',
					body: JSON.stringify({ data: form })
				});
				let r = await res.json();
				if (r.success) {
					form = {
						name: '',
						email: '',
						message: '',
						subject: 'Thank you for reaching out'
					};
					statuses.success = true;
				}
			}
		} else {
			statuses.error = true;
		}
		statuses.loading = false;
	};
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
				Have a project in mind? Wish to collaborate? or just leaving a message? Feel free to contact
				me.
			</p>
		</div>

		<div class="grid gap-12 md:grid-cols-2">
			<div class="space-y-6">
				<div class="flex flex-col gap-2 rounded-lg border p-4">
					{#each contactInfo as contact}
						<h3 class="font-semibold text-gray-900 dark:text-white">{contact.title}</h3>
						<div class="flex items-center gap-2 rounded bg-blue-100 p-3 dark:bg-blue-900/20">
							<contact.icon class="h-6 w-6 text-blue-400" />
							<a
								href={contact.title === 'Email'
									? `mailto:${contact.value}`
									: `tel:${contact.value}`}
								class="text-gray-600 hover:underline dark:text-gray-300">{contact.value}</a
							>
						</div>
					{/each}

					<h3 class="font-semibold text-gray-900 dark:text-white">LinkedIn</h3>
					<div class="flex items-center gap-2 rounded bg-blue-100 p-3 dark:bg-blue-900/20">
						<Linkedin class="h-6 w-6 text-blue-400" />
						<a
							href={pageData.info.linkedin}
							class="text-gray-600 hover:underline dark:text-gray-300">@lethabomaepa11</a
						>
					</div>
					<h3 class="font-semibold text-gray-900 dark:text-white">Github</h3>
					<div class="flex items-center gap-2 rounded bg-blue-100 p-3 dark:bg-blue-900/20">
						<Github class="h-6 w-6 text-blue-400" />
						<a href={pageData.info.github} class="text-gray-600 hover:underline dark:text-gray-300"
							>@lethabomaepa11</a
						>
					</div>
				</div>
			</div>

			<form
				name="contact"
				method="POST"
				onsubmit={handleSubmit}
				class="space-y-4 rounded-lg border bg-background/80 p-5 shadow-xl backdrop-blur"
			>
				{#if statuses.loading}
					<span class="flex items-center justify-between rounded bg-blue-300/50 p-2">
						Please wait... <Loader2 class="animate-spin" />
					</span>
				{:else}
					{#if statuses.success}
						<span class="flex items-center justify-between rounded bg-green-300/50 p-2">
							Your message was sent successfully <CheckCheckIcon />
						</span>
					{/if}
					{#if statuses.error}
						<span class="flex items-center justify-between rounded bg-red-300/50 p-2">
							Something went wrong! <AlertTriangle />
						</span>
					{/if}
					<div>
						<label for="name">Full Name</label>
						<Input bind:value={form.name} name="name" label="Full Name" placeholder="John Doe" />
					</div>
					<div>
						<label for="email">Email</label>
						<Input
							bind:value={form.email}
							name="email"
							type="email"
							label="EMail"
							placeholder="john@example.com"
						/>
					</div>
					<div>
						<label for="message">Message</label>
						<textarea
							bind:value={form.message}
							name="message"
							class="w-full rounded border bg-background p-3"
							label="Message"
							rows="5"
							placeholder="Your message..."
						></textarea>
						<Button color="blue" type="submit" class="w-full">
							<Send class="mr-2" /> Send Message
						</Button>
					</div>
				{/if}
			</form>
		</div>
	</div>
</section>
