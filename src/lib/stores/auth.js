import { writable } from 'svelte/store';

export const admin = writable(false);

/**
 * @param {boolean} isAdmin
 */
export function setAdmin(isAdmin) {
    admin.set(Boolean(isAdmin));
}
