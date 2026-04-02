import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { type ApiEnvelope, buildApiHeaders, proxyApiJson, setAuthCookie } from '$lib/server/route-utils';

export const POST: RequestHandler = async ({ request, cookies, fetch }) => {
    const { nom, prenom, email, telephone, password } = await request.json();
    const cleanedPhone = String(telephone ?? '').replace(/\D/g, '');

    if (!nom || !prenom || !email || !password || !cleanedPhone) {
        return json({ data: null, state: '[ERROR] Champs manquants pour creer le compte.' }, {
            status: 400
        });
    }

    if (cleanedPhone.length !== 10) {
        return json({ data: null, state: '[ERROR] Le numero de telephone doit contenir 10 chiffres.' }, { status: 400 });
    }

    const headers = buildApiHeaders(request.headers.get('origin'));

    const { payload: createRawPayload, status: createStatus } = await proxyApiJson(fetch, '/api/proprios', {
        method: 'POST',
        headers,
        body: JSON.stringify({ nom, prenom, email, telephone: cleanedPhone, password })
    });

    const createPayload = createRawPayload as ApiEnvelope<Record<string, unknown> | null>;
    if (createStatus < 200 || createStatus >= 300) {
        return json(createPayload, { status: createStatus });
    }

    const { payload: loginRawPayload, status: loginStatus } = await proxyApiJson(fetch, '/api/proprios/login', {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password })
    });

    const loginPayload = loginRawPayload as ApiEnvelope<{ token?: string } | null>;
    if (loginStatus >= 200 && loginStatus < 300 && loginPayload?.data?.token) {
        setAuthCookie(cookies, loginPayload.data.token);
    }

    return json(loginPayload, { status: loginStatus });
};