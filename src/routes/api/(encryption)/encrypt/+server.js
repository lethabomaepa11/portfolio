import { encrypt } from '$lib'
import { json } from '@sveltejs/kit';

export const POST = async({request, getClientAddress}) => {

    try{
        const {text} = await request.json();
        const encrypted = encrypt(text);
        return json({success: true, status: 200, data: encrypted});
    }catch(e){
        return json({success: false, status: 500,data: e});
    }
    
}