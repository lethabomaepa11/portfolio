import adapter from '@sveltejs/adapter-netlify';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	},
	preprocess: preprocess({
		postcss: true, // Enable PostCSS (needed for Tailwind)
	}),
	alias: {
		"@/*": "./src/lib/*",
	},
};

export default config;
