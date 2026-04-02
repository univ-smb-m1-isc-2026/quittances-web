import type { Cookies } from '@sveltejs/kit';
import { apiUrl } from '$lib/server/api';

export type ApiEnvelope<T> = { data: T; state: string };
type ServerFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

const AUTH_COOKIE_NAME = 'auth_token';

export function buildApiHeaders(origin: string | null): Record<string, string> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };

    if (origin) {
        headers.Origin = origin;
    }

    return headers;
}

export function getAuthToken(cookies: Cookies): string | null {
    return cookies.get(AUTH_COOKIE_NAME) ?? null;
}

export function setAuthCookie(cookies: Cookies, token: string): void {
    cookies.set(AUTH_COOKIE_NAME, token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 60 * 60 * 24
    });
}

export function buildErrorState(details: string): ApiEnvelope<null> {
    return { data: null, state: `[ERROR] ${details}` };
}

export function extractOwnerIdFromToken(token: string): number | null {
    try {
        const parts = token.split('.');
        if (parts.length < 2) {
            return null;
        }

        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
        const payloadJson = Buffer.from(padded, 'base64').toString('utf8');
        const payload = JSON.parse(payloadJson) as Record<string, unknown>;
        const ownerId = Number(payload.id);
        return Number.isNaN(ownerId) ? null : ownerId;
    } catch {
        return null;
    }
}

export async function proxyApiJson(
    fetchFn: ServerFetch,
    path: string,
    init: RequestInit
): Promise<{ status: number; payload: unknown }> {
    const response = await fetchFn(apiUrl(path), init);

    try {
        const payload = await response.json();
        return { status: response.status, payload };
    } catch {
        return {
            status: response.status,
            payload: buildErrorState('Reponse backend invalide')
        };
    }
}