import Groq from 'groq-sdk';
import { GROQ_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { rateLimit } from '$lib/rateLimiter.js';

const RATE_LIMIT_CONFIG = {
	requests: 5,
	windowMinutes: 1
};
const REQUEST_TIMEOUT_MS = 30000;
const MODEL = 'llama-3.3-70b-versatile';

const withTimeout = (promise, timeoutMs = REQUEST_TIMEOUT_MS) =>
	Promise.race([
		promise,
		new Promise((_, reject) =>
			setTimeout(() => reject(new Error(`AI provider timeout after ${timeoutMs}ms`)), timeoutMs)
		)
	]);

const resolveClientIP = (request, getClientAddress) => {
	try {
		const directIP = getClientAddress?.();
		if (directIP?.trim()) return directIP.trim();
	} catch {
		// fallback to headers
	}

	const forwardedFor = request.headers.get('x-forwarded-for');
	if (forwardedFor?.trim()) return forwardedFor.split(',')[0].trim();

	const realIP = request.headers.get('x-real-ip');
	if (realIP?.trim()) return realIP.trim();

	return 'unknown';
};

const sanitize = (value, max = 280) => {
	if (typeof value !== 'string') return '';
	return value.replace(/\s+/g, ' ').trim().slice(0, max);
};

const parseModelJson = (raw) => {
	if (typeof raw !== 'string') return null;
	const cleaned = raw.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '');
	try {
		return JSON.parse(cleaned);
	} catch {
		return null;
	}
};

const rankProjectsForRole = (role, projects) => {
	const roleTerms = sanitize(role, 120)
		.toLowerCase()
		.split(/[^a-z0-9]+/)
		.filter((term) => term.length > 2);

	return [...projects]
		.map((project) => {
			const haystack = [
				project.title,
				project.description,
				...(project.technologies ?? []),
				project.githubUrl,
				project.demoUrl
			]
				.map((value) => sanitize(value, 600).toLowerCase())
				.join(' ');

			let score = 0;
			for (const term of roleTerms) {
				if (haystack.includes(term)) score += 2;
			}
			if (project.githubUrl?.startsWith('https://')) score += 1;
			if (project.demoUrl?.startsWith('https://')) score += 1;
			return { project, score };
		})
		.sort((a, b) => b.score - a.score)
		.map((entry) => entry.project);
};

const fallbackPortfolio = (role, info, skills, projects, projectDescription = '') => {
	const ranked = rankProjectsForRole(role, projects).slice(0, 4);
	const topSkills = skills.slice(0, 6);

	return {
		hero: {
			title: `AI Portfolio for ${role}`,
			subtitle: sanitize(info?.headline || 'Software Developer focused on product delivery.', 160),
			summary:
				'This role-fit view is generated from portfolio data to speed recruiter screening and evidence review.'
		},
		fit: {
			verdict: `Strong practical fit for ${role} with proven delivery across shipped web products.`,
			top_reasons: [
				'Multiple shipped projects with case studies and implementation evidence.',
				'Production-focused stack across frontend, backend, and API integration.',
				'Clear communication of scope, tradeoffs, and outcomes.'
			],
			risks: ['Role-specific depth should be validated in technical interview and repo walkthrough.']
		},
		projects: ranked.map((project) => ({
			slug: sanitize(project.slug, 80),
			title: sanitize(project.title, 120),
			why_fit: 'Demonstrates practical problem-solving with maintainable implementation.',
			evidence: project.githubUrl?.startsWith('https://')
				? 'Source repository available for direct code review.'
				: 'Case study evidence available in project detail page.',
			focus: 'Deliver a reliable solution aligned to user needs and engineering constraints.',
			outcome: project.demoUrl?.startsWith('https://')
				? 'Live deployment available for recruiter evaluation.'
				: 'Project details available for architecture and implementation review.'
		})),
		skills: topSkills.map((skill) => ({
			name: sanitize(skill.title || skill.name, 60),
			relevance: 'Relevant for role requirements and production delivery.',
			proof: sanitize(skill.tools || '', 120)
		})),
		interview: {
			questions: [
				'Which project best represents your architecture and tradeoff decisions?',
				'How do you approach maintainability and code quality under delivery pressure?',
				'Which recent role responsibilities map most directly to this position?'
			],
			email_subject: `Interview invitation: ${role}`,
			email_body:
				'Hi Lethabo, we reviewed your portfolio and would like to schedule an interview for this role.'
		},
		cta: {
			primary_label: 'View GitHub Profile',
			primary_href: sanitize(info?.github || '', 220),
			secondary_label: 'Contact Candidate',
			secondary_href: sanitize(info?.email ? `mailto:${info.email}` : '/#contact', 220)
		},
		meta: {
			project_description: sanitize(projectDescription, 500)
		}
	};
};

export const POST = async ({ request, getClientAddress, locals: { supabase } }) => {
	try {
		const clientIP = resolveClientIP(request, getClientAddress);
		if (!rateLimit(clientIP, RATE_LIMIT_CONFIG)) {
			return json(
				{ success: false, error: 'Too many requests. Please wait a minute and try again.' },
				{ status: 429 }
			);
		}

		let payload;
		try {
			payload = await request.json();
		} catch {
			return json({ success: false, error: 'Invalid JSON payload.' }, { status: 400 });
		}

		const role = sanitize(payload?.role, 100);
		if (!role) {
			return json({ success: false, error: 'Role is required.' }, { status: 400 });
		}
		const projectDescription = sanitize(payload?.projectDescription, 1200);

		const [{ data: info, error: infoError }, { data: skills, error: skillsError }, { data: projects, error: projectsError }] =
			await Promise.all([
				supabase.from('info').select('*').eq('id', 1).single(),
				supabase.from('skills').select('*'),
				supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(10)
			]);

		if (infoError || skillsError || projectsError) {
			return json({ success: false, error: 'Unable to fetch portfolio context.' }, { status: 500 });
		}

		const safeSkills = Array.isArray(skills) ? skills : [];
		const safeProjects = Array.isArray(projects) ? projects : [];
		const fallback = fallbackPortfolio(role, info, safeSkills, safeProjects, projectDescription);

		const apiKey = GROQ_API_KEY?.trim();
		if (!apiKey) {
			return json({ success: true, generated: fallback, model: 'fallback', fallback: true });
		}

		const context = {
			role,
			project_description: projectDescription,
			candidate: {
				name: sanitize(info?.name || 'Lethabo Maepa', 80),
				headline: sanitize(info?.headline || '', 200),
				about: sanitize(info?.about || '', 800),
				email: sanitize(info?.email || '', 120),
				github: sanitize(info?.github || '', 220),
				linkedin: sanitize(info?.linkedin || '', 220)
			},
			skills: safeSkills.slice(0, 10).map((skill) => ({
				name: sanitize(skill?.title || skill?.name, 60),
				level: sanitize(String(skill?.level ?? ''), 10),
				tools: sanitize(skill?.tools || '', 180)
			})),
			projects: safeProjects.slice(0, 8).map((project) => ({
				slug: sanitize(project?.slug, 80),
				title: sanitize(project?.title, 120),
				description: sanitize(project?.description, 380),
				technologies: Array.isArray(project?.technologies)
					? project.technologies.map((tech) => sanitize(tech, 24)).slice(0, 8)
					: [],
				githubUrl: sanitize(project?.githubUrl, 220),
				demoUrl: sanitize(project?.demoUrl, 220)
			}))
		};

		const systemPrompt = `You generate a recruiter-facing AI role-fit portfolio page.
Return strict JSON only using this schema:
{
  "hero": { "title": "", "subtitle": "", "summary": "" },
  "fit": { "verdict": "", "top_reasons": ["", "", ""], "risks": [""] },
  "projects": [
    { "slug": "", "title": "", "why_fit": "", "evidence": "", "focus": "", "outcome": "" }
  ],
  "skills": [
    { "name": "", "relevance": "", "proof": "" }
  ],
  "interview": {
    "questions": ["", "", ""],
    "email_subject": "",
    "email_body": ""
  },
  "cta": {
    "primary_label": "",
    "primary_href": "",
    "secondary_label": "",
    "secondary_href": ""
  }
}
Rules:
- Use only given context, no invented metrics.
- Keep claims factual and recruiter-friendly.
- Prioritize practical evidence and relevance to role.
- If project_description is provided, use it as additional role context.
- Keep each field concise.`;

		const groq = new Groq({ apiKey });
		const completion = await withTimeout(
			groq.chat.completions.create({
				model: MODEL,
				temperature: 0.3,
				max_tokens: 1400,
				messages: [
					{ role: 'system', content: systemPrompt },
					{ role: 'user', content: JSON.stringify(context) }
				]
			})
		);

		const raw = completion?.choices?.[0]?.message?.content ?? '';
		const parsed = parseModelJson(raw);

		if (!parsed?.hero || !parsed?.fit || !Array.isArray(parsed?.projects)) {
			return json({ success: true, generated: fallback, model: MODEL, fallback: true });
		}

		return json({
			success: true,
			generated: parsed,
			model: completion?.model || MODEL,
			fallback: false
		});
	} catch (error) {
		console.error('AI portfolio page error:', error);
		return json({ success: false, error: 'Unable to generate role-fit portfolio right now.' }, { status: 500 });
	}
};
