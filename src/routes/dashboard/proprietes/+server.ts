import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import {
    buildApiHeaders,
    buildErrorState,
    extractOwnerIdFromToken,
    getAuthToken,
    proxyApiJson
} from '$lib/server/route-utils';

export const GET: RequestHandler = async ({ cookies, fetch, request }) => {
    const token = getAuthToken(cookies);
    if (!token) {
        return json(buildErrorState('Non authentifie'), { status: 401 });
    }

    const ownerId = extractOwnerIdFromToken(token);
    if (ownerId === null) {
        return json(buildErrorState('Token invalide'), { status: 401 });
    }

    const { payload, status } = await proxyApiJson(fetch, `/api/proprietes/${ownerId}`, {
        method: 'GET',
        headers: buildApiHeaders(request.headers.get('origin'))
    });

    return json(payload, { status });
};

export const POST: RequestHandler = async ({ cookies, fetch, request }) => {
    const token = getAuthToken(cookies);
    if (!token) {
        return json(buildErrorState('Non authentifie'), { status: 401 });
    }

    const ownerId = extractOwnerIdFromToken(token);
    if (ownerId === null) {
        return json(buildErrorState('Token invalide'), { status: 401 });
    }

    const body = await request.json();

    const { payload, status } = await proxyApiJson(fetch, '/api/proprietes', {
        method: 'POST',
        headers: buildApiHeaders(request.headers.get('origin')),
        body: JSON.stringify({
            ...body,
            idProprio: ownerId
        })
    });

    return json(payload, { status });
};

export const PUT: RequestHandler = async ({ cookies, fetch, request }) => {
    const token = getAuthToken(cookies);
    if (!token) {
        return json(buildErrorState('Non authentifie'), { status: 401 });
    }

    const ownerId = extractOwnerIdFromToken(token);
    if (ownerId === null) {
        return json(buildErrorState('Token invalide'), { status: 401 });
    }

    const body = await request.json();
    const propertyId = Number(body?.id);

    if (!propertyId) {
        return json(buildErrorState('Identifiant de propriete manquant'), { status: 400 });
    }

    const rest = { ...body };
    delete rest.id;

    const { payload, status } = await proxyApiJson(fetch, `/api/proprietes/${propertyId}`, {
        method: 'PUT',
        headers: buildApiHeaders(request.headers.get('origin')),
        body: JSON.stringify({
            ...rest,
            idProprio: ownerId
        })
    });

    return json(payload, { status });
};
