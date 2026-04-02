import { env } from '$env/dynamic/private';

// Déterminer dynamiquement l'URL de l'API : par défaut celle de local + docker
// (on passe ça explicitement dans les terminaux par la suite si nécessaire)
const DEFAULT_API_BASE_URL = env.API_BASE_URL || 'http://localhost:8080'; // fallback local

function getApiBaseUrl(): string {
    const configuredBaseUrl = env.API_BASE_URL ?? env.PRIVATE_API_BASE_URL;
    const baseUrl = (configuredBaseUrl || DEFAULT_API_BASE_URL).trim();

    return baseUrl.replace(/\/+$/, '');
}

export function apiUrl(path: string): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${getApiBaseUrl()}${normalizedPath}`;
}