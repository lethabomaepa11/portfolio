import { GROQ_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

export const GET = async({fetch}) => {
    const response = await fetch( "https://api.groq.com/openai/v1/models",{
                headers:{ 
                    "Authorization": `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                }
            })
    const models = await response.json();
    return json({models, success: true})
}