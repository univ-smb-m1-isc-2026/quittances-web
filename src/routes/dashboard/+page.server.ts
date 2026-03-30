import type { ServerLoad } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const load: ServerLoad = async ({ cookies }) => {
    const token = cookies.get('auth_token');
    if (!token) {
        throw redirect(302, '/login');
    }
    return {};
};