import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import {
    proxyApiJson
} from '$lib/server/route-utils';
import { requireOwnerContext } from '$lib/server/owner-context';

type Proprio = {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
};

type ApiEnvelope<T> = {
    data: T;
    state: string;
};

export const GET: RequestHandler = async ({ cookies, fetch, request }) => {
    const ownerContext = requireOwnerContext(cookies, request.headers.get('origin'));
    if (ownerContext instanceof Response) return ownerContext;
    const { ownerId, headers } = ownerContext;

    const { payload, status } = await proxyApiJson(fetch, '/api/proprios', {
        method: 'GET',
        headers
    });

    if (status >= 400) {
        return json(payload, { status });
    }

    const envelope = payload as ApiEnvelope<Proprio[] | null>;
    const proprios = Array.isArray(envelope?.data) ? envelope.data : [];
    const currentProprio = proprios.find((proprio) => Number(proprio.id) === ownerId) ?? null;

    return json(
        {
            data: currentProprio,
            state: currentProprio ? '[SUCCESS]' : '[INFO] Proprio introuvable'
        },
        { status: currentProprio ? 200 : 404 }
    );
};
