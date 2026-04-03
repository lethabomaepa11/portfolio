<script>
	import { downloadTextFile, trackRecruiterAction } from '$lib/recruiter-tools.js';
	import Seo from '$lib/custom_components/SEO.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { fade } from 'svelte/transition';

	const packages = [
		{
			name: 'Starter Portfolio / Landing Page',
			price: 'R5,000 - R12,000',
			timeline: '1-2 weeks',
			deliverables: ['Responsive one-page site', 'Contact form', 'Basic SEO + analytics', 'Deployment']
		},
		{
			name: 'Professional SME Website',
			price: 'R20,000 - R60,000',
			timeline: '3-6 weeks',
			deliverables: [
				'6-15 pages',
				'CMS-ready structure',
				'Performance + SEO setup',
				'Lead capture and integrations'
			]
		},
		{
			name: 'Custom Platform / Web App',
			price: 'R38,000 - R88,000+',
			timeline: '6-12 weeks',
			deliverables: [
				'Product discovery + scope',
				'Auth, dashboards, and core workflows',
				'API/database integration',
				'Deployment + handover'
			]
		}
	];

	const retainers = [
		{ name: 'Care Lite', price: 'R900 / month', includes: 'Bug fixes, small updates, uptime checks' },
		{ name: 'Growth', price: 'R1,800 / month', includes: 'Lite + feature iterations and reporting' },
		{ name: 'Product Partner', price: 'R3,200 / month', includes: 'Growth + priority roadmap support' }
	];

	const downloadPricingSheet = () => {
		const lines = [
			'# Pricing Snapshot (ZAR)',
			`Generated: ${new Date().toLocaleString()}`,
			'',
			'## Project Packages',
			...packages.map((item) => `- ${item.name}: ${item.price} (${item.timeline})`),
			'',
			'## Monthly Retainers',
			...retainers.map((retainer) => `- ${retainer.name}: ${retainer.price} - ${retainer.includes}`)
		];
		const downloaded = downloadTextFile('pricing-snapshot.md', lines.join('\n'));
		trackRecruiterAction('download_pricing_snapshot', { downloaded, source: 'pricing_page' });
	};
</script>

<Seo title="Pricing" desc="South African web development pricing and project packages." />

<section class="section-wrap py-10 md:py-12" in:fade={{ duration: 220 }}>
	<div class="panel">
		<p class="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Pricing</p>
		<h1 class="mt-2 text-2xl font-bold md:text-3xl">Project investment guide (ZAR)</h1>
		<p class="mt-3 max-w-3xl text-sm text-muted-foreground">
			These ranges are set for South African clients and anchored to current local market references.
			Final pricing depends on scope, integrations, and turnaround speed.
		</p>
		<p class="mt-2 text-sm text-muted-foreground">
			Hourly benchmark used for estimation: <span class="text-foreground">R300 - R1000/hour</span>
			(local market range).
		</p>

		<div class="mt-6 grid gap-3 md:grid-cols-3">
			{#each packages as item}
				<article class="item-card">
					<p class="text-sm font-semibold">{item.name}</p>
					<p class="mt-2 text-xl font-bold text-primary">{item.price}</p>
					<p class="mt-1 text-xs text-muted-foreground">{item.timeline}</p>
					<ul class="mt-3 space-y-1 text-sm text-muted-foreground">
						{#each item.deliverables as d}
							<li>{d}</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>

		<div class="mt-8">
			<h2 class="text-lg font-semibold">Monthly retainers</h2>
			<div class="mt-3 grid gap-3 md:grid-cols-3">
				{#each retainers as r}
					<div class="item-card">
						<p class="font-semibold">{r.name}</p>
						<p class="mt-1 text-primary">{r.price}</p>
						<p class="mt-2 text-sm text-muted-foreground">{r.includes}</p>
					</div>
				{/each}
			</div>
		</div>

		<div class="mt-8 border-t border-white/10 pt-6">
			<h2 class="text-lg font-semibold">How these numbers were set</h2>
			<ul class="mt-3 space-y-2 text-sm text-muted-foreground">
				<li>
					Local market pricing references for South African websites and web apps
					(typical ranges for brochure, business, and custom builds).
				</li>
				<li>
					South African developer salary benchmarks used as a baseline for sustainable delivery rates.
				</li>
				<li>Current hosting cost references included when planning monthly support budgets.</li>
			</ul>
			<p class="mt-3 text-xs text-muted-foreground">
				Reference links:
				<a
					class="underline hover:text-primary"
					href="https://www.procompare.co.za/prices/web-design/ecommerce-website"
					target="_blank"
					rel="noreferrer"
				>
					Procompare (e-commerce)
				</a>,
				<a
					class="underline hover:text-primary"
					href="https://www.procompare.co.za/prices/web-design/custom-website"
					target="_blank"
					rel="noreferrer"
				>
					Procompare (custom)
				</a>,
				<a
					class="underline hover:text-primary"
					href="https://za.indeed.com/career/software-developer/salaries"
					target="_blank"
					rel="noreferrer"
				>
					Indeed
				</a>,
				<a
					class="underline hover:text-primary"
					href="https://www.payscale.com/research/ZA/Job=Web_Developer/Salary"
					target="_blank"
					rel="noreferrer"
				>
					PayScale
				</a>,
				<a
					class="underline hover:text-primary"
					href="https://xneelo.co.za/web-hosting/"
					target="_blank"
					rel="noreferrer"
				>
					xneelo
				</a>.
			</p>
		</div>

		<div class="mt-8 flex flex-wrap gap-3">
			<Button href="/contact" onclick={() => trackRecruiterAction('pricing_request_quote', { source: 'pricing_page' })}>
				Request Quote
			</Button>
			<Button variant="outline" href="/projects" onclick={() => trackRecruiterAction('pricing_view_work', { source: 'pricing_page' })}>
				View Work
			</Button>
			<Button variant="outline" onclick={downloadPricingSheet}>Download Pricing Snapshot</Button>
		</div>
	</div>
</section>
