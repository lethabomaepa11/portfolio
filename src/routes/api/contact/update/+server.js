import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals:{ supabase } }) => {
    const { contactInfo } = await request.json();
    const { data, error } = await supabase
        .from('contact')
        .update({ email: contactInfo.email, phone: contactInfo.phone, socials: contactInfo.socials })
        .eq('id', 1);
    if (error) {
        return json({ success: false, error: error.message });
    }
    return json({ success: true });
};