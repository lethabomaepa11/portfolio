import Groq from 'groq-sdk';
import { GROQ_API_KEY } from '$env/static/private';
import { json, error } from '@sveltejs/kit';
import { rateLimit } from '$lib/rateLimiter.js';



const RATE_LIMIT_CONFIG = {
    requests: 10,
    windowMinutes: 1
};

export const POST = async ({ request, getClientAddress}) => {
    try {
        // Rate limiting
        const clientIP = getClientAddress();
        if (!rateLimit(clientIP, RATE_LIMIT_CONFIG)) {
            throw error(429, 'Too many requests');
        }

        // Validate environment
        if (!GROQ_API_KEY) {
            throw error(500, 'Server configuration error');
        }

        // Parse and validate request
        let data;
        try {
            data = await request.json();
        } catch (e) {
            throw error(400, 'Invalid JSON payload');
        }

        const { message, model } = data;
        // Validate inputs
        if (!message?.trim() || typeof message !== 'string') {
            throw error(400, 'Message is required');
        }
    
        
        // Process request
        const groq = new Groq({ apiKey: GROQ_API_KEY });
        const completion = await groq.chat.completions.create({
            messages: [{
                role: 'user',
                content: message,
            }],
            model: model,
            temperature: 1,
            max_tokens: 512,
        });

        // Validate response
        if (!completion?.choices?.[0]?.message?.content) {
            throw error(500, 'Invalid response from AI provider');
        }
        return json({
            success: true,
            response: completion.choices[0].message.content,
            usage: completion.usage,
            model: model
        });

    } catch (err) {
        console.error('API Error:', err);
        
        // Handle known error types
        if (err.status && err.body) {
            return json(
                { success: false, error: err.body },
                { status: err.status }
            );
        }
        
        // Generic server error
        return json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
};