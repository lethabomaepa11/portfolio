import { json } from '@sveltejs/kit';

export const GET = async ({ params, locals: { supabase } }) => {
	const slug = params.slug;
	const { data: project } = await supabase
		.from('projects')
		.select('id')
		.eq('slug', slug)
		.single();
	if (!project) {
		return json({ comments: [] });
	}

	const { data: comments } = await supabase
		.from('project_comments')
		.select('*')
		.eq('project_id', project.id)
		.eq('approved', true)
		.order('created_at', { ascending: false });

	return json({ comments: comments ?? [] });
};

export const POST = async ({ params, request, locals: { supabase } }) => {
	const slug = params.slug;
	const { author_name, author_email, body } = await request.json();

	if (!author_name?.trim() || !body?.trim()) {
		return json({ success: false, error: 'Name and body are required' }, { status: 400 });
	}

	const { data: project } = await supabase
		.from('projects')
		.select('id')
		.eq('slug', slug)
		.single();
	if (!project) {
		return json({ success: false, error: 'Project not found' }, { status: 404 });
	}

	const { data: comment, error } = await supabase
		.from('project_comments')
		.insert({
			project_id: project.id,
			author_name: author_name.trim(),
			author_email: author_email?.trim() || null,
			body: body.trim(),
			approved: true
		})
		.select()
		.single();
	if (error) throw new Error(error.message);

	return json({ success: true, comment }, { status: 201 });
};
