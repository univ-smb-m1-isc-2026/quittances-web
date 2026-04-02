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
        return json(buildErrorState('Non authentifié'), { status: 401 });
    }

    const ownerId = extractOwnerIdFromToken(token);
    if (ownerId === null) {
        return json(buildErrorState('Token invalide'), { status: 401 });
    }

    // Le backend renvoie { data: Quittance[], state: string }
    const { payload, status } = await proxyApiJson(fetch, `/api/quittances/${ownerId}`, {
        method: 'GET',
        headers: buildApiHeaders(request.headers.get('origin'))
    });

    return json(payload, { status });
};
