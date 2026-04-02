import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import {
    proxyApiJson
} from '$lib/server/route-utils';
import { requireOwnerContext } from '$lib/server/owner-context';

export const GET: RequestHandler = async ({ cookies, fetch, request }) => {
    const ownerContext = requireOwnerContext(cookies, request.headers.get('origin'));
    if (ownerContext instanceof Response) return ownerContext;
    const { ownerId, headers } = ownerContext;

    // Le backend renvoie { data: Quittance[], state: string }
    const { payload, status } = await proxyApiJson(fetch, `/api/quittances/${ownerId}`, {
        method: 'GET',
        headers
    });

    return json(payload, { status });
};
