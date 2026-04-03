import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { type ApiEnvelope, buildApiHeaders, proxyApiJson, setAuthCookie } from '$lib/server/route-utils';

const ADMIN_EMAIL_PATTERN = /^[a-zA-Z0-9]+@root\.com$/;

export const POST: RequestHandler = async ({ request, cookies, fetch }) => {
    const { email, password } = await request.json();
    const endpoint = ADMIN_EMAIL_PATTERN.test(String(email ?? ''))
        ? '/api/admins/login'
        : '/api/proprios/login';

    const { payload, status } = await proxyApiJson(fetch, endpoint, {
        method: 'POST',
        headers: buildApiHeaders(request.headers.get('origin')),
        body: JSON.stringify({ email, password })
    });

    const envelope = payload as ApiEnvelope<{ token?: string; admin?: boolean } | null>;

    if (status >= 200 && status < 300 && envelope?.data?.token) {
        setAuthCookie(cookies, envelope.data.token);
    }

    return json(envelope, { status });
};