import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { apiUrl } from '$lib/server/api';

function buildHeaders(origin: string | null): Record<string, string> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };

    if (origin) {
        headers.Origin = origin;
    }

    return headers;
}

export const GET: RequestHandler = async ({ cookies, fetch, request }) => {
    const token = cookies.get('auth_token');
    if (!token) {
        return json({ error: 'Non authentifié' }, { status: 401 });
    }

    const response = await fetch(apiUrl('/api/locataires'), {
        method: 'GET',
        headers: buildHeaders(request.headers.get('origin'))
    });

    if (!response.ok) {
        return json({ error: 'Impossible de charger les locataires.' }, { status: response.status });
    }

    const locataires = await response.json();
    return json({ locataires });
};

export const POST: RequestHandler = async ({ cookies, fetch, request }) => {
    const token = cookies.get('auth_token');
    if (!token) {
        return json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = await request.json();

    const response = await fetch(apiUrl('/api/locataires'), {
        method: 'POST',
        headers: buildHeaders(request.headers.get('origin')),
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        let errorMessage = 'Impossible de créer le locataire.';
        try {
            const errorBody = await response.text();
            if (errorBody) {
                errorMessage = errorBody;
            }
        } catch {
            // Keep default message.
        }

        return json({ error: errorMessage }, { status: response.status });
    }

    const locataire = await response.json();
    return json({ locataire }, { status: 201 });
};
