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
	let warningModalOpen = $state(false);
	let warningInfo = $state({
		title: '',
		message: '',
		detail: ''
	});
	let generationPhase = $state('idle');
	let generationSteps = $state([]);
	let phaseTimer = 0;

	const phaseBlueprint = [
		{ id: 'thinking', label: 'Thinking through role requirements' },
		{ id: 'collecting', label: 'Collecting portfolio evidence' },
		{ id: 'comparing', label: 'Comparing role to projects and skills' },
		{ id: 'drafting', label: 'Drafting role-focused page structure' },
		{ id: 'finalizing', label: 'Finalizing AI-generated portfolio page' }
	];

	const sectionSurfaceClassMap = {
		panel: 'panel',
		muted: 'rounded-2xl border border-white/10 bg-muted/35 p-5 md:p-6',
		contrast: 'rounded-2xl border border-primary/35 bg-primary/10 p-5 md:p-6',
		outline: 'rounded-2xl border border-dashed border-primary/45 bg-background p-5 md:p-6'
	};
	const sectionLayoutClassMap = {
		stack: 'space-y-3',
		split: 'grid gap-3 md:grid-cols-2',
		grid2: 'grid gap-3 md:grid-cols-2',
		grid3: 'grid gap-3 md:grid-cols-3'
	};
	const accentTextClassMap = {
		primary: 'text-primary',
		emerald: 'text-emerald-400',
		amber: 'text-amber-400',
		cyan: 'text-cyan-400',
		rose: 'text-rose-400'
	};
	const accentBadgeClassMap = {
		primary: 'border-primary/35 bg-primary/10 text-primary',
		emerald: 'border-emerald-400/35 bg-emerald-500/10 text-emerald-300',
		amber: 'border-amber-400/35 bg-amber-500/10 text-amber-300',
		cyan: 'border-cyan-400/35 bg-cyan-500/10 text-cyan-300',
		rose: 'border-rose-400/35 bg-rose-500/10 text-rose-300'
	};
	const accentCardClassMap = {
		primary: 'border-primary/20',
		emerald: 'border-emerald-400/20',
		amber: 'border-amber-400/20',
		cyan: 'border-cyan-400/20',
		rose: 'border-rose-400/20'
	};
	const verdictToneClassMap = {
		strong_yes: 'border-emerald-400/35 bg-emerald-500/12 text-emerald-300',
		yes: 'border-cyan-400/35 bg-cyan-500/12 text-cyan-300',
		consider: 'border-amber-400/35 bg-amber-500/12 text-amber-300',
		risky: 'border-rose-400/35 bg-rose-500/12 text-rose-300'
	};
	const verdictLabelMap = {
		strong_yes: 'Strong Yes',
		yes: 'Yes',
		consider: 'Consider',
		risky: 'Risky'
	};

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

	const getSectionClass = (section) => sectionSurfaceClassMap[section?.style?.surface] ?? sectionSurfaceClassMap.panel;
	const getSectionLayoutClass = (section) =>
		sectionLayoutClassMap[section?.style?.layout] ?? sectionLayoutClassMap.stack;
	const getAccentTextClass = (accent) => accentTextClassMap[accent] ?? accentTextClassMap.primary;
	const getAccentBadgeClass = (accent) => accentBadgeClassMap[accent] ?? accentBadgeClassMap.primary;
	const getAccentCardClass = (accent) => accentCardClassMap[accent] ?? accentCardClassMap.primary;
	const getVerdictToneClass = (verdict) =>
		verdictToneClassMap[verdict?.recommendation] ?? verdictToneClassMap.consider;
	const getVerdictLabel = (verdict) => verdictLabelMap[verdict?.recommendation] ?? 'Consider';
	const getConfidenceLabel = (verdict) => {
		const token = String(verdict?.confidence || '').toLowerCase();
		if (token === 'high') return 'High confidence';
		if (token === 'low') return 'Low confidence';
		return 'Medium confidence';
	};
	const getHeroClass = (generatedPage) =>
		generatedPage?.theme?.hero_style === 'minimal'
			? 'panel'
			: 'panel bg-gradient-to-br from-primary/15 via-background to-background';
	const isExternalHref = (href = '') => /^https?:\/\//i.test(href) || /^mailto:/i.test(href);
	const closeWarningModal = () => {
		warningModalOpen = false;
		warningInfo = { title: '', message: '', detail: '' };
	};

	const toAbsoluteLink = (href) => {
		if (!href || !browser) return '';
		try {
			return new URL(href, window.location.origin).toString();
		} catch {
			return '';
		}
	};

	const normalizePdfText = (value) =>
		String(value || '')
			.replace(/[\r\n\t]+/g, ' ')
			.replace(/\s+/g, ' ')
			.replace(/[^\x20-\x7E]/g, '?')
			.trim();

	const escapePdfText = (value) => normalizePdfText(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
	const estimatePdfTextWidth = (text, fontSize) => normalizePdfText(text).length * fontSize * 0.53;

	const wrapPdfText = (text, fontSize, maxWidth) => {
		const clean = normalizePdfText(text);
		if (!clean) return [];
		const words = clean.split(' ');
		const lines = [];
		let current = '';

		for (const word of words) {
			const candidate = current ? `${current} ${word}` : word;
			if (estimatePdfTextWidth(candidate, fontSize) <= maxWidth) {
				current = candidate;
				continue;
			}
			if (current) lines.push(current);
			if (estimatePdfTextWidth(word, fontSize) <= maxWidth) {
				current = word;
				continue;
			}
			let fragment = '';
			for (const char of word) {
				const chunk = `${fragment}${char}`;
				if (estimatePdfTextWidth(chunk, fontSize) <= maxWidth) {
					fragment = chunk;
				} else {
					if (fragment) lines.push(fragment);
					fragment = char;
				}
			}
			current = fragment;
		}

		if (current) lines.push(current);
		return lines;
	};

	const collectReportLinks = () => {
		if (!generated) return [];
		const merged = [];
		const seen = new Set();
		const pushLink = (label, href, description = '') => {
			const absolute = toAbsoluteLink(href);
			if (!absolute || seen.has(absolute)) return;
			seen.add(absolute);
			merged.push({
				label: String(label || 'Link').trim().slice(0, 90),
				href: absolute,
				description: String(description || '').trim().slice(0, 160)
			});
		};

		for (const link of generated.report?.links ?? []) {
			pushLink(link?.label, link?.href, link?.description);
		}

		for (const section of generated.sections ?? []) {
			for (const block of section.blocks ?? []) {
				if (block.type === 'cards') {
					for (const item of block.items ?? []) {
						pushLink(item?.title || section.title, item?.href, item?.meta || item?.text);
					}
				}
				if (block.type === 'links') {
					for (const item of block.items ?? []) {
						pushLink(item?.label, item?.href, item?.description);
					}
				}
				if (block.type === 'cta') {
					pushLink(block.primary_label, block.primary_href, section.title);
					pushLink(block.secondary_label, block.secondary_href, section.title);
				}
			}
		}

		return merged.slice(0, 20);
	};

	const buildReportLines = () => {
		if (!generated) return [];

		const lines = [];
		const reportTitle = generated.report?.title || 'AI Portfolio Report';
		const roleLabel = generated.meta?.role || currentRole || roleInput;
		const modelLabel = `${modelUsed || 'unknown'}${usedFallback ? ' (fallback)' : ''}`;
		const reportLinks = collectReportLinks();

		lines.push({ text: reportTitle, size: 18, spacerAfter: 8 });
		lines.push({ text: `Role: ${roleLabel}`, size: 11 });
		lines.push({ text: `Model: ${modelLabel}`, size: 10, spacerAfter: 8 });
		if (generated.verdict?.summary) {
			lines.push({ text: `Verdict: ${generated.verdict.summary}`, size: 10, spacerAfter: 2 });
			lines.push({
				text: `Recommendation: ${getVerdictLabel(generated.verdict)} | ${getConfidenceLabel(generated.verdict)}`,
				size: 10,
				spacerAfter: 6
			});
		}
		if (generated.verdict?.reasons?.length) {
			lines.push({ text: 'Verdict reasons', size: 13, spacerBefore: 4, spacerAfter: 3 });
			for (const reason of generated.verdict.reasons) {
				lines.push({ text: `- ${reason}`, size: 10 });
			}
		}
		if (generated.verdict?.concerns?.length) {
			lines.push({ text: 'Verdict concerns', size: 13, spacerBefore: 4, spacerAfter: 3 });
			for (const concern of generated.verdict.concerns) {
				lines.push({ text: `- ${concern}`, size: 10 });
			}
		}
		if (generated.report?.intro) {
			lines.push({ text: generated.report.intro, size: 10, spacerAfter: 8 });
		}

		if (generated.report?.highlights?.length) {
			lines.push({ text: 'Highlights', size: 13, spacerBefore: 6, spacerAfter: 4 });
			for (const highlight of generated.report.highlights) {
				lines.push({ text: `- ${highlight}`, size: 10 });
			}
		}

		for (const section of generated.sections ?? []) {
			lines.push({ text: section.title, size: 13, spacerBefore: 8, spacerAfter: 3 });
			if (section.kicker) {
				lines.push({ text: section.kicker, size: 9, spacerAfter: 2 });
			}
			for (const block of section.blocks ?? []) {
				if (block.type === 'paragraph') {
					lines.push({ text: block.text, size: 10, spacerAfter: 2 });
				}
				if (block.type === 'bullets') {
					for (const item of block.items ?? []) {
						lines.push({ text: `- ${item}`, size: 10 });
					}
				}
				if (block.type === 'metrics') {
					for (const item of block.items ?? []) {
						const detail = item.detail ? ` (${item.detail})` : '';
						lines.push({ text: `${item.label}: ${item.value}${detail}`, size: 10 });
					}
				}
				if (block.type === 'cards') {
					for (const item of block.items ?? []) {
						if (item.title) lines.push({ text: item.title, size: 11, spacerBefore: 2 });
						if (item.text) lines.push({ text: item.text, size: 10 });
						if (item.meta) lines.push({ text: `Evidence: ${item.meta}`, size: 9 });
						if (item.href) {
							lines.push({
								text: `Open link: ${item.href}`,
								size: 9,
								link: toAbsoluteLink(item.href)
							});
						}
					}
				}
				if (block.type === 'links') {
					for (const item of block.items ?? []) {
						lines.push({
							text: `${item.label}: ${item.href}`,
							size: 9,
							link: toAbsoluteLink(item.href)
						});
					}
				}
				if (block.type === 'qa') {
					for (const item of block.items ?? []) {
						lines.push({ text: `Q: ${item.question}`, size: 10, spacerBefore: 1 });
						lines.push({ text: `A: ${item.answer}`, size: 10 });
					}
				}
				if (block.type === 'cta') {
					if (block.primary_label && block.primary_href) {
						lines.push({
							text: `${block.primary_label}: ${block.primary_href}`,
							size: 9,
							link: toAbsoluteLink(block.primary_href)
						});
					}
					if (block.secondary_label && block.secondary_href) {
						lines.push({
							text: `${block.secondary_label}: ${block.secondary_href}`,
							size: 9,
							link: toAbsoluteLink(block.secondary_href)
						});
					}
				}
			}
		}

		if (reportLinks.length) {
			lines.push({ text: 'Quick Links', size: 13, spacerBefore: 10, spacerAfter: 3 });
			for (const link of reportLinks) {
				const suffix = link.description ? ` (${link.description})` : '';
				lines.push({
					text: `${link.label}: ${link.href}${suffix}`,
					size: 9,
					link: link.href
				});
			}
		}

		return lines;
	};

	const buildPdfBytes = (lineItems) => {
		const pageWidth = 595;
		const pageHeight = 842;
		const marginX = 48;
		const marginTop = 56;
		const marginBottom = 52;
		const maxTextWidth = pageWidth - marginX * 2;
		const lineGap = 4;

		const newPage = () => ({ textOps: [], annots: [] });
		const pages = [newPage()];
		let currentPage = pages[0];
		let y = pageHeight - marginTop;

		const ensureSpace = (height) => {
			if (y - height < marginBottom) {
				currentPage = newPage();
				pages.push(currentPage);
				y = pageHeight - marginTop;
			}
		};

		const addTextLine = (text, size = 10, link = '') => {
			const wrapped = wrapPdfText(text, size, maxTextWidth);
			for (let index = 0; index < wrapped.length; index += 1) {
				ensureSpace(size + lineGap);
				y -= size + lineGap;
				const line = wrapped[index];
				currentPage.textOps.push(
					`BT /F1 ${size} Tf ${marginX.toFixed(2)} ${y.toFixed(2)} Td (${escapePdfText(line)}) Tj ET`
				);

				if (link && index === 0) {
					const width = Math.max(36, Math.min(maxTextWidth, estimatePdfTextWidth(line, size)));
					currentPage.annots.push({
						x1: marginX,
						y1: y - 1,
						x2: marginX + width,
						y2: y + size + 2,
						uri: link
					});
				}
			}
		};

		for (const item of lineItems) {
			if (item.spacerBefore) {
				ensureSpace(item.spacerBefore);
				y -= item.spacerBefore;
			}
			addTextLine(item.text, item.size ?? 10, item.link || '');
			if (item.spacerAfter) {
				ensureSpace(item.spacerAfter);
				y -= item.spacerAfter;
			}
		}

		if (!pages.some((entry) => entry.textOps.length)) {
			pages[0].textOps.push('BT /F1 12 Tf 48 780 Td (AI Portfolio Report) Tj ET');
		}

		const objectMap = new Map();
		const pageObjectIds = [];
		let nextObjectId = 4;

		for (const pageEntry of pages) {
			const stream = pageEntry.textOps.join('\n');
			const contentId = nextObjectId;
			nextObjectId += 1;
			objectMap.set(contentId, `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);

			const annotIds = [];
			for (const annot of pageEntry.annots) {
				const annotId = nextObjectId;
				nextObjectId += 1;
				annotIds.push(annotId);
				objectMap.set(
					annotId,
					`<< /Type /Annot /Subtype /Link /Rect [${annot.x1.toFixed(2)} ${annot.y1.toFixed(2)} ${annot.x2.toFixed(2)} ${annot.y2.toFixed(2)}] /Border [0 0 0] /A << /S /URI /URI (${escapePdfText(annot.uri)}) >> >>`
				);
			}

			const pageId = nextObjectId;
			nextObjectId += 1;
			const annots = annotIds.length ? `/Annots [${annotIds.map((id) => `${id} 0 R`).join(' ')}]` : '';
			objectMap.set(
				pageId,
				`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R ${annots} >>`
			);
			pageObjectIds.push(pageId);
		}

		objectMap.set(1, '<< /Type /Catalog /Pages 2 0 R >>');
		objectMap.set(
			2,
			`<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageObjectIds.length} >>`
		);
		objectMap.set(3, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');

		const maxId = nextObjectId - 1;
		let output = '%PDF-1.4\n';
		const xref = [0];
		for (let id = 1; id <= maxId; id += 1) {
			const content = objectMap.get(id) || '';
			xref.push(output.length);
			output += `${id} 0 obj\n${content}\nendobj\n`;
		}

		const xrefStart = output.length;
		output += `xref\n0 ${maxId + 1}\n`;
		output += '0000000000 65535 f \n';
		for (let id = 1; id < xref.length; id += 1) {
			output += `${String(xref[id]).padStart(10, '0')} 00000 n \n`;
		}
		output += `trailer\n<< /Size ${maxId + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

		return new TextEncoder().encode(output);
	};

	const exportGeneratedPdfReport = () => {
		if (!generated || !browser) return;
		const lines = buildReportLines();
		const safeRole = (generated.meta?.role || currentRole || roleInput || 'role')
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');
		const filename = `ai-portfolio-report-${safeRole || 'role'}.pdf`;
		const linkCount = collectReportLinks().length;
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

		trackRecruiterAction('export_ai_portfolio_report', {
			exported,
			role: generated.meta?.role || currentRole,
			linkCount
		});
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
		generated = null;
		modelUsed = '';
		usedFallback = false;
		if (warningModalOpen) closeWarningModal();
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

			if (payload?.warning) {
				generated = null;
				errorMessage = '';
				warningInfo = {
					title: payload.warning?.title || 'Request warning',
					message:
						payload.warning?.message ||
						'This request does not appear to match the recruiter portfolio context.',
					detail: payload.warning?.detail || ''
				};
				warningModalOpen = true;
				finishPhaseTracking(true);
				trackRecruiterAction('ai_portfolio_warning', {
					role: normalizedRole,
					source,
					code: payload.warning?.code || 'unknown'
				});
				return;
			}

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
			Enter a role title and the AI will decide the section structure, content blocks, and styling tokens for a full recruiter-focused page.
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

	{#if warningModalOpen}
		<div class="fixed inset-0 z-[85] grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
			<div
				class="w-[min(540px,95vw)] rounded-xl border border-amber-400/35 bg-card/95 p-4 shadow-2xl"
				role="alertdialog"
				aria-modal="true"
				aria-live="assertive"
			>
				<p class="text-xs font-semibold uppercase tracking-[0.12em] text-amber-300">Context warning</p>
				<h2 class="mt-2 text-lg font-semibold">{warningInfo.title || 'Request warning'}</h2>
				<p class="mt-2 text-sm text-muted-foreground">{warningInfo.message}</p>
				{#if warningInfo.detail}
					<p class="mt-2 text-xs text-muted-foreground">{warningInfo.detail}</p>
				{/if}
				<div class="mt-4 flex justify-end">
					<Button variant="outline" onclick={closeWarningModal}>Understood</Button>
				</div>
			</div>
		</div>
	{/if}

	{#if generated}
		<div
			class="mt-6 grid gap-4 {generated.page?.theme?.density === 'compact' ? 'md:gap-3' : 'md:gap-5'}"
		>
			<section class="panel">
				<div class="flex flex-wrap items-center justify-between gap-2">
					<div>
						<p class="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Export</p>
						<p class="text-sm text-muted-foreground">
							Download the recruiter report as PDF with project and profile links included.
						</p>
					</div>
					<div class="flex flex-wrap gap-2">
						<Button variant="outline" onclick={exportGeneratedPdfReport}>Download PDF Report</Button>
					</div>
				</div>
			</section>

			<section class={getHeroClass(generated.page)}>
				<h2 class="text-xl font-semibold md:text-2xl">{generated.page?.title}</h2>
				<p class={`mt-2 text-sm ${getAccentTextClass(generated.page?.theme?.accent)}`}>
					{generated.page?.subtitle}
				</p>
				<p class="mt-3 text-sm text-muted-foreground">{generated.page?.summary}</p>
			</section>

			<section class="panel">
				<div class="flex flex-wrap items-start justify-between gap-3">
					<div>
						<p class="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Recruiter Verdict</p>
						<p class="mt-2 text-sm text-foreground">{generated.verdict?.summary}</p>
					</div>
					<div
						class={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${getVerdictToneClass(generated.verdict)}`}
					>
						{getVerdictLabel(generated.verdict)}
					</div>
				</div>
				<p class="mt-2 text-xs text-muted-foreground">{getConfidenceLabel(generated.verdict)}</p>
				<div class="mt-4 grid gap-3 md:grid-cols-2">
					<div>
						<p class="text-sm font-semibold">Top reasons</p>
						<ul class="mt-2 space-y-1.5 text-sm text-muted-foreground">
							{#each generated.verdict?.reasons ?? [] as reason, index (`verdict-reason-${index}`)}
								<li>{reason}</li>
							{/each}
						</ul>
					</div>
					<div>
						<p class="text-sm font-semibold">Concerns to validate</p>
						<ul class="mt-2 space-y-1.5 text-sm text-muted-foreground">
							{#each generated.verdict?.concerns ?? [] as concern, index (`verdict-concern-${index}`)}
								<li>{concern}</li>
							{/each}
						</ul>
					</div>
				</div>
			</section>

			{#each generated.sections ?? [] as section (section.id)}
				<section class={getSectionClass(section)}>
					{#if section.kicker}
						<p
							class={`text-xs font-semibold uppercase tracking-[0.12em] ${getAccentTextClass(section.style?.accent)}`}
						>
							{section.kicker}
						</p>
					{/if}
					<h3 class="mt-1 text-lg font-semibold md:text-xl">{section.title}</h3>

					<div class="mt-4 space-y-4">
						{#each section.blocks ?? [] as block, index (`${section.id}-${block.type}-${index}`)}
							{#if block.type === 'paragraph'}
								<p class="text-sm text-muted-foreground">{block.text}</p>
							{/if}

							{#if block.type === 'bullets'}
								<ul class="space-y-1.5 text-sm text-muted-foreground">
									{#each block.items ?? [] as item (`${section.id}-${item}`)}
										<li class="leading-relaxed">{item}</li>
									{/each}
								</ul>
							{/if}

							{#if block.type === 'metrics'}
								<div class="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
									{#each block.items ?? [] as metric (`${section.id}-${metric.label}`)}
										<article class={`item-card ${getAccentCardClass(section.style?.accent)}`}>
											<p class="text-xs uppercase tracking-[0.08em] text-muted-foreground">{metric.label}</p>
											<p class="mt-1 text-lg font-semibold">{metric.value}</p>
											{#if metric.detail}
												<p class="mt-1 text-xs text-muted-foreground">{metric.detail}</p>
											{/if}
										</article>
									{/each}
								</div>
							{/if}

							{#if block.type === 'cards'}
								<div class={getSectionLayoutClass(section)}>
									{#each block.items ?? [] as item (`${section.id}-${item.title}-${item.href}`)}
										<article class={`item-card ${getAccentCardClass(section.style?.accent)}`}>
											<div class="flex flex-wrap items-center justify-between gap-2">
												<p class="text-base font-semibold">{item.title}</p>
												{#if item.tag}
													<span
														class={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${getAccentBadgeClass(section.style?.accent)}`}
													>
														{item.tag}
													</span>
												{/if}
											</div>
											{#if item.text}
												<p class="mt-2 text-sm text-muted-foreground">{item.text}</p>
											{/if}
											{#if item.meta}
												<p class="mt-1 text-xs text-muted-foreground">{item.meta}</p>
											{/if}
											{#if item.href}
												<div class="mt-3">
													<Button
														variant="outline"
														size="sm"
														href={item.href}
														target={isExternalHref(item.href) ? '_blank' : undefined}
														rel={isExternalHref(item.href) ? 'noreferrer' : undefined}
													>
														Open Link
													</Button>
												</div>
											{/if}
										</article>
									{/each}
								</div>
							{/if}

							{#if block.type === 'links'}
								<div class={getSectionLayoutClass(section)}>
									{#each block.items ?? [] as link (`${section.id}-${link.label}-${link.href}`)}
										<a
											href={link.href}
											target={isExternalHref(link.href) ? '_blank' : undefined}
											rel={isExternalHref(link.href) ? 'noreferrer' : undefined}
											class={`item-card block transition-colors hover:bg-muted/70 ${getAccentCardClass(section.style?.accent)}`}
										>
											<p class="text-sm font-semibold text-foreground">{link.label}</p>
											{#if link.description}
												<p class="mt-1 text-xs text-muted-foreground">{link.description}</p>
											{/if}
											<p class="mt-2 break-all text-xs text-primary">{link.href}</p>
										</a>
									{/each}
								</div>
							{/if}

							{#if block.type === 'qa'}
								<div class="space-y-3">
									{#each block.items ?? [] as qa (`${section.id}-${qa.question}`)}
										<article class={`item-card ${getAccentCardClass(section.style?.accent)}`}>
											<p class="text-sm font-semibold">Q: {qa.question}</p>
											<p class="mt-1 text-sm text-muted-foreground">A: {qa.answer}</p>
										</article>
									{/each}
								</div>
							{/if}

							{#if block.type === 'cta'}
								<div class="flex flex-wrap gap-2">
									{#if block.primary_label && block.primary_href}
										<Button
											href={block.primary_href}
											target={isExternalHref(block.primary_href) ? '_blank' : undefined}
											rel={isExternalHref(block.primary_href) ? 'noreferrer' : undefined}
										>
											{block.primary_label}
										</Button>
									{/if}
									{#if block.secondary_label && block.secondary_href}
										<Button
											variant="outline"
											href={block.secondary_href}
											target={isExternalHref(block.secondary_href) ? '_blank' : undefined}
											rel={isExternalHref(block.secondary_href) ? 'noreferrer' : undefined}
										>
											{block.secondary_label}
										</Button>
									{/if}
								</div>
							{/if}
						{/each}
					</div>
				</section>
			{/each}
		</div>
	{/if}
</section>
