import { json } from '@sveltejs/kit';
//make sure that you console.log every error

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
        const { data: updatedData, error: updateError } = await supabase
        .from('projects')
        .update({ title: project.title,
            description: project.description,
            image: project.image,
            githubUrl: project.githubUrl,
            demoUrl: project.demoUrl,
            technologies: project.technologies.split(',') })
        .eq('id', project.id);
        if (updateError) {
            console.log(updateError)
            return json({ success: false, error: updateError.message });
        }
        return json({ success: true, data: updatedData });
    }
    const { data, error } = await supabase
        .from('projects')
        .update({ title: project.title,
            description: project.description,
            githubUrl: project.githubUrl,
            demoUrl: project.demoUrl,
            case_study: project.case_study,
            technologies: project.technologies.split(',') })
        .eq('id', project.id);
    if (error) {
        console.log(error)
        return json({ success: false, error: error.message });
    }
    return json({ success: true, data });
};