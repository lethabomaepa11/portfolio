import Groq from 'groq-sdk';
import { GROQ_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
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

const STATIC_FALLBACK_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];
const PREFERRED_MODELS = [
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
    'openai/gpt-oss-120b'
];
const REQUEST_TIMEOUT_MS = 25000;
const MAX_MESSAGE_CHARS = 12000;
const HARD_MAX_MESSAGE_CHARS = 35000;

const withTimeout = (promise, timeoutMs = REQUEST_TIMEOUT_MS) =>
    Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`AI provider timeout after ${timeoutMs}ms`)), timeoutMs)
        )
    ]);

const resolveClientIP = (request, getClientAddress) => {
    try {
        const directIP = getClientAddress?.();
        if (directIP?.trim()) return directIP.trim();
    } catch {
        // Fallback to headers when adapter cannot resolve address directly
    }

    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor?.trim()) {
        return forwardedFor.split(',')[0].trim();
    }

    const realIP = request.headers.get('x-real-ip');
    if (realIP?.trim()) return realIP.trim();

    return 'unknown';
};

const parseIncomingMessage = async (request) => {
    let payload;
    try {
        payload = await request.json();
    } catch {
        return { error: 'Invalid JSON payload', status: 400 };
    }

    const rawMessage = payload?.message;
    if (typeof rawMessage !== 'string' || !rawMessage.trim()) {
        return { error: 'Message is required', status: 400 };
    }

    let decryptedMessage = '';
    try {
        decryptedMessage = decrypt(rawMessage);
    } catch {
        decryptedMessage = '';
    }

    // Accept encrypted payload first; fallback to plaintext payload for compatibility.
    const finalMessage = (decryptedMessage?.trim() ? decryptedMessage : rawMessage).trim();

    if (!finalMessage) {
        return { error: 'Message is required', status: 400 };
    }

    if (finalMessage.length > HARD_MAX_MESSAGE_CHARS) {
        return {
            error: `Message is too long. Keep it under ${HARD_MAX_MESSAGE_CHARS} characters.`,
            status: 400
        };
    }

    if (finalMessage.length <= MAX_MESSAGE_CHARS) {
        return { message: finalMessage };
    }

    // Auto-trim oversized payloads instead of failing.
    const head = finalMessage.slice(0, 7600);
    const tail = finalMessage.slice(-3000);
    const trimmedMessage =
        `${head}\n...[message truncated for token safety]...\n${tail}`.trim();

    return { message: trimmedMessage };
};

const resolveCandidateModels = async (apiKey) => {
    try {
        const response = await withTimeout(
            fetch('https://api.groq.com/openai/v1/models', {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }),
            12000
        );

        if (!response.ok) {
            return STATIC_FALLBACK_MODELS;
        }

        const payload = await response.json();
        const availableModels = (payload?.data ?? [])
            .map((model) => model?.id)
            .filter((id) => typeof id === 'string' && id.length > 0);

        if (!availableModels.length) {
            return STATIC_FALLBACK_MODELS;
        }

        const prioritized = [
            ...PREFERRED_MODELS.filter((id) => availableModels.includes(id)),
            ...availableModels.filter((id) => !PREFERRED_MODELS.includes(id)).slice(0, 3)
        ];

        return prioritized.length ? prioritized : STATIC_FALLBACK_MODELS;
    } catch {
        return STATIC_FALLBACK_MODELS;
    }
};

const toClientError = (err) => {
    const status = Number(err?.status) || Number(err?.statusCode) || 500;
    const message =
        err?.error?.message ||
        err?.body?.error?.message ||
        err?.message ||
        'Internal server error';

    return {
        status: Number.isFinite(status) && status >= 100 ? status : 500,
        message
    };
};

export const POST = async ({ request, getClientAddress }) => {
    try {
        const apiKey = GROQ_API_KEY?.trim();
        if (!apiKey) {
            return json(
                { success: false, error: 'Server configuration error: missing GROQ_API_KEY' },
                { status: 500 }
            );
        }

        const clientIP = resolveClientIP(request, getClientAddress);
        if (!rateLimit(clientIP, RATE_LIMIT_CONFIG)) {
            return json(
                { success: false, error: 'Too many requests. Please wait a minute and try again.' },
                { status: 429 }
            );
        }

        const parsed = await parseIncomingMessage(request);
        if (parsed.error) {
            return json({ success: false, error: parsed.error }, { status: parsed.status });
        }
        const message = parsed.message;

        const groq = new Groq({ apiKey });
        const candidateModels = await resolveCandidateModels(apiKey);

        let completion = null;
        let selectedModel = null;
        const providerErrors = [];

        for (const model of candidateModels) {
            try {
                completion = await withTimeout(
                    groq.chat.completions.create({
                        messages: [
                            { role: 'system', content: SYSTEM_PROMPT },
                            { role: 'user', content: message }
                        ],
                        model,
                        temperature: 0.4,
                        max_tokens: 700
                    })
                );
                selectedModel = model;
                if (completion?.choices?.[0]?.message?.content?.trim()) break;
            } catch (modelError) {
                providerErrors.push({
                    model,
                    message:
                        modelError?.error?.message ||
                        modelError?.body?.error?.message ||
                        modelError?.message ||
                        'Provider request failed'
                });
            }
        }

        const answer = completion?.choices?.[0]?.message?.content?.trim();
        if (!answer) {
            return json(
                {
                    success: false,
                    error: 'AI provider did not return a valid response.',
                    details: providerErrors
                },
                { status: 502 }
            );
        }

        return json({
            success: true,
            response: answer,
            model: selectedModel
        });
    } catch (err) {
        console.error('API Error:', err);
        const mapped = toClientError(err);
        return json({ success: false, error: mapped.message }, { status: mapped.status });
    }
};
