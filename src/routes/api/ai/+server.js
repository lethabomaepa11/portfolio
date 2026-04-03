import Groq from 'groq-sdk';
import { GROQ_API_KEY } from '$env/static/private';
import { json, error } from '@sveltejs/kit';
import { rateLimit } from '$lib/rateLimiter.js';
import { decrypt } from '$lib';

const SYSTEM_PROMPT = `You are Ask AI for Lethabo Maepa's portfolio.
You help recruiters and potential clients evaluate fit quickly.
Guidelines:
- Be accurate, concise, and professional.
- Prefer structured outputs (short bullets or short sections).
- Highlight relevant projects, skills, experience, pricing, and contact paths.
- If the question requests recommendation, explain why briefly.
- Never invent unavailable data.`;

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

        let { message } = data;

        const candidateModels = [
            "llama-3.3-70b-versatile",
            "openai/gpt-oss-120b",
            "llama-3.1-8b-instant"
        ];
        //decrypt the message
        message = decrypt(message);
        // Validate inputs
        if (!message?.trim() || typeof message !== 'string') {
            throw error(400, 'Message is required');
        }
        if (message.length > 12000) {
            throw error(400, 'Message is too long');
        }
    
        
        // Process request
        const groq = new Groq({ apiKey: GROQ_API_KEY });
        let completion = null;
        let selectedModel = null;

        for (const model of candidateModels) {
            try {
                completion = await groq.chat.completions.create({
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
                        {
                            role: 'user',
                            content: message,
                        }
                    ],
                    model,
                    temperature: 0.4,
                    max_tokens: 700,
                });
                selectedModel = model;
                if (completion?.choices?.[0]?.message?.content) break;
            } catch (modelError) {
                console.warn(`Model fallback triggered for ${model}:`, modelError?.message || modelError);
            }
        }

        // Validate response
        if (!completion?.choices?.[0]?.message?.content) {
            throw error(500, 'Invalid response from AI provider');
        }
        return json({
            success: true,
            response: completion.choices[0].message.content,
            model: selectedModel,
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
