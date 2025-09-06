import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals:{ supabase } }) => {
    const formData = await request.formData();
    const project = Object.fromEntries(formData.entries());
    if(project.image instanceof File) {
        const { data, error } = await supabase
        .storage
        .from('files')
        .update(`/projects/${Date.now()}.${project.image.name.substring(project.image.name.lastIndexOf('.') + 1)}`, project.image, {
            cacheControl: '3600',
            upsert: false
        })

        if(error) {
            console.log(error)
        }

        project.image = `https://hhzlebpsqquwvkfdilvn.supabase.co/storage/v1/object/public/files/${data.path}`;
    }

    const slug = project.title
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');

    const { data, error } = await supabase
        .from('projects')
        .insert({
            title: project.title,
            slug: slug,
            description: project.description,
            image: project.image,
            githubUrl: project.githubUrl,
            demoUrl: project.demoUrl,
            technologies: project.technologies.split(','),
            case_study: project.case_study
        })
        .single();
    if (error) {
        console.log(error)
        return json({ success: false, error: error.message });
    }
    return json({ success: true, data });
};