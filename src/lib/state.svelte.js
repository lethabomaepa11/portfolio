import { Brush, Cloud, Code, Database, Layout, Rocket, Server, Smartphone } from "lucide-svelte"


export let auth = $state({
    isAuthenticated: false
})

export let models = $state({
    data: [],
    question: '',
    context: '',
    promptMessage: () => {
		return `You are an assistant for question-answering tasks. Use the following pieces of retrieved context to
		 answer the question, You may use your own words, but stick to the context. If you don't know the answer, just 
		 say that you don't know. Use three sentences maximum and keep the answer concise.You may return markdown\n
		 ${models.redirectRule()}\n
    	Question: ${models.question}
    	Context: ${JSON.stringify(portfolioContext)}`},
	getRandomModel: () => {
		return models.data[Math.floor(Math.random() * models.data.length)]
	},
	redirectRule: () => {
		return `If you wish to navigate the user to a specific page say: "redirect({page})", 
			replace {page} with any of the pages here [about me, projects, about, skills, experience, services, contact]
			and note that for a specific project, you can use its slug like so redirect({page/slug})`
	},
	getModel: (index) => {
		if(index >= models.data.length) return null;
		return models.data[index];
	}
})

export const portfolioContext = $state({
    //my information
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
				'I am working on the frontend of the campustrade.co.za website, which is an online platform for students to buy or sell textbooks, calculators, study notes, and other essential items. ',
			dates: 'May 2025 - Present'
		},
		{
			title: 'Tech Innovation Lead - GKSS NWU',
			description:
				"Led a society of tech students who participated in hackathons and tech events, also led the development of the society's website.",
			dates: 'Nov 2024 - Present'
		},
		{
			title: '2nd Place - Arcademia Global Game Jam',
			description:
				'My Team came joint 2nd place after we created a 2d platformer game called DragonJourney.',
			dates: 'May 2025'
		},
		{
			title: '2nd Place - GeeXpo Innovation Hackathon',
			description:
				'My Team came 2nd in the GeeXpo Innovation category for an awesome idea we had to develop a solution that will help Taxis drivers and commuters',
			dates: 'Oct 2024'
		},
		{
			title: 'Freelancer - Thuto And Tsebo Trust',
			description:
				'I worked on a website that showcased their services and also allowed students to apply for accommodation.',
			dates: 'Oct 2024'
		}
	],
    services: [
		{
			icon: Code,
			title: 'Web Development',
			text: 'Modern web applications using latest technologies'
		},
		{ icon: Smartphone, title: 'Mobile Apps', text: 'Cross-platform mobile solutions' },
		{ icon: Server, title: 'Backend Services', text: 'Scalable API development & database design' },
		{ icon: Layout, title: 'Full-Stack Solutions', text: 'End-to-end product development' }
	],
})