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
			'Work as a primary developer on client-facing enterprise software, collaborating with Business Analysts and stakeholders to analyse business processes and build end-to-end solutions. I have developed workflows, data management features, administrative functionality and APIs using C#, ASP.NET Core, Entity Framework Core, SQL Server, PostgreSQL and Shesha. I have also worked directly with a client onsite in the Western Cape to understand operational processes and translate them into software requirements. Additionally, I developed an AI-assisted development workflow to automate repetitive development tasks and improve development consistency.',
		dates: 'Feb 2026 - Present'
	},
	{
		title: 'Tech Innovation Lead - GKSS NWU',
		description:
			'Led the technology and innovation activities of GKSS at NWU Vaal, organising students around hackathons, technical projects and peer learning. Led the development of the society website and helped establish a student developer community focused on collaboration, code reviews and technical growth.',
		dates: 'Nov 2024 - Nov 2025'
	},
	{
		title: 'Top 10 - Geekulcha Annual Hackathon 2025',
		description:
			'Worked with a team to develop a smart-agriculture solution addressing challenges in agricultural operations. Our solution placed in the Top 10 of the Geekulcha Annual Hackathon.',
		dates: 'Sept 2025'
	},
	{
		title: 'Participant - G20 Tourism Hackathon',
		description:
			'Selected as one of 14 developers to participate in a national tourism-focused hackathon held around the G20 programme, collaborating with developers and industry stakeholders to develop technology-driven solutions for tourism.',
		dates: 'Sept 2025'
	},
	{
		title: '2nd Place - Arcademia Global Game Jam',
		description:
			'Collaborated with a team to design and develop DragonJourney, a 2D platformer game, competing against other teams in a rapid game-development environment. The project placed joint 2nd.',
		dates: 'May 2025'
	},
	{
		title: '2nd Place - GeeXpo Innovation Hackathon',
		description:
			'Worked with a team to develop an innovation concept focused on improving the experience of taxi commuters. The project placed 2nd in the GeeXpo Innovation category.',
		dates: 'Oct 2024'
	},
	{
		title: 'Freelancer - Thuto And Tsebo Trust',
		description:
			'Designed and developed a website for the organisation, showcasing its services and providing an online accommodation application process for students.',
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
