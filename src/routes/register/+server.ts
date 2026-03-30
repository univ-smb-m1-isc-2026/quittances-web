import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies, fetch }) => {
    const { email, password } = await request.json();

    const res = await fetch('http://quittances-api:8080/api/proprios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
        return json({ error: 'Identifiants invalides' }, { status: 401 });
    }

    const data = await res.json();

    cookies.set('auth_token', data.token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 60 * 60 * 24
    });

    return json({ success: true });
};