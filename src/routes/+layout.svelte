<script lang="ts">
    import './layout.css';
    import { browser } from '$app/environment';
    import favicon from '$lib/assets/favicon.svg';
    import Header from '$lib/components/header.svelte';
    import { setAdmin } from '../lib/stores/auth.js';
    import { page } from '$app/state';

    let { children, data } = $props();

    $effect(() => {
        if (!browser) {
            return;
        }

        setAdmin(Boolean(data.isAdmin));
    });
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if !['/login', '/register'].includes(page.url.pathname)}
    <Header isAuthenticated={data.isAuthenticated} isAdmin={data.isAdmin} />
{/if}

{@render children()}