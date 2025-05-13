export const load = async ({locals: {supabase}}) => {
    const {data: projects, error} = await supabase.from('projects').select('*').order('created_at', {ascending: true});
    if (error) throw new Error(error);
    return {projects};
}