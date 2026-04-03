import { Brush, Cloud, Code, Database, Layout, Rocket, Server, Smartphone } from 'lucide-svelte';

export let auth = $state({
	isAuthenticated: false
});

export let models = $state({
	data: [],
	question: '',
	context: '',
	maxPromptChars: 10500,
	sanitizeText: (value, max = 280) => {
		if (typeof value !== 'string') return '';
		return value.replace(/\s+/g, ' ').replace(/<[^>]*>/g, '').trim().slice(0, max);
	},
	contextSummary: () => {
		const ctx = portfolioContext?.info ?? {};
		const info = ctx?.info ?? {};
		const skills = Array.isArray(ctx?.skills) ? ctx.skills : [];
		const projects = Array.isArray(ctx?.projects) ? ctx.projects : [];

		const topSkills = skills.slice(0, 8).map((skill) => {
			const name = models.sanitizeText(skill?.title || skill?.name || '', 40);
			const level = Number(skill?.level) ? `${skill.level}%` : '';
			return [name, level].filter(Boolean).join(' ');
		});

		const topProjects = projects.slice(0, 6).map((project) => ({
			title: models.sanitizeText(project?.title || '', 70),
			slug: models.sanitizeText(project?.slug || '', 60),
			stack: models.sanitizeText(project?.tools || project?.tech_stack || '', 90),
			outcome: models.sanitizeText(project?.description || project?.summary || '', 180)
		}));

		return {
			profile: {
				name: models.sanitizeText(info?.name || 'Lethabo Maepa', 50),
				title: models.sanitizeText(info?.title || info?.role || 'Software Developer', 80),
				location: models.sanitizeText(info?.location || 'South Africa', 60),
				email: models.sanitizeText(info?.email || '', 80)
			},
			topSkills,
			topProjects,
			pricing: portfolioContext.pricing
		};
	},
	compactPrompt: (rawPrompt) => {
		if (typeof rawPrompt !== 'string') return '';
		const compact = rawPrompt.replace(/\s+/g, ' ').trim();
		if (compact.length <= models.maxPromptChars) return compact;
		const head = compact.slice(0, 7200);
		const tail = compact.slice(-2500);
		return `${head}\n...[prompt truncated for token safety]...\n${tail}`;
	},
	promptMessage: () => {
		try {
			const composedPrompt = `You are Ask AI, the assistant for Lethabo Maepa's portfolio.
      Your job is to help recruiters and clients quickly evaluate fit.
      Rules:
      - Use the provided context first and stay factual.
      - Keep answers concise, specific, and professional.
      - When relevant, suggest concrete next steps (e.g., view projects, contact, pricing).
      - If uncertain, say "I don't know based on current portfolio data."
      - Prefer bullet points for summaries and comparisons.
      \n${models.redirectRule()}\n
      Question: ${models.question || 'No question provided'}
      Context: ${JSON.stringify(models.contextSummary())}`;

			return models.compactPrompt(composedPrompt);
		} catch (error) {
			console.error('Error in promptMessage:', error);
			return 'Error generating prompt. Please try again.';
		}
	},
	redirectRule: () => {
		return `To navigate the user to a specific section, use: "redirect({section})". Replace {section} with one of [about, skills, projects, experience, services, pricing, contact]. For a specific project card in the projects section, use its slug like "redirect(projects/{slug})". Ensure the section or slug exists before redirecting.`;
	},
	getRandomModel: () => {
		if (!models.data?.length) return null;
		return models.data[Math.floor(Math.random() * models.data.length)];
	}
});

export const portfolioContext = $state({
	skills: [
		{ name: 'Frontend', icon: Code, level: 90, tools: 'React, Svelte, Vue.js, HTML/CSS' },
		{ name: 'Full-Stack', icon: Brush, level: 88, tools: 'NextJs, SvelteKit, Nuxt.js' },
		{ name: 'Backend', icon: Database, level: 85, tools: 'Node.js, .NET, Supabase, Appwrite' },
		{ name: 'Database', icon: Cloud, level: 80, tools: 'PostgreSQL, Microsoft SQL Server, Oracle' },
		{ name: 'Languages', icon: Code, tools: 'Javascript, Typescript, Python, C#, Java' },
		{ name: 'Tools', icon: Rocket, tools: 'Git, GitHub, Docker, Vercel, Netlify' }
	],
	info: null,
	experience: [
		{
			title: 'Graduate Software Engineer - Boxfusion',
			description:
				'As a graduate software engineer at Boxfusion, I work on a variety of projects, including web development, and backend services. I have gained experience in technologies such as React, Next.js, SQL Server, ASP.NET, ABPZero, Docker and PostgreSQL.',
			dates: 'Feb 2026 - Present'
		},
		{
			title: 'Tech Innovation Lead - GKSS NWU',
			description:
				"Led a society of tech students who participated in hackathons and tech events, and led the development of the society's website.",
			dates: 'Nov 2024 - Nov 2025'
		},
		{
			title: '2nd Place - Arcademia Global Game Jam',
			description:
				'My team placed joint 2nd after we created a 2D platformer game called DragonJourney.',
			dates: 'May 2025'
		},
		{
			title: '2nd Place - GeeXpo Innovation Hackathon',
			description:
				'My team placed 2nd in the GeeXpo Innovation category for an idea focused on improving taxi commuter experiences.',
			dates: 'Oct 2024'
		},
		{
			title: 'Freelancer - Thuto And Tsebo Trust',
			description:
				'I built a website that showcased their services and allowed students to apply for accommodation.',
			dates: 'Oct 2024'
		}
	],
	services: [
		{
			icon: Code,
			title: 'Web Development',
			text: 'Modern web applications using practical, maintainable technology choices.'
		},
		{ icon: Smartphone, title: 'Mobile Apps', text: 'Cross-platform mobile experiences for real users.' },
		{
			icon: Server,
			title: 'Backend Services',
			text: 'Scalable APIs, integrations, and database architecture.'
		},
		{ icon: Layout, title: 'Full-Stack Solutions', text: 'End-to-end delivery from concept to launch.' }
	],
	pricing: [
		{
			name: 'Starter Portfolio / One-Pager',
			range: 'R6,500 - R12,000',
			timeline: '1-2 weeks',
			ideal_for: 'Individuals and simple professional presence'
		},
		{
			name: 'Business Website',
			range: 'R12,000 - R28,000',
			timeline: '2-5 weeks',
			ideal_for: 'SMEs needing lead generation and strong credibility'
		},
		{
			name: 'Custom Web App MVP',
			range: 'R30,000 - R85,000',
			timeline: '4-10 weeks',
			ideal_for: 'Teams needing custom workflows, dashboards, or automation'
		}
	]
});
