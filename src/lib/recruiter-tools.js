import { browser } from '$app/environment';

const METRICS_KEY = 'recruiter_action_metrics_v1';

const readMetrics = () => {
	if (!browser) return { counts: {}, recent: [] };
	try {
		const raw = localStorage.getItem(METRICS_KEY);
		if (!raw) return { counts: {}, recent: [] };
		const parsed = JSON.parse(raw);
		return {
			counts: parsed?.counts ?? {},
			recent: Array.isArray(parsed?.recent) ? parsed.recent : []
		};
	} catch {
		return { counts: {}, recent: [] };
	}
};

const writeMetrics = (payload) => {
	if (!browser) return;
	try {
		localStorage.setItem(METRICS_KEY, JSON.stringify(payload));
	} catch {
		// no-op
	}
};

export const trackRecruiterAction = (action, meta = {}) => {
	if (!browser || !action) return;

	const metrics = readMetrics();
	metrics.counts[action] = (metrics.counts[action] ?? 0) + 1;
	metrics.recent = [
		{
			action,
			ts: new Date().toISOString(),
			meta
		},
		...metrics.recent
	].slice(0, 80);
	writeMetrics(metrics);

	try {
		const umami = globalThis?.umami;
		if (typeof umami?.track === 'function') {
			umami.track(`recruiter:${action}`);
		}
	} catch {
		// no-op
	}
};

export const getRecruiterMetricsSnapshot = () => readMetrics();

export const copyText = async (value) => {
	if (!browser || !value) return false;
	try {
		await navigator.clipboard.writeText(value);
		return true;
	} catch {
		return false;
	}
};

export const downloadTextFile = (filename, content) => {
	if (!browser) return false;
	try {
		const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
		const href = URL.createObjectURL(blob);
		const anchor = document.createElement('a');
		anchor.href = href;
		anchor.download = filename;
		document.body.appendChild(anchor);
		anchor.click();
		anchor.remove();
		URL.revokeObjectURL(href);
		return true;
	} catch {
		return false;
	}
};
