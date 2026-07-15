export const load = async ({ locals: { supabase } }) => {
	const { data: posts, error } = await supabase
		.from('blog_posts')
		.select('*')
		.eq('published', true)
		.order('created_at', { ascending: false });
	if (error) throw new Error(error.message);
	return { posts: posts ?? [] };
};
