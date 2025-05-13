export const load = async ({params, locals: {supabase}}) => {
    let project_slug =  params.project_slug;
    const { data: project, error } = await supabase.from('projects').select('*').eq('slug', project_slug).single();
    if (error) throw new Error(error);
    return {project};
}