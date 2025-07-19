import { decrypt } from '$lib'
import { json } from '@sveltejs/kit';

export const POST = async({request, getClientAddress}) => {

    try{
        const {cipherText} = await request.json();
        const decrypted = decrypt(cipherText);
        return json({success: true, status: 200, data: decrypted});
    }catch(e){
        return json({success: false, status: 500,data: e});
    }
    
}