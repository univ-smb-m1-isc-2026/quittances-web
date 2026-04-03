import type { Cookies } from '@sveltejs/kit';
import { apiUrl } from '$lib/server/api';
import { dev } from '$app/environment';

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
		secure: !dev,
		maxAge: 60 * 60 * 24
	});
}

export function clearAuthCookie(cookies: Cookies): void {
	cookies.delete(AUTH_COOKIE_NAME, { path: '/' });
}

export function buildErrorState(details: string): ApiEnvelope<null> {
	return { data: null, state: `[ERROR] ${details}` };
}

export function extractOwnerIdFromToken(token: string): number | null {
	try {
		const payload = decodeTokenPayload(token);
		const ownerId = Number(payload.id);
		return Number.isNaN(ownerId) ? null : ownerId;
	} catch {
		return null;
	}
}

export function extractAdminFromToken(token: string): boolean {
	try {
		const payload = decodeTokenPayload(token);
		return payload.admin === true;
	} catch {
		return false;
	}
}

function decodeTokenPayload(token: string): Record<string, unknown> {
	const parts = token.split('.');
	if (parts.length < 2) {
		throw new Error('invalid token');
	}

	const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
	const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
	const payloadJson = Buffer.from(padded, 'base64').toString('utf8');
	return JSON.parse(payloadJson) as Record<string, unknown>;
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
