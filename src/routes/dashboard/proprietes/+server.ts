import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { apiUrl } from '$lib/server/api';

function decodeJwtPayload(token: string): Record<string, unknown> | null {
    try {
        const parts = token.split('.');
        if (parts.length < 2) {
            return null;
        }

        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
        const payloadJson = Buffer.from(padded, 'base64').toString('utf8');
        return JSON.parse(payloadJson);
    } catch {
        return null;
    }
}

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

    const payload = decodeJwtPayload(token);
    const ownerId = Number(payload?.id);

    if (!payload || Number.isNaN(ownerId)) {
        return json({ error: 'Token invalide' }, { status: 401 });
    }

    const response = await fetch(apiUrl(`/api/proprietes/${ownerId}`), {
        method: 'GET',
        headers: buildHeaders(request.headers.get('origin'))
    });

    if (!response.ok) {
        return json({ error: 'Impossible de charger les propriétés.' }, { status: response.status });
    }

    const properties = await response.json();
    return json({ properties });
};

export const POST: RequestHandler = async ({ cookies, fetch, request }) => {
    const token = cookies.get('auth_token');
    if (!token) {
        return json({ error: 'Non authentifié' }, { status: 401 });
    }

    const payload = decodeJwtPayload(token);
    const ownerId = Number(payload?.id);

    if (!payload || Number.isNaN(ownerId)) {
        return json({ error: 'Token invalide' }, { status: 401 });
    }

    const body = await request.json();

    const apiResponse = await fetch(apiUrl('/api/proprietes'), {
        method: 'POST',
        headers: buildHeaders(request.headers.get('origin')),
        body: JSON.stringify({
            ...body,
            idProprio: ownerId
        })
    });

    if (!apiResponse.ok) {
        let errorMessage = 'Impossible de créer la propriété.';
        try {
            const errorBody = await apiResponse.text();
            if (errorBody) {
                errorMessage = errorBody;
            }
        } catch {
            // Keep default message.
        }

        return json({ error: errorMessage }, { status: apiResponse.status });
    }

    const createdProperty = await apiResponse.json();
    return json({ property: createdProperty }, { status: 201 });
};
