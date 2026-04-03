import type { ServerLoad } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { apiUrl } from '$lib/server/api';
import { extractAdminFromToken } from '$lib/server/route-utils';

type Proprio = {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
};

type ApiEnvelope<T> = {
    data: T;
    state: string;
};

export const load: ServerLoad = async ({ cookies, fetch }) => {
    const token = cookies.get('auth_token');
    if (!token) {
        throw redirect(302, '/login');
    }

    if (!extractAdminFromToken(token)) {
        throw redirect(302, '/dashboard');
    }

    try {
        const response = await fetch(apiUrl('/api/proprios'), {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const payload = (await response.json()) as ApiEnvelope<Proprio[] | null>;

        if (!response.ok) {
            return {
                proprios: [] as Proprio[],
                state: payload?.state ?? '[ERROR] Impossible de charger la liste des proprios.'
            };
        }

        return {
            proprios: payload?.data ?? [],
            state: payload?.state ?? '[SUCCESS] Chargement ok'
        };
    } catch {
        return {
            proprios: [] as Proprio[],
            state: '[ERROR] Impossible de charger la liste des proprios.'
        };
    }
};
