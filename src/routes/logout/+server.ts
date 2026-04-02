import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }) => {
    cookies.delete('auth_token', { path: '/' });
    return json({ data: { loggedOut: true }, state: '[SUCCESS] Deconnexion reussie' });
};