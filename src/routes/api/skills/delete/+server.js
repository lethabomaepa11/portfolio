import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals:{ supabase } }) => {
    const { id } = await request.json();
    const { data, error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);
    if (error) {
        return json({ success: false, error: error.message });
    }
    return json({ success: true });
};
