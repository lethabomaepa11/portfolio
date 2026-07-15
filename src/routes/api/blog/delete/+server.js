import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals: { supabase } }) => {
	const { id } = await request.json();
	if (!id) {
		return json({ success: false, error: 'ID is required' }, { status: 400 });
	}

	const { error } = await supabase.from('blog_posts').delete().eq('id', id);
	if (error) throw new Error(error.message);

	return json({ success: true });
};
