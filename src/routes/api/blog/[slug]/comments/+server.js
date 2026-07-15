import { json } from '@sveltejs/kit';

export const GET = async ({ params, locals: { supabase } }) => {
	const slug = params.slug;
	const { data: post } = await supabase
		.from('blog_posts')
		.select('id')
		.eq('slug', slug)
		.single();
	if (!post) {
		return json({ comments: [] });
	}

	const { data: comments } = await supabase
		.from('blog_comments')
		.select('*')
		.eq('post_id', post.id)
		.order('created_at', { ascending: false });

	return json({ comments: comments ?? [] });
};

export const POST = async ({ params, request, locals: { supabase } }) => {
	const slug = params.slug;
	const { author_name, author_email, body } = await request.json();

	if (!author_name?.trim() || !body?.trim()) {
		return json({ success: false, error: 'Name and body are required' }, { status: 400 });
	}

	const { data: post } = await supabase
		.from('blog_posts')
		.select('id')
		.eq('slug', slug)
		.single();
	if (!post) {
		return json({ success: false, error: 'Post not found' }, { status: 404 });
	}

	const { data: comment, error } = await supabase
		.from('blog_comments')
		.insert({
			post_id: post.id,
			author_name: author_name.trim(),
			author_email: author_email?.trim() || null,
			body: body.trim()
		})
		.select()
		.single();
	if (error) throw new Error(error.message);

	const { count } = await supabase
		.from('blog_comments')
		.select('*', { count: 'exact', head: true })
		.eq('post_id', post.id);

	await supabase
		.from('blog_posts')
		.update({ comment_count: count })
		.eq('id', post.id);

	return json({ success: true, comment }, { status: 201 });
};
