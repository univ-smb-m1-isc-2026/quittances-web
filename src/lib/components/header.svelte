<script lang="ts">
	import { goto } from '$app/navigation';
	import { invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import AdminCenterActions from '$lib/components/admin/AdminCenterActions.svelte';
	import { admin, setAdmin } from '../stores/auth.js';

	let { isAuthenticated, isAdmin = false } = $props();

	async function handleLogout() {
		await fetch('/logout', { method: 'POST' });
		setAdmin(false);
		await invalidateAll();
		await goto(resolve('/login'));
	}
</script>

<header>
	<div class="navbar bg-base-100 px-8 fixed top-0 z-50 w-full grid grid-cols-3 items-center text-base-content ">
		<!-- Colonne gauche -->
		<a href={resolve('/')} class="flex gap-2 items-end">
			<div class="gap-3 bg-primary rounded-lg p-2">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 512 512" style="color: var(--fallback-b1, #fff);">
					<path fill="currentColor" d="M277.8 8.6c-12.3-11.4-31.3-11.4-43.5 0l-224 208c-9.6 9-12.8 22.9-8 35.1S18.8 272 32 272l16 0 0 176c0 35.3 28.7 64 64 64l288 0c35.3 0 64-28.7 64-64l0-176 16 0c13.2 0 25-8.1 29.8-20.3s1.6-26.2-8-35.1l-224-208zM240 320l32 0c26.5 0 48 21.5 48 48l0 96-128 0 0-96c0-26.5 21.5-48 48-48z"/>
				</svg>
			</div>
			<div class="text-[1.5rem] font-bold">
				ClaQuittances
			</div>
		</a>

		<!-- Colonne centrale -->
		{#if isAuthenticated && !(isAdmin || $admin)}
			<div class="grid grid-cols-3 items-center justify-center text-center">
				<div class="border-l-1 border-r-1 border-gray-400"><a href={resolve('/dashboard')}>Dashboard</a></div>
				<div class="border-l-1 border-r-1 border-gray-400"><a href={resolve('/documentation')}>Documentation</a></div>
				<div class="border-r-1 border-gray-400"><a href={resolve('/contact')}>Contact</a></div>
			</div>
		{:else}
			<div class="grid grid-cols-3 items-center justify-center text-center">
				<div class="border-l-1 border-gray-400"><a href={resolve('/documentation')}>Documentation</a></div>
				<div class="border-x-1 border-gray-400"><a href={resolve('/pricing')}>Tarifs</a></div>
				<div class="border-r-1 border-gray-400"><a href={resolve('/contact')}>Contact</a></div>
			</div>
		{/if}

		{#if isAuthenticated && (isAdmin || $admin)}
			<div class="flex items-center justify-center">
					<AdminCenterActions />
			</div>
		{/if}

		<div class="flex-none gap-2 flex justify-end items-center">
			{#if isAuthenticated}				
				{#if isAdmin || $admin}
					<span class="badge badge-secondary badge-sm">Admin</span>
				{/if}
				
				<button class="border-1 border-gray-400 text-gray-400 py-1 px-2 rounded-md font-semibold hover:bg-gray-400 hover:text-base-100 transition-colors" onclick={handleLogout}>Se deconnecter</button>

			{:else}
				<a href={resolve('/register')} class="border-1 border-gray-400 text-gray-400 py-1 px-2 rounded-md font-semibold hover:bg-gray-400 hover:text-base-100 transition-colors">Inscription</a>
				<a href={resolve('/login')} class="bg-primary py-1 px-2 text-primary-content rounded-md font-semibold hover:bg-primary/70 transition-colors">Connexion</a>
			{/if}
		</div>
	</div>
</header>

<div class="h-16"></div>