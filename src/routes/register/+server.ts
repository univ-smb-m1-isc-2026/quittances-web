import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { apiUrl } from '$lib/server/api';

export const POST: RequestHandler = async ({ request, cookies, fetch }) => {
    const { nom, prenom, email, telephone, password } = await request.json();
    const cleanedPhone = String(telephone ?? '').replace(/\D/g, '');

    if (!nom || !prenom || !email || !password || !cleanedPhone) {
        return json({ error: 'Champs manquants pour créer le compte.' }, { status: 400 });
    }

    if (cleanedPhone.length !== 10) {
        return json({ error: 'Le numéro de téléphone doit contenir 10 chiffres.' }, { status: 400 });
    }
    const origin = request.headers.get('origin');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };

    // Forward browser origin so backend origin filter allows server-side requests.
    if (origin) {
        headers.Origin = origin;
    }

    const createRes = await fetch(apiUrl('/api/proprios'), {
        method: 'POST',
        headers,
        body: JSON.stringify({ nom, prenom, email, telephone: cleanedPhone, password })
    });

    if (!createRes.ok) {
        let errorMessage = 'Impossible de créer le compte pour le moment.';
        try {
            const errorBody = await createRes.text();
            if (errorBody) {
                errorMessage = errorBody;
            }
        } catch {
            // Keep default message.
        }

        return json({ error: errorMessage }, { status: createRes.status });
    }

    const loginRes = await fetch(apiUrl('/api/proprios/login'), {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password })
    });

    if (!loginRes.ok) {
        return json(
            { error: 'Compte créé, mais la connexion automatique a échoué.' },
            { status: loginRes.status }
        );
    }

    const data = await loginRes.json();

    cookies.set('auth_token', data.token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 60 * 60 * 24
    });

    return json({ success: true });
};