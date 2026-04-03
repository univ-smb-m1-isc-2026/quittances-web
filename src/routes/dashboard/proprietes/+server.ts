import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import {
    buildErrorState,
    proxyApiJson
} from '$lib/server/route-utils';
import { requireOwnerContext } from '$lib/server/owner-context';

export const GET: RequestHandler = async ({ cookies, fetch, request }) => {
    const ownerContext = requireOwnerContext(cookies, request.headers.get('origin'));
    if (ownerContext instanceof Response) return ownerContext;
    const { ownerId, headers } = ownerContext;

    const { payload, status } = await proxyApiJson(fetch, `/api/proprietes/${ownerId}`, {
        method: 'GET',
        headers
    });

    return json(payload, { status });
};

export const POST: RequestHandler = async ({ cookies, fetch, request }) => {
    const ownerContext = requireOwnerContext(cookies, request.headers.get('origin'));
    if (ownerContext instanceof Response) return ownerContext;
    const { ownerId, headers } = ownerContext;

    const body = await request.json();

    const { payload, status } = await proxyApiJson(fetch, '/api/proprietes', {
        method: 'POST',
        headers,
        body: JSON.stringify({
            ...body,
            idProprio: ownerId
        })
    });

    return json(payload, { status });
};

export const PUT: RequestHandler = async ({ cookies, fetch, request }) => {
    const ownerContext = requireOwnerContext(cookies, request.headers.get('origin'));
    if (ownerContext instanceof Response) return ownerContext;
    const { ownerId, headers } = ownerContext;

    const body = await request.json();
    const propertyId = Number(body?.id);

    if (!propertyId) {
        return json(buildErrorState('Identifiant de propriete manquant'), { status: 400 });
    }

    const rest = { ...body };
    delete rest.id;

    const { payload, status } = await proxyApiJson(fetch, `/api/proprietes/${propertyId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
            ...rest,
            idProprio: ownerId
        })
    });

    return json(payload, { status });
};

export const DELETE: RequestHandler = async ({ cookies, fetch, request }) => {
    const ownerContext = requireOwnerContext(cookies, request.headers.get('origin'));
    if (ownerContext instanceof Response) return ownerContext;
    const { headers } = ownerContext;

    const body = await request.json();
    const propertyId = Number(body?.id);

    if (!propertyId) {
        return json(buildErrorState('Identifiant de propriete manquant'), { status: 400 });
    }

    const { payload, status } = await proxyApiJson(fetch, `/api/proprietes/${propertyId}`, {
        method: 'DELETE',
        headers
    });

    return json(payload, { status });
};
