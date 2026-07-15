import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals: { supabase } }) => {
	const formData = await request.formData();
	const project = Object.fromEntries(formData.entries());

	const updateFields = {
		title: project.title,
		description: project.description,
		githubUrl: project.githubUrl,
		demoUrl: project.demoUrl,
		case_study: project.case_study,
		technologies: typeof project.technologies === 'string' ? project.technologies.split(',').map((t) => t.trim()) : project.technologies
	};

	if (project.image instanceof File && project.image.size > 0) {
		const ext = project.image.name.split('.').pop() || 'png';
		const filePath = `projects/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
		const { data: uploadData, error: uploadError } = await supabase.storage
			.from('files')
			.upload(filePath, project.image, {
				cacheControl: '3600',
				upsert: false
			});

		if (uploadError) {
			console.error('Image upload error:', uploadError);
		} else {
			const { data: { publicUrl } } = supabase.storage.from('files').getPublicUrl(filePath);
			updateFields.image = publicUrl;
		}
	}

	const { data, error } = await supabase
		.from('projects')
		.update(updateFields)
		.eq('id', project.id);

	if (error) {
		console.error(error);
		return json({ success: false, error: error.message });
	}

	return json({ success: true, data });
};