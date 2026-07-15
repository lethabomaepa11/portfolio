export const load = async ({ params, locals: { supabase } }) => {
	const { data: post, error } = await supabase
		.from('blog_posts')
		.select('*')
		.eq('slug', params.slug)
		.eq('published', true)
		.single();
	if (error || !post) throw new Error('Post not found');
	return { post };
};
