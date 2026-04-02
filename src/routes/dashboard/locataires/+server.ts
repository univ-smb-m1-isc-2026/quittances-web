import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { buildApiHeaders, buildErrorState, getAuthToken, proxyApiJson } from '$lib/server/route-utils';

export const GET: RequestHandler = async ({ cookies, fetch, request }) => {
    const token = getAuthToken(cookies);
    if (!token) {
        return json(buildErrorState('Non authentifie'), { status: 401 });
    }

    const { payload, status } = await proxyApiJson(fetch, '/api/locataires', {
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

    const body = await request.json();

    const { payload, status } = await proxyApiJson(fetch, '/api/locataires', {
        method: 'POST',
        headers: buildApiHeaders(request.headers.get('origin')),
        body: JSON.stringify(body)
    });

    return json(payload, { status });
};
