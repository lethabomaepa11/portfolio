import { json } from '@sveltejs/kit';

export const GET = async ({ locals: { supabase } }) => {
	const { data: posts, error } = await supabase
		.from('blog_posts')
		.select('*')
		.order('created_at', { ascending: false });
	if (error) throw new Error(error.message);
	return json({ posts: posts ?? [] });
};
