import { json } from '@sveltejs/kit';

export const POST = async ({ locals: { supabase }, request }) => {
	try {
		const { experimentKey, variant, eventType, visitorId, eventData } = await request.json();

		if (!experimentKey || !variant || !eventType) {
			return json({ success: false, error: 'Missing required fields' });
		}

		const { data: experiment } = await supabase
			.from('ab_experiments')
			.select('id')
			.eq('name', experimentKey)
			.single();

		if (!experiment) {
			return json({ success: true });
		}

		const { data: variantRecord } = await supabase
			.from('ab_variants')
			.select('id')
			.eq('experiment_id', experiment.id)
			.eq('name', variant)
			.single();

		if (!variantRecord) {
			return json({ success: true });
		}

		let { data: assignment } = await supabase
			.from('ab_assignments')
			.select('id')
			.eq('experiment_id', experiment.id)
			.eq('visitor_id', visitorId)
			.single();

		if (!assignment && eventType === 'impression') {
			const { data: newAssignment } = await supabase
				.from('ab_assignments')
				.insert({
					experiment_id: experiment.id,
					variant_id: variantRecord.id,
					visitor_id: visitorId
				})
				.select('id')
				.single();
			assignment = newAssignment;
		}

		if (assignment) {
			await supabase.from('ab_events').insert({
				assignment_id: assignment.id,
				event_type: eventType,
				event_data: eventData || {}
			});
		}

		return json({ success: true });
	} catch {
		return json({ success: false, error: 'Failed to record event' });
	}
};
