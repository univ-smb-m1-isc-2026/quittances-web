import type { Cookies } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import {
    buildApiHeaders,
    buildErrorState,
    extractOwnerIdFromToken,
    getAuthToken
} from '$lib/server/route-utils';

export type OwnerContext = {
    ownerId: number;
    headers: Record<string, string>;
};

export function requireOwnerContext(cookies: Cookies, origin: string | null): OwnerContext | Response {
    const token = getAuthToken(cookies);
    if (!token) {
        return json(buildErrorState('Non authentifie'), { status: 401 });
    }

    const ownerId = extractOwnerIdFromToken(token);
    if (ownerId === null) {
        return json(buildErrorState('Token invalide'), { status: 401 });
    }

    return {
        ownerId,
        headers: buildApiHeaders(origin)
    };
}
