import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { clearAuthCookie } from '$lib/server/route-utils';

export const POST: RequestHandler = async ({ cookies }) => {
    clearAuthCookie(cookies);
    return json({ data: { loggedOut: true }, state: '[SUCCESS] Deconnexion reussie' });
};