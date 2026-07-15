import { json } from '@sveltejs/kit';

export const POST = async ({ params, locals: { supabase } }) => {
	const slug = params.slug;
	const { data: post } = await supabase
		.from('blog_posts')
		.select('id')
		.eq('slug', slug)
		.single();

	if (!post) {
		return json({ success: false, error: 'Post not found' }, { status: 404 });
	}

	const { error } = await supabase.rpc('increment_blog_view', { post_id: post.id });
	if (error) {
		const { error: updateError } = await supabase
			.from('blog_posts')
			.update({ view_count: supabase.rpc('increment', { x: 1 }) })
			.eq('id', post.id);
		if (updateError) {
			await supabase
				.from('blog_posts')
				.update({ view_count: 0 })
				.eq('id', post.id);
		}
	}

	return json({ success: true });
};
