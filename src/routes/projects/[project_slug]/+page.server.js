export const load = async ({params, locals: {supabase}}) => {
    let project_slug =  params.project_slug;
    const { data: project, error } = await supabase.from('projects').select('*').eq('slug', project_slug);
    if (error) console.log(error);
    return {project: project[0]};
}