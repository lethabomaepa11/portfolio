<script>
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
	import Seo from '$lib/custom_components/SEO.svelte';
	import { trackRecruiterAction } from '$lib/recruiter-tools.js';
	import { Check, Loader2 } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let roleInput = $state('');
	let projectDescriptionInput = $state('');
	let currentRole = $state('');
	let generating = $state(false);
	let errorMessage = $state('');
	let modelUsed = $state('');
	let usedFallback = $state(false);
	let generated = $state(null);
	let generationPhase = $state('idle');
	let generationSteps = $state([]);
	let phaseTimer = 0;
	const phaseBlueprint = [
		{ id: 'thinking', label: 'Thinking through role requirements' },
		{ id: 'collecting', label: 'Collecting portfolio evidence' },
		{ id: 'comparing', label: 'Comparing role to projects and skills' },
		{ id: 'drafting', label: 'Drafting recruiter report sections' },
		{ id: 'finalizing', label: 'Finalizing AI-generated portfolio' }
	];

	const normalizeRole = (value) => value?.trim().replace(/\s+/g, ' ').slice(0, 100);
	const normalizeProjectDescription = (value) => value?.trim().replace(/\s+/g, ' ').slice(0, 1200);

	const startPhaseTracking = () => {
		generationPhase = 'generating';
		generationSteps = phaseBlueprint.map((step, index) => ({
			...step,
			status: index === 0 ? 'active' : 'pending'
		}));
		let stepIndex = 0;
		clearInterval(phaseTimer);
		phaseTimer = setInterval(() => {
			stepIndex += 1;
			generationSteps = generationSteps.map((step, index) => {
				if (index < stepIndex) return { ...step, status: 'complete' };
				if (index === stepIndex) return { ...step, status: 'active' };
				return { ...step, status: 'pending' };
			});
			if (stepIndex >= generationSteps.length - 1) {
				clearInterval(phaseTimer);
			}
		}, 760);
	};

	const finishPhaseTracking = (failed = false) => {
		clearInterval(phaseTimer);
		generationSteps = generationSteps.map((step) => ({
			...step,
			status: failed ? (step.status === 'complete' ? 'complete' : 'pending') : 'complete'
		}));
		generationPhase = failed ? 'error' : 'complete';
	};

	const escapePdfText = (value) => String(value || '').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

	const buildPdfBytes = (lines) => {
		const pageHeight = 842;
		const startY = 800;
		const lineHeight = 14;
		const linesPerPage = 50;

		const pagedLines = [];
		for (let i = 0; i < lines.length; i += linesPerPage) {
			pagedLines.push(lines.slice(i, i + linesPerPage));
		}
		if (!pagedLines.length) pagedLines.push(['AI Portfolio Report']);

		const objectMap = new Map();
		const pageObjectIds = [];
		let nextObjectId = 4;

		for (const pageLines of pagedLines) {
			const textOps = ['BT', '/F1 10 Tf', `50 ${startY} Td`];
			for (let index = 0; index < pageLines.length; index += 1) {
				const safeLine = escapePdfText(pageLines[index]);
				if (index !== 0) textOps.push(`0 -${lineHeight} Td`);
				textOps.push(`(${safeLine}) Tj`);
			}
			textOps.push('ET');
			const stream = textOps.join('\n');
			const contentObject = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
			const contentId = nextObjectId;
			nextObjectId += 1;
			const pageId = nextObjectId;
			nextObjectId += 1;
			pageObjectIds.push(pageId);
			objectMap.set(contentId, contentObject);
			objectMap.set(
				pageId,
				`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 ${pageHeight}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >>`
			);
		}

		const pagesKids = pageObjectIds.map((id) => `${id} 0 R`).join(' ');
		objectMap.set(1, '<< /Type /Catalog /Pages 2 0 R >>');
		objectMap.set(2, `<< /Type /Pages /Kids [${pagesKids}] /Count ${pageObjectIds.length} >>`);
		objectMap.set(3, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
		const maxId = nextObjectId - 1;

		let output = '%PDF-1.4\n';
		const xref = [0];
		for (let i = 1; i <= maxId; i += 1) {
			const content = objectMap.get(i) || '';
			xref.push(output.length);
			output += `${i} 0 obj\n${content}\nendobj\n`;
		}

		const xrefStart = output.length;
		output += `xref\n0 ${maxId + 1}\n`;
		output += '0000000000 65535 f \n';
		for (let i = 1; i < xref.length; i += 1) {
			output += `${String(xref[i]).padStart(10, '0')} 00000 n \n`;
		}
		output += `trailer\n<< /Size ${maxId + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

		return new TextEncoder().encode(output);
	};

	const exportGeneratedPdfReport = () => {
		if (!generated) return;
		const lines = [
			`AI Role Portfolio Report`,
			`Role: ${currentRole}`,
			`Model: ${modelUsed || 'unknown'}${usedFallback ? ' (fallback)' : ''}`,
			'',
			`Hero: ${generated.hero?.title || ''}`,
			`${generated.hero?.subtitle || ''}`,
			`${generated.hero?.summary || ''}`,
			'',
			`Fit Verdict: ${generated.fit?.verdict || ''}`,
			'Top Reasons:'
		];
		for (const reason of generated.fit?.top_reasons ?? []) lines.push(`- ${reason}`);
		lines.push('', 'Risks:');
		for (const risk of generated.fit?.risks ?? []) lines.push(`- ${risk}`);
		lines.push('', 'Projects:');
		for (const project of generated.projects ?? []) {
			lines.push(
				`- ${project.title}`,
				`  Why fit: ${project.why_fit}`,
				`  Evidence: ${project.evidence}`,
				`  Focus: ${project.focus}`,
				`  Outcome: ${project.outcome}`
			);
		}
		const safeRole = currentRole.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
		const filename = `ai-portfolio-report-${safeRole || 'role'}.pdf`;
		let exported = false;
		try {
			const bytes = buildPdfBytes(lines);
			const blob = new Blob([bytes], { type: 'application/pdf' });
			const href = URL.createObjectURL(blob);
			const anchor = document.createElement('a');
			anchor.href = href;
			anchor.download = filename;
			document.body.appendChild(anchor);
			anchor.click();
			anchor.remove();
			URL.revokeObjectURL(href);
			exported = true;
		} catch {
			exported = false;
		}
		trackRecruiterAction('export_ai_portfolio_report', { exported, role: currentRole });
	};

	const generatePortfolio = async (role, source = 'manual') => {
		const normalizedRole = normalizeRole(role);
		if (!normalizedRole) {
			errorMessage = 'Enter a job role to generate the portfolio.';
			return;
		}
		const normalizedProjectDescription = normalizeProjectDescription(projectDescriptionInput);

		currentRole = normalizedRole;
		roleInput = normalizedRole;
		generating = true;
		errorMessage = '';
		startPhaseTracking();
		try {
			const response = await fetch('/api/ai/portfolio-page', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					role: normalizedRole,
					projectDescription: normalizedProjectDescription
				})
			});
			const payload = await response.json();

			if (!payload?.success || !payload?.generated) {
				errorMessage = payload?.error || 'Unable to generate AI portfolio.';
				finishPhaseTracking(true);
				return;
			}

			generated = payload.generated;
			modelUsed = payload.model || '';
			usedFallback = Boolean(payload.fallback);
			finishPhaseTracking(false);
			trackRecruiterAction('ai_portfolio_generated', {
				role: normalizedRole,
				source,
				fallback: usedFallback,
				hasProjectDescription: Boolean(normalizedProjectDescription)
			});
		} catch {
			errorMessage = 'Unable to generate AI portfolio right now.';
			finishPhaseTracking(true);
		} finally {
			generating = false;
		}
	};

	onMount(() => {
		if (!browser) return;
		const roleFromQuery = normalizeRole($page.url.searchParams.get('role') || '');
		const projectDescriptionFromQuery = normalizeProjectDescription(
			$page.url.searchParams.get('project_description') || ''
		);
		if (projectDescriptionFromQuery) {
			projectDescriptionInput = projectDescriptionFromQuery;
		}
		if (roleFromQuery) {
			generatePortfolio(roleFromQuery, 'query');
		}
		return () => clearInterval(phaseTimer);
	});
</script>

<Seo
	title="AI Generated Portfolio"
	desc="Experimental AI-generated recruiter view tailored to a specific job role."
/>

<section class="section-wrap py-10 md:py-12" in:fade={{ duration: 220 }}>
	<div class="panel">
		<p class="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Experimental</p>
		<h1 class="mt-2 text-2xl font-bold md:text-3xl">AI Generated Portfolio</h1>
		<p class="mt-3 text-sm text-muted-foreground">
			Enter a role title to generate a recruiter-focused portfolio page tailored to that role.
		</p>

		<form
			class="mt-4 flex flex-wrap items-center gap-2"
			onsubmit={(event) => {
				event.preventDefault();
				generatePortfolio(roleInput, 'form');
			}}
		>
			<input
				class="min-w-[260px] flex-1 rounded-md border border-white/10 bg-background px-3 py-2 text-sm"
				placeholder="e.g., Senior Full-Stack Engineer"
				bind:value={roleInput}
			/>
			<Button type="submit" disabled={generating}>
				{#if generating}
					<Loader2 class="h-4 w-4 animate-spin" />
				{/if}
				Generate
			</Button>
		</form>
		<details class="mt-3 rounded-md border border-white/10 bg-background/60 p-2">
			<summary class="cursor-pointer text-sm font-medium">Project description (optional)</summary>
			<div class="mt-2">
				<textarea
					id="project-description"
					rows="4"
					bind:value={projectDescriptionInput}
					class="w-full rounded-md border border-white/10 bg-background px-3 py-2 text-sm"
					placeholder="Paste role context or project brief to steer the AI-generated portfolio."
				></textarea>
			</div>
		</details>

		{#if errorMessage}
			<p class="mt-3 text-sm text-red-400">{errorMessage}</p>
		{/if}

		{#if currentRole}
			<p class="mt-2 text-xs text-muted-foreground">
				Role: <span class="text-foreground">{currentRole}</span>
			</p>
		{/if}

		{#if modelUsed}
			<p class="mt-1 text-xs text-muted-foreground">
				Model: {modelUsed}{usedFallback ? ' (fallback content used)' : ''}
			</p>
		{/if}
		{#if generating || generationPhase === 'complete'}
			<div class="mt-4 rounded-lg border border-white/10 bg-background/70 p-3">
				<p class="text-xs font-semibold uppercase tracking-[0.1em] text-primary">Generation state</p>
				<div class="mt-2 space-y-1.5">
					{#each generationSteps as step (step.id)}
						<div class="flex items-center gap-2 text-sm">
							{#if step.status === 'complete'}
								<Check size={14} class="text-primary" />
							{:else if step.status === 'active'}
								<Loader2 size={14} class="animate-spin text-primary" />
							{:else}
								<div class="h-2.5 w-2.5 rounded-full border border-white/20"></div>
							{/if}
							<span class={step.status === 'active' ? 'text-foreground' : 'text-muted-foreground'}>
								{step.label}
							</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	{#if generated}
		<div class="mt-6 grid gap-4">
			<section class="panel">
				<div class="flex flex-wrap items-center justify-between gap-2">
					<div>
						<p class="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Export</p>
						<p class="text-sm text-muted-foreground">Share this AI-generated recruiter report quickly.</p>
					</div>
					<div class="flex flex-wrap gap-2">
						<Button variant="outline" onclick={exportGeneratedPdfReport}>Download PDF Report</Button>
					</div>
				</div>
			</section>

			<section class="panel">
				<h2 class="text-xl font-semibold">{generated.hero?.title}</h2>
				<p class="mt-2 text-sm text-primary">{generated.hero?.subtitle}</p>
				<p class="mt-3 text-sm text-muted-foreground">{generated.hero?.summary}</p>
			</section>

			<section class="panel">
				<p class="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Role Fit</p>
				<p class="mt-2 text-sm text-foreground">{generated.fit?.verdict}</p>
				<div class="mt-3 grid gap-3 md:grid-cols-2">
					<div>
						<p class="text-sm font-semibold">Top reasons</p>
						<ul class="mt-2 space-y-1 text-sm text-muted-foreground">
							{#each generated.fit?.top_reasons ?? [] as reason}
								<li>{reason}</li>
							{/each}
						</ul>
					</div>
					<div>
						<p class="text-sm font-semibold">Risks to validate</p>
						<ul class="mt-2 space-y-1 text-sm text-muted-foreground">
							{#each generated.fit?.risks ?? [] as risk}
								<li>{risk}</li>
							{/each}
						</ul>
					</div>
				</div>
			</section>

			<section class="panel">
				<p class="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Project Evidence</p>
				<div class="mt-4 space-y-3">
					{#each generated.projects ?? [] as project}
						<article class="item-card">
							<div class="flex flex-wrap items-center justify-between gap-2">
								<h3 class="text-base font-semibold">{project.title}</h3>
								{#if project.slug}
									<Button href={`/projects/${project.slug}`} variant="outline" size="sm">
										Open Case Study
									</Button>
								{/if}
							</div>
							<p class="mt-2 text-sm text-muted-foreground">
								<span class="font-semibold text-foreground">Why fit:</span> {project.why_fit}
							</p>
							<p class="mt-1 text-sm text-muted-foreground">
								<span class="font-semibold text-foreground">Evidence:</span> {project.evidence}
							</p>
							<p class="mt-1 text-sm text-muted-foreground">
								<span class="font-semibold text-foreground">Focus:</span> {project.focus}
							</p>
							<p class="mt-1 text-sm text-muted-foreground">
								<span class="font-semibold text-foreground">Outcome:</span> {project.outcome}
							</p>
						</article>
					{/each}
				</div>
			</section>

			<section class="panel">
				<p class="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Skills Match</p>
				<div class="mt-4 grid gap-3 md:grid-cols-2">
					{#each generated.skills ?? [] as skill}
						<article class="item-card">
							<p class="font-semibold">{skill.name}</p>
							<p class="mt-1 text-sm text-muted-foreground">{skill.relevance}</p>
							<p class="mt-1 text-xs text-muted-foreground">{skill.proof}</p>
						</article>
					{/each}
				</div>
			</section>

			<section class="panel">
				<p class="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Interview Kit</p>
				<div class="mt-3 grid gap-4 md:grid-cols-2">
					<div>
						<p class="text-sm font-semibold">Suggested questions</p>
						<ol class="mt-2 space-y-1 text-sm text-muted-foreground">
							{#each generated.interview?.questions ?? [] as question}
								<li>{question}</li>
							{/each}
						</ol>
					</div>
					<div class="item-card">
						<p class="text-xs uppercase tracking-[0.12em] text-muted-foreground">Email draft</p>
						<p class="mt-2 text-sm">
							<span class="font-semibold">Subject:</span> {generated.interview?.email_subject}
						</p>
						<p class="mt-2 text-sm text-muted-foreground">{generated.interview?.email_body}</p>
					</div>
				</div>
				<div class="mt-4 flex flex-wrap gap-2">
					{#if generated.cta?.primary_href}
						<Button href={generated.cta.primary_href} target="_blank" rel="noreferrer">
							{generated.cta?.primary_label || 'Primary CTA'}
						</Button>
					{/if}
					{#if generated.cta?.secondary_href}
						<Button href={generated.cta.secondary_href} variant="outline">
							{generated.cta?.secondary_label || 'Secondary CTA'}
						</Button>
					{/if}
				</div>
			</section>
		</div>
	{/if}
</section>
