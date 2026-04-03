import type { ServerLoad } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { extractAdminFromToken } from '$lib/server/route-utils';

export const load: ServerLoad = async ({ cookies }) => {
    const token = cookies.get('auth_token');
    if (!token) {
        throw redirect(302, '/login');
    }

    if (extractAdminFromToken(token)) {
        throw redirect(302, '/dashboard/admin/proprios');
    }

    return {};
};