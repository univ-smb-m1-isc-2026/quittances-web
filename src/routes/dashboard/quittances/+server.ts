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

    // Le backend renvoie { data: Quittance[], state: string }
    const { payload, status } = await proxyApiJson(fetch, `/api/quittances/${ownerId}`, {
        method: 'GET',
        headers
    });

    return json(payload, { status });
};

type CreateQuittanceBody = {
    proprieteId?: number;
    locataireId?: number;
    period?: string;
    paymentDate?: string;
    signatureCity?: string;
    signatureImage?: string | null;
    statut?: string;
};

export const POST: RequestHandler = async ({ cookies, fetch, request }) => {
    const ownerContext = requireOwnerContext(cookies, request.headers.get('origin'));
    if (ownerContext instanceof Response) return ownerContext;
    const { ownerId, headers } = ownerContext;

    const body = (await request.json()) as CreateQuittanceBody;

    if (!body.proprieteId || !body.locataireId || !body.period) {
        return json(buildErrorState('proprieteId, locataireId et period sont requis'), { status: 400 });
    }

    const apiBody = {
        proprio: { id: ownerId },
        locataire: { id: Number(body.locataireId) },
        propriete: { id: Number(body.proprieteId) },
        period: String(body.period),
        paymentDate: body.paymentDate,
        signatureCity: body.signatureCity,
        signatureImage: body.signatureImage ?? null,
        statut: body.statut
    };

    const { payload, status } = await proxyApiJson(fetch, '/api/quittances', {
        method: 'POST',
        headers,
        body: JSON.stringify(apiBody)
    });

    return json(payload, { status });
};
