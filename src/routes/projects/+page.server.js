export const load = async ({locals: {supabase}}) => {
    const {data: projects, error} = await supabase.from('projects').select('*').order('created_at', {ascending: false});
    if (error) throw new Error(error);
    const { data: infoData, error: infoError } = await supabase
        .from('info')
        .select('github')
        .eq('id', 1)
        .maybeSingle();
    if (infoError) throw new Error(infoError.message);
    return { projects, info: infoData ?? {} };
}
