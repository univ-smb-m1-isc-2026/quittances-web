import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import {
    buildApiHeaders,
    buildErrorState,
    extractOwnerIdFromToken,
    getAuthToken,
    proxyApiJson
} from '$lib/server/route-utils';

type UpdateQuittanceBody = {
    statut?: string;
    paymentDate?: string;
    signatureCity?: string;
    signatureImage?: string | null;
};

export const PUT: RequestHandler = async ({ params, cookies, fetch, request }) => {
    const token = getAuthToken(cookies);
    if (!token) {
        return json(buildErrorState('Non authentifie'), { status: 401 });
    }

    const ownerId = extractOwnerIdFromToken(token);
    if (ownerId === null) {
        return json(buildErrorState('Token invalide'), { status: 401 });
    }

    const quittanceId = Number(params.id);
    if (Number.isNaN(quittanceId) || quittanceId <= 0) {
        return json(buildErrorState('Identifiant de quittance invalide'), { status: 400 });
    }

    const body = (await request.json()) as UpdateQuittanceBody;
    if (!body.statut && !body.paymentDate && !body.signatureCity && body.signatureImage === undefined) {
        return json(buildErrorState('Aucune mise a jour fournie'), { status: 400 });
    }

    const { payload, status } = await proxyApiJson(fetch, `/api/quittances/${quittanceId}`, {
        method: 'PUT',
        headers: buildApiHeaders(request.headers.get('origin')),
        body: JSON.stringify({
            statut: body.statut,
            paymentDate: body.paymentDate,
            signatureCity: body.signatureCity,
            signatureImage: body.signatureImage
        })
    });

    return json(payload, { status });
};
