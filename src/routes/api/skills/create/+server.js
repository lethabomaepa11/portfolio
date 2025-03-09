import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals:{ supabase } }) => {
    const { skill } = await request.json();
    const { data, error } = await supabase
        .from('skills')
        .insert({ ...skill })
        .single();
    if (error) {
        return json({ success: false, error: error.message });
    }
    return json({ success: true, data });
};
