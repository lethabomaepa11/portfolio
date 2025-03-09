
import { json } from '@sveltejs/kit';
import { isConstructorDeclaration } from 'typescript';

export const POST = async ({ request, locals:{ supabase } }) => {
    const formData = await request.formData();
    const aboutInfo = Object.fromEntries(formData.entries());

    if(aboutInfo.resume instanceof File) {
        console.log(aboutInfo.resume)
        const { data, error } = await supabase
        .storage
        .from('files')
        .update('resume.pdf', aboutInfo.resume, {
            cacheControl: '3600',
            upsert: false
        })

        if(error) {
            console.log(error)
        }

        aboutInfo.resume = `https://hhzlebpsqquwvkfdilvn.supabase.co/storage/v1/object/public/files/${data.path}`;

        const { data:info } = await supabase
        .from('info')
        .update({ about: aboutInfo.about, headline: aboutInfo.headline, resume: aboutInfo.resume })
        .eq('id', 1).select();

        if (error) {
            console.log(error);
            return { success: false, error: error.message };
        }
    } else {
        const { data:info, error } = await supabase
        .from('info')
        .update({ about: aboutInfo.about, headline: aboutInfo.headline })
        .eq('id', 1).select();
        if (error) {
            console.log(error);
            return { success: false, error: error.message };
        }
    }
    return json({ success: true });
};