import { json } from '@sveltejs/kit';

export const POST = async ({ params, request, locals: { supabase } }) => {
	const slug = params.slug;
	const { liked } = await request.json();
	const likerId = request.headers.get('x-liker-id');
	if (!likerId) {
		return json({ success: false, error: 'Missing liker ID' }, { status: 400 });
	}

	const { data: post } = await supabase
		.from('blog_posts')
		.select('id')
		.eq('slug', slug)
		.single();
	if (!post) {
		return json({ success: false, error: 'Post not found' }, { status: 404 });
	}

	if (liked) {
		const { error: insertError } = await supabase
			.from('blog_likes')
			.insert({ post_id: post.id, liker_id: likerId });
		if (insertError?.code === '23505') {
			return json({ success: true, liked: true });
		}
		if (insertError) throw new Error(insertError.message);

		await supabase.rpc('increment_blog_like', { post_id: post.id });
	} else {
		await supabase
			.from('blog_likes')
			.delete()
			.eq('post_id', post.id)
			.eq('liker_id', likerId);

		const { count } = await supabase
			.from('blog_likes')
			.select('*', { count: 'exact', head: true })
			.eq('post_id', post.id);

		await supabase
			.from('blog_posts')
			.update({ like_count: count })
			.eq('id', post.id);
	}

	return json({ success: true, liked });
};
