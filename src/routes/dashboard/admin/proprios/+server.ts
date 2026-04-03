import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import {
    buildApiHeaders,
    buildErrorState,
    extractAdminFromToken,
    getAuthToken,
    proxyApiJson
} from '$lib/server/route-utils';

function requireAdmin(cookies: Parameters<RequestHandler>[0]['cookies']): Response | null {
    const token = getAuthToken(cookies);
    if (!token) {
        return json(buildErrorState('Non authentifie'), { status: 401 });
    }

    if (!extractAdminFromToken(token)) {
        return json(buildErrorState('Acces reserve aux administrateurs'), { status: 403 });
    }

    return null;
}

export const PUT: RequestHandler = async ({ cookies, fetch, request }) => {
    const authError = requireAdmin(cookies);
    if (authError) {
        return authError;
    }

    const body = await request.json();
    const proprioId = Number(body?.id);

    if (!proprioId) {
        return json(buildErrorState('Identifiant de proprio manquant'), { status: 400 });
    }

    const payloadBody = {
        nom: body?.nom,
        prenom: body?.prenom,
        email: body?.email,
        telephone: body?.telephone,
        password: body?.password
    };

    const { payload, status } = await proxyApiJson(fetch, `/api/proprios/${proprioId}`, {
        method: 'PUT',
        headers: buildApiHeaders(request.headers.get('origin')),
        body: JSON.stringify(payloadBody)
    });

    return json(payload, { status });
};

export const DELETE: RequestHandler = async ({ cookies, fetch, request }) => {
    const authError = requireAdmin(cookies);
    if (authError) {
        return authError;
    }

    const body = await request.json();
    const proprioId = Number(body?.id);

    if (!proprioId) {
        return json(buildErrorState('Identifiant de proprio manquant'), { status: 400 });
    }

    const { payload, status } = await proxyApiJson(fetch, `/api/proprios/${proprioId}`, {
        method: 'DELETE',
        headers: buildApiHeaders(request.headers.get('origin'))
    });

    return json(payload, { status });
};
