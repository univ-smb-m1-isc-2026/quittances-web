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

export const DELETE: RequestHandler = async ({ cookies, fetch, request, params }) => {
    const authError = requireAdmin(cookies);
    if (authError) {
        return authError;
    }

    const proprioId = Number(params.id);
    if (!proprioId) {
        return json(buildErrorState('Identifiant de proprio manquant'), { status: 400 });
    }

    const force = new URL(request.url).searchParams.get('force') === 'true';

    const backendPath = force ? `/api/proprios/${proprioId}?force=true` : `/api/proprios/${proprioId}`;

    const { payload, status } = await proxyApiJson(fetch, backendPath, {
        method: 'DELETE',
        headers: buildApiHeaders(request.headers.get('origin'))
    });

    return json(payload, { status });
};
