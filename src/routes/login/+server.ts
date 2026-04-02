import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { type ApiEnvelope, buildApiHeaders, proxyApiJson, setAuthCookie } from '$lib/server/route-utils';

export const POST: RequestHandler = async ({ request, cookies, fetch }) => {
    const { email, password } = await request.json();

    const { payload, status } = await proxyApiJson(fetch, '/api/proprios/login', {
        method: 'POST',
        headers: buildApiHeaders(request.headers.get('origin')),
        body: JSON.stringify({ email, password })
    });

    const envelope = payload as ApiEnvelope<{ token?: string } | null>;

    if (status >= 200 && status < 300 && envelope?.data?.token) {
        setAuthCookie(cookies, envelope.data.token);
    }

    return json(envelope, { status });
};