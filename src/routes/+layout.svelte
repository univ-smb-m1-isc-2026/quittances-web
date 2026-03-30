<script lang="ts">
    import './layout.css';
    import favicon from '$lib/assets/favicon.svg';
    import Header from '$lib/components/header.svelte';
    import { page } from '$app/state';

    let { children, data } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if !['/login', '/register'].includes(page.url.pathname)}
    <Header isAuthenticated={data.isAuthenticated} />
{/if}

{@render children()}