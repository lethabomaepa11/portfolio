import { json } from '@sveltejs/kit';


export const POST = async ({ request, locals:{ supabase } }) => {
    const { key } = await request.json();
    const {data,error} = await supabase.from("p").select();
    if(data[0].id == key){
        return json({ success: true, key: data[0].id });
    }
    if (error) {
        return json({ success: false, error: error.message });
    }
    else{
        const isKeyValid = data[0].keys.includes(key);
        return json({ success: isKeyValid, key: data[0].id  });
    }
};
