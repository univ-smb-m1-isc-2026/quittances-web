import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
    const token = cookies.get('auth_token');
    if (!token) {
        throw redirect(302, '/login');
    }
    // Optionnel : tu peux ajouter ici une vérification du JWT côté serveur
    return {};
};
