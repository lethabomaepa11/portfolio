import { json } from '@sveltejs/kit';

export const GET = async ({ locals:{ supabase } }) => {
    const { data: info, infoError } = await supabase
        .from('info')
        .select('*')
        .eq('id', 1);
    if (infoError) {
        return json({ success: false, error: infoError });
    }
    const { data: skills,skillsError } = await supabase
        .from('skills')
        .select('*');
    if (skillsError) {
        return json({ success: false, error: skillsError });
    }    
    const {data: projects, error} = await supabase.from('projects').select('*').order('created_at', {ascending: true});


    
    return json({ success: true, info: info[0], skills: skills, projects });
};