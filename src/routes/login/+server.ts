import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { apiUrl } from '$lib/server/api';

export const POST: RequestHandler = async ({ request, cookies, fetch }) => {
    const { email, password } = await request.json();
    const origin = request.headers.get('origin');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };

    // Propagation de l'origine navigateur vers l'API pour passer le filtre backend.
    if (origin) {
        headers.Origin = origin;
    }

    const res = await fetch(apiUrl('/api/proprios/login'), {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
        let errorMessage = 'Erreur de connexion';
        try {
            const errorBody = await res.text();
            if (errorBody) {
                errorMessage = errorBody;
            }
        } catch {
            // On garde le message par defaut.
        }

        return json({ error: errorMessage }, { status: res.status });
    }

    const data = await res.json();

    cookies.set('auth_token', data.token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // ← false en dev HTTP, true en prod HTTPS
        maxAge: 60 * 60 * 24
    });

    return json({ success: true });
};