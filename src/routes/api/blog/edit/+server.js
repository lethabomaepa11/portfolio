import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals: { supabase } }) => {
	const form = await request.formData();
	const id = form.get('id');
	const title = form.get('title');
	const slug = form.get('slug');
	const excerpt = form.get('excerpt');
	const content = form.get('content');
	const cover_image = form.get('cover_image');
	const cover_image_file = form.get('cover_image_file');
	const tags = form.get('tags');
	const published = form.get('published') === 'true';

	if (!id || !title || !slug || !content) {
		return json({ success: false, error: 'ID, title, slug, and content are required' }, { status: 400 });
	}

	let coverImageUrl = cover_image || null;

	if (cover_image_file instanceof File && cover_image_file.size > 0) {
		const ext = cover_image_file.name.split('.').pop() || 'png';
		const filePath = `blog/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
		const { data: uploadData, error: uploadError } = await supabase.storage
			.from('files')
			.upload(filePath, cover_image_file, {
				cacheControl: '3600',
				upsert: false
			});

		if (uploadError) {
			console.error('Cover upload error:', uploadError);
		} else {
			const { data: { publicUrl } } = supabase.storage.from('files').getPublicUrl(filePath);
			coverImageUrl = publicUrl;
		}
	}

	const { error } = await supabase
		.from('blog_posts')
		.update({
			title,
			slug,
			excerpt: excerpt || null,
			content,
			cover_image: coverImageUrl,
			tags: tags ? tags.split(',').map((t) => t.trim()) : [],
			published,
			updated_at: new Date().toISOString()
		})
		.eq('id', id);

	if (error) {
		if (error.code === '23505') {
			return json({ success: false, error: 'A post with this slug already exists' }, { status: 409 });
		}
		throw new Error(error.message);
	}

	return json({ success: true });
};
