import { browser } from '$app/environment';

const STORAGE_KEY = 'ab_assignments';
const VISITOR_KEY = 'ab_visitor_id';

function generateId() {
	return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getVisitorId() {
	if (!browser) return '';
	let id = localStorage.getItem(VISITOR_KEY);
	if (!id) {
		id = generateId();
		localStorage.setItem(VISITOR_KEY, id);
	}
	return id;
}

function getAssignments() {
	if (!browser) return {};
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
	} catch {
		return {};
	}
}

function saveAssignments(assignments) {
	if (!browser) return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
}

const experiments = {
	hero_cta: {
		name: 'hero_cta',
		variants: [
			{ name: 'default', weight: 2 },
			{ name: 'resume_first', weight: 1 }
		]
	},
	hero_tagline: {
		name: 'hero_tagline',
		variants: [
			{ name: 'headline', weight: 2 },
			{ name: 'value_prop', weight: 1 },
			{ name: 'tech_focus', weight: 1 }
		]
	},
	projects_style: {
		name: 'projects_style',
		variants: [
			{ name: 'cards', weight: 2 },
			{ name: 'compact', weight: 1 }
		]
	}
};

function pickVariant(experiment) {
	const totalWeight = experiment.variants.reduce((sum, v) => sum + v.weight, 0);
	let roll = Math.random() * totalWeight;
	for (const variant of experiment.variants) {
		roll -= variant.weight;
		if (roll <= 0) return variant.name;
	}
	return experiment.variants[0].name;
}

export function getVariant(experimentKey) {
	if (!browser) return null;
	const experiment = experiments[experimentKey];
	if (!experiment) return null;

	const assignments = getAssignments();
	if (assignments[experimentKey]) {
		return assignments[experimentKey];
	}

	const variant = pickVariant(experiment);
	assignments[experimentKey] = variant;
	saveAssignments(assignments);

	trackEvent(experimentKey, variant, 'impression');
	return variant;
}

export async function trackEvent(experimentKey, variant, eventType, eventData = {}) {
	if (!browser) return;
	const visitorId = getVisitorId();

	try {
		await fetch('/api/ab-testing/event', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ experimentKey, variant, eventType, visitorId, eventData })
		});
	} catch {
	}
}

export function getExperiments() {
	return Object.keys(experiments);
}
