import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ cookies }) => {
    const token = cookies.get('auth_token');
    return {
        isAuthenticated: Boolean(token)
    };
};