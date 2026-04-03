import { json } from '@sveltejs/kit';
import Groq from 'groq-sdk';
import { GROQ_API_KEY } from '$env/static/private';
import { rateLimit } from '$lib/rateLimiter.js';

const RATE_LIMIT_CONFIG = {
	requests: 6,
	windowMinutes: 1
};
const INSIGHTS_MODEL = 'llama-3.3-70b-versatile';
const MAX_PROJECTS = 8;

const resolveClientIP = (request, getClientAddress) => {
	try {
		const directIP = getClientAddress?.();
		if (directIP?.trim()) return directIP.trim();
	} catch {
		// fallback below
	}
	const forwardedFor = request.headers.get('x-forwarded-for');
	if (forwardedFor?.trim()) return forwardedFor.split(',')[0].trim();
	const realIP = request.headers.get('x-real-ip');
	if (realIP?.trim()) return realIP.trim();
	return 'unknown';
};

const sanitize = (value, max = 260) => {
	if (typeof value !== 'string') return '';
	return value.replace(/\s+/g, ' ').trim().slice(0, max);
};

const hasUrl = (value) => typeof value === 'string' && value.startsWith('https://');

const buildFallback = (project) => {
	const stackPreview = (project.technologies ?? []).slice(0, 3).join(', ');
	const hasDemo = hasUrl(project.demoUrl);
	const hasGithub = hasUrl(project.githubUrl);

	const focus = stackPreview
		? `Build a practical solution using ${stackPreview} with maintainable delivery.`
		: 'Solve a clear user problem with practical, maintainable implementation.';

	const outcome = hasDemo
		? 'Live deployment available for review with user-facing workflow evidence.'
		: hasGithub
			? 'Source code available to evaluate implementation quality and engineering approach.'
			: 'Case study available to review architecture, tradeoffs, and delivery decisions.';

	return { focus, outcome };
};

const parseProjectsPayload = (payload) => {
	const rawProjects = Array.isArray(payload?.projects) ? payload.projects : [];
	return rawProjects.slice(0, MAX_PROJECTS).map((project) => ({
		slug: sanitize(project?.slug, 80),
		title: sanitize(project?.title, 120),
		description: sanitize(project?.description, 520),
		technologies: Array.isArray(project?.technologies)
			? project.technologies.map((tech) => sanitize(tech, 32)).filter(Boolean).slice(0, 8)
			: [],
		demoUrl: sanitize(project?.demoUrl, 240),
		githubUrl: sanitize(project?.githubUrl, 240)
	}));
};

const parseModelJson = (raw) => {
	if (typeof raw !== 'string' || !raw.trim()) return null;
	const stripped = raw.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/, '');
	try {
		return JSON.parse(stripped);
	} catch {
		return null;
	}
};

export const POST = async ({ request, getClientAddress }) => {
	try {
		const apiKey = GROQ_API_KEY?.trim();
		if (!apiKey) {
			return json(
				{ success: false, error: 'Server configuration error: missing GROQ_API_KEY' },
				{ status: 500 }
			);
		}

		const clientIP = resolveClientIP(request, getClientAddress);
		if (!rateLimit(clientIP, RATE_LIMIT_CONFIG)) {
			return json(
				{ success: false, error: 'Too many requests. Please wait and try again.' },
				{ status: 429 }
			);
		}

		let payload;
		try {
			payload = await request.json();
		} catch {
			return json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
		}

		const projects = parseProjectsPayload(payload);
		if (!projects.length) {
			return json({ success: true, insights: {} });
		}

		const groq = new Groq({ apiKey });
		const completion = await groq.chat.completions.create({
			model: INSIGHTS_MODEL,
			temperature: 0.25,
			max_tokens: 900,
			messages: [
				{
					role: 'system',
					content: `You generate recruiter-ready project summaries.
Return strict JSON only.
Schema:
{
  "insights": {
    "<slug>": {
      "focus": "max 18 words, practical engineering focus",
      "outcome": "max 18 words, concrete delivery evidence"
    }
  }
}
Rules:
- Use only given project data.
- Do not invent metrics or claims.
- Keep language factual and professional.`
				},
				{
					role: 'user',
					content: JSON.stringify({ projects })
				}
			]
		});

		const rawResponse = completion?.choices?.[0]?.message?.content ?? '';
		const parsed = parseModelJson(rawResponse);
		const modelInsights = parsed?.insights ?? {};
		const insights = {};

		for (const project of projects) {
			const fromModel = modelInsights?.[project.slug] ?? {};
			const fallback = buildFallback(project);
			insights[project.slug] = {
				focus: sanitize(fromModel.focus, 170) || fallback.focus,
				outcome: sanitize(fromModel.outcome, 170) || fallback.outcome
			};
		}

		return json({
			success: true,
			insights,
			model: completion?.model ?? INSIGHTS_MODEL
		});
	} catch (error) {
		console.error('Project insights API error:', error);
		return json({ success: false, error: 'Unable to generate project insights right now.' }, { status: 500 });
	}
};
