	import {
		BrainCog,
		BriefcaseBusiness,
		Contact,
		FolderCode,
		HelpingHand,
        UserRoundSearchIcon,
	} from 'lucide-svelte';

export const pages = [
		{
			title: 'About Me',
			url: '',
			icon: UserRoundSearchIcon,
			variant: 'ghost'
		},
		{
			title: 'Projects',
			url: 'projects',
			icon: FolderCode,
			variant: 'ghost'
		},
		{
			title: 'Skills',
			url: 'skills',
			icon: BrainCog,
			variant: 'ghost'
		},
		{
			title: 'Experience',
			url: 'experience',
			icon: BriefcaseBusiness,
			variant: 'ghost'
		},
		{
			title: 'Services',
			url: 'services',
			icon: HelpingHand,
			variant: 'ghost'
		},
		{
			title: 'Contact',
			url: 'contact',
			icon: Contact,
			variant: 'ghost'
		}
	];