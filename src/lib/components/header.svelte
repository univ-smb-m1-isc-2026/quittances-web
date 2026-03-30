<script lang="ts">
    import { goto } from '$app/navigation';
    import { invalidateAll } from '$app/navigation';  // ← ajoute ça
    import { resolve } from '$app/paths';

    let { isAuthenticated } = $props();

    async function handleLogout() {
        await fetch('/logout', { method: 'POST' });
        await invalidateAll();  // ← recharge les données du layout
        await goto(resolve('/login'));
    }
</script>

<header>
    <div class="navbar bg-base-100 shadow-sm px-2 sm:px-4 fixed top-0 z-50 w-full">
        <div class="flex-1 gap-3">
            <a href={resolve('/')} class="text-sm uppercase tracking-[0.2em] text-base-content/50">Quittances Web</a>
        </div>

        <div class="flex-none gap-2">
            {#if isAuthenticated}
                <a href={resolve('/dashboard')} class="btn btn-ghost btn-sm">Dashboard</a>
                <div class="dropdown dropdown-end">
                    <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                        <div class="w-10 rounded-full ring ring-primary/25 ring-offset-base-100 ring-offset-2">
                            <img
                                alt="Avatar utilisateur"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                            />
                        </div>
                    </div>
                    <ul
                        tabindex="-1"
                        class="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-56 p-2 shadow"
                    >
                        <li><a href={resolve('/dashboard')}>Mon dashboard</a></li>
                        <li><a href={resolve('/dashboard/generator')}>Generer une quittance</a></li>
                        <li>
                            <button type="button" onclick={handleLogout}>Se deconnecter</button>
                        </li>
                    </ul>
                </div>
            {:else}
                <a href={resolve('/login')} class="btn btn-ghost btn-sm">Connexion</a>
                <a href={resolve('/register')} class="btn btn-primary btn-sm">Inscription</a>
            {/if}
        </div>
    </div>
</header>
<div class="h-16"></div>