import { Brush, Cloud, Code, Database, Layout, Rocket, Server, Smartphone } from 'lucide-svelte';

export let auth = $state({
	isAuthenticated: false
});

export let models = $state({
	data: [],
	question: '',
	context: '',
	promptMessage: () => {
		try {
			return `You are Ask AI, the assistant for Lethabo Maepa's portfolio.
      Your job is to help recruiters and clients quickly evaluate fit.
      Rules:
      - Use the provided context first and stay factual.
      - Keep answers concise, specific, and professional.
      - When relevant, suggest concrete next steps (e.g., view projects, contact, pricing).
      - If uncertain, say "I don't know based on current portfolio data."
      - Prefer bullet points for summaries and comparisons.
      \n${models.redirectRule()}\n
      Question: ${models.question || 'No question provided'}
      Context: ${JSON.stringify(portfolioContext || {}, null, 2)}`;
		} catch (error) {
			console.error('Error in promptMessage:', error);
			return 'Error generating prompt. Please try again.';
		}
	},
	redirectRule: () => {
		return `To navigate the user to a specific page, use: "redirect({page})". Replace {page} with one of [about, skills, projects, experience, services, pricing, contact], or for a specific project, use its slug like "redirect(projects/{slug})". Ensure the page or slug exists before redirecting.`;
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
			title: 'Frontend Developer - CampusTrade Online',
			description:
				'I am working on the frontend of the campustrade.co.za website, which is an online platform for students to buy or sell textbooks, calculators, study notes, and other essential items.',
			dates: 'May 2025 - Present'
		},
		{
			title: 'Tech Innovation Lead - GKSS NWU',
			description:
				"Led a society of tech students who participated in hackathons and tech events, and led the development of the society's website.",
			dates: 'Nov 2024 - Present'
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
