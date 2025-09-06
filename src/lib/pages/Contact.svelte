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
		subject: 'Thank you for reaching out',
		error: ''
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
			form.error = '';

			if (!form.message.length) {
				form.error = '\nPlease enter your message';
			}
			if (!form.email.length) {
				form.error = '\nPlease enter your email';
			}
			if (!form.name.length) {
				form.error = '\nPlease enter your name';
			}
			if (!form.message && !form.email && !form.name) {
				form.error = '\nPlease enter your name, email and message';
			}
			statuses.error = true;
		}
		statuses.loading = false;
	};

	let formRef = $state();
	const bringFormToCenter = (e) => {
		console.log(e);
		formRef.scrollIntoView({
			behavior: 'smooth',
			block: 'center'
		});
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
				<div class=" flex flex-col gap-2 rounded-lg p-4">
					{#each contactInfo as contact}
						<h3 class="font-semibold text-gray-900 dark:text-white">{contact.title}</h3>
						<div class="flex items-center gap-2 rounded p-3">
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
					<div class="flex items-center gap-2 rounded p-3">
						<Linkedin class="h-6 w-6 text-blue-400" />
						<a
							href={pageData.info.linkedin}
							class="text-gray-600 hover:underline dark:text-gray-300">@lethabomaepa11</a
						>
					</div>
					<h3 class="font-semibold text-gray-900 dark:text-white">Github</h3>
					<div class="flex items-center gap-2 rounded p-3">
						<Github class="h-6 w-6 text-blue-400" />
						<a href={pageData.info.github} class="text-gray-600 hover:underline dark:text-gray-300"
							>@lethabomaepa11</a
						>
					</div>
				</div>
			</div>

			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<form
				bind:this={formRef}
				onclick={bringFormToCenter}
				name="contact"
				method="POST"
				onsubmit={handleSubmit}
				class="space-y-4 rounded-lg border bg-background/80 p-5 shadow-xl backdrop-blur"
			>
				{#if statuses.loading}
					<span class="flex items-center justify-between rounded p-2 text-sm text-blue-400">
						Please wait... <Loader2 class="animate-spin" />
					</span>
				{:else}
					{#if statuses.success}
						<span class="flex flex-col rounded p-2 text-sm text-green-400">
							<p class="flex items-center justify-between">
								Your message was sent successfully <CheckCheckIcon />
							</p>
							Please Check your emails for confirmation.
						</span>
					{/if}
					{#if statuses.error}
						<span class="flex items-center justify-between rounded p-2 text-sm text-red-400">
							{form.error || 'Oops...Something went wrong!, Please try again.'}
							<AlertTriangle />
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
						<Button variant="link" target="_blank" class="text-sm text-green-400">
							<AlertTriangle />
							<a href="https://www.brevo.com/en/" class="font-bold underline" target="_blank"
								>Brevo</a
							> is used to send emails from this form.</Button
						>
						<Button color="blue" type="submit" class="w-full">
							<Send class="mr-2" /> Send Message
						</Button>
					</div>
				{/if}
			</form>
		</div>
	</div>
</section>
