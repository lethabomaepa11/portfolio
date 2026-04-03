<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { trackRecruiterAction } from '$lib/recruiter-tools.js';
	import {
		AlertTriangle,
		CheckCheckIcon,
		Github,
		Linkedin,
		Loader2,
		Mail,
		Phone,
		Send
	} from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	let { pageData } = $props();

	const contactInfo = $derived([
		{ title: 'Email', value: pageData.info.email, icon: Mail },
		{ title: 'Phone', value: pageData.info.phone, icon: Phone }
	]);

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

	const validateForm = () => {
		const errors = [];
		if (!form.name.trim()) errors.push('Please enter your name');
		if (!form.email.trim()) errors.push('Please enter your email');
		if (!form.message.trim()) errors.push('Please enter your message');
		return errors;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		statuses.loading = true;
		statuses.success = false;
		statuses.error = false;
		form.error = '';

		const errors = validateForm();
		if (errors.length) {
			form.error = errors.join('\n');
			statuses.error = true;
			statuses.loading = false;
			trackRecruiterAction('contact_form_validation_error', { source: 'contact_section' });
			return;
		}

		const originalMessage = form.message;
		const visitorPayload = {
			...form,
			message:
				"Your message has been received: <br/><div class='message'>" +
				originalMessage +
				'</div><br/><br/>Thank you for reaching out, I will get back to you as soon as possible.<br/><br/>Best regards,<br/>Lethabo Maepa'
		};

		const visitorResponse = await fetch('/api/contact/message', {
			method: 'POST',
			body: JSON.stringify({ data: visitorPayload })
		});
		const visitorResult = await visitorResponse.json();

		if (!visitorResult.success) {
			statuses.error = true;
			statuses.loading = false;
			trackRecruiterAction('contact_form_send_error', { stage: 'visitor', source: 'contact_section' });
			return;
		}

		const ownerPayload = {
			name: 'Lethabo Maepa',
			email: 'lethabomaepa11@gmail.com',
			subject: `New message from ${form.name}`,
			message:
				`You have a new message from ${form.name}: ${form.email}.<br/>` +
				`<div class="message">${originalMessage}</div>`
		};

		const ownerResponse = await fetch('/api/contact/message', {
			method: 'POST',
			body: JSON.stringify({ data: ownerPayload })
		});
		const ownerResult = await ownerResponse.json();

		if (ownerResult.success) {
			form = {
				name: '',
				email: '',
				message: '',
				subject: 'Thank you for reaching out',
				error: ''
			};
			statuses.success = true;
			trackRecruiterAction('contact_form_submit_success', { source: 'contact_section' });
		} else {
			statuses.error = true;
			trackRecruiterAction('contact_form_send_error', { stage: 'owner', source: 'contact_section' });
		}

		statuses.loading = false;
	};
</script>

<section id="contact" class="section-wrap border-t border-white/10 py-10 md:py-12" in:fade={{ duration: 220 }}>
	<div class="panel">
		<p class="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Contact</p>
		<h2 class="mt-2 text-2xl font-bold md:text-3xl">Let's work together</h2>
	<p class="mt-3 max-w-2xl text-sm text-muted-foreground">
		Have a project in mind or want to collaborate? Send a message and I will get back to you.
	</p>
	<p class="mt-2 text-sm text-primary">
		Hiring for a software developer role or contract collaboration? Email is the fastest way to reach me.
	</p>

		<div class="mt-6 grid gap-8 md:grid-cols-2">
			<div class="space-y-3">
				{#each contactInfo as contact}
					<div class="item-card">
						<p class="text-xs uppercase tracking-[0.14em] text-muted-foreground">{contact.title}</p>
						<div class="mt-2 flex items-center gap-2 text-sm">
							<contact.icon class="h-4 w-4 text-primary" />
							<a
								href={contact.title === 'Email' ? `mailto:${contact.value}` : `tel:${contact.value}`}
								onclick={() => trackRecruiterAction('contact_info_click', { type: contact.title.toLowerCase(), source: 'contact_section' })}
							>
								{contact.value}
							</a>
						</div>
					</div>
				{/each}

				<div class="item-card">
					<p class="text-xs uppercase tracking-[0.14em] text-muted-foreground">Social</p>
					<div class="mt-2 flex flex-wrap gap-4 text-sm">
						<a
							href={pageData.info.linkedin}
							target="_blank"
							rel="noreferrer"
							class="inline-flex items-center gap-2 hover:text-primary"
							onclick={() => trackRecruiterAction('contact_social_linkedin', { source: 'contact_section' })}
						>
							<Linkedin class="h-4 w-4 text-primary" />
							LinkedIn
						</a>
						<a
							href={pageData.info.github}
							target="_blank"
							rel="noreferrer"
							class="inline-flex items-center gap-2 hover:text-primary"
							onclick={() => trackRecruiterAction('contact_social_github', { source: 'contact_section' })}
						>
							<Github class="h-4 w-4 text-primary" />
							GitHub
						</a>
					</div>
				</div>
			</div>

			<form onsubmit={handleSubmit} class="item-card space-y-4">
			{#if statuses.loading}
				<div class="flex items-center justify-between rounded bg-primary/10 px-3 py-2 text-sm text-primary">
					Sending message...
					<Loader2 class="h-4 w-4 animate-spin" />
				</div>
			{/if}

			{#if statuses.success}
				<div class="flex items-center gap-2 rounded bg-green-500/15 px-3 py-2 text-sm text-green-300">
					<CheckCheckIcon class="h-4 w-4" />
					Message sent successfully.
				</div>
			{/if}

			{#if statuses.error}
				<div class="rounded bg-red-500/15 px-3 py-2 text-sm text-red-300">
					<div class="flex items-center gap-2">
						<AlertTriangle class="h-4 w-4" />
						<span>{form.error || 'Something went wrong. Please try again.'}</span>
					</div>
				</div>
			{/if}

			<div>
				<label for="name" class="mb-1 block text-sm">Full Name</label>
				<Input id="name" bind:value={form.name} name="name" placeholder="John Doe" />
			</div>
			<div>
				<label for="email" class="mb-1 block text-sm">Email</label>
				<Input id="email" bind:value={form.email} name="email" type="email" placeholder="john@example.com" />
			</div>
			<div>
				<label for="message" class="mb-1 block text-sm">Message</label>
				<textarea
					id="message"
					bind:value={form.message}
					name="message"
					rows="5"
					placeholder="Tell me about your project..."
					class="w-full rounded-md border border-white/10 bg-background p-3 text-sm"
				></textarea>
			</div>
			<Button type="submit" class="w-full">
				<Send class="h-4 w-4" />
				Send Message
			</Button>
			</form>
		</div>
	</div>
</section>
