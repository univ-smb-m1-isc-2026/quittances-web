import type { RequestHandler } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }) => {
    cookies.delete('auth_token', { path: '/' });
    throw redirect(302, '/');
};