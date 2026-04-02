import { env } from '$env/dynamic/private';

const DEFAULT_API_BASE_URL = 'https://quittances-api:8080';

function getApiBaseUrl(): string {
    const configuredBaseUrl = env.API_BASE_URL ?? env.PRIVATE_API_BASE_URL;
    const baseUrl = (configuredBaseUrl || DEFAULT_API_BASE_URL).trim();

    return baseUrl.replace(/\/+$/, '');
}

export function apiUrl(path: string): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${getApiBaseUrl()}${normalizedPath}`;
}