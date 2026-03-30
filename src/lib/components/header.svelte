<script lang="ts">
	import { goto } from '$app/navigation';
	import { invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';

	let { isAuthenticated } = $props();

	async function handleLogout() {
		await fetch('/logout', { method: 'POST' });
		await invalidateAll();
		await goto(resolve('/login'));
	}
</script>

<header>
	<div class="navbar bg-base-100 px-2 sm:px-4 fixed top-0 z-50 w-full grid grid-cols-3 items-center text-base-content ">
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
		<div class="grid grid-cols-3 items-center justify-center text-center">
			<div class="border-l-1 border-gray-400"><a href={resolve('/documentation')}>Documentation</a></div>
			<div class="border-x-1 border-gray-400"><a href={resolve('/pricing')}>Tarifs</a></div>
			<div class="border-r-1 border-gray-400"><a href={resolve('/contact')}>Contact</a></div>
		</div>

		<!-- Colonne droite -->
		<div class="flex-none gap-2 flex justify-end">
		
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
				<a href={resolve('/register')} class="border-1 border-gray-400 text-gray-600 py-1 px-2 rounded-md font-semibold hover:bg-gray-400 hover:text-base-100 transition-colors">Inscription</a>
				<a href={resolve('/login')} class="bg-primary py-1 px-2 text-primary-content rounded-md font-semibold hover:bg-primary/70 transition-colors">Connexion</a>
			{/if}
		</div>
	</div>

	<!-- <div class="fixed top-16 left-4 w-[calc(100%-2rem)] h-16 z-50 flex items-start justify-between">
		<svg class="w-4 h-4" width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M50 0C22.3858 0 0 22.3858 0 50V0H50Z" fill="var(--color-base-100)" />
		</svg>

		<svg class="w-4 h-4 rotate-90" width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M50 0C22.3858 0 0 22.3858 0 50V0H50Z" fill="var(--color-base-100)"/>
		</svg>
	</div> -->

</header>

<div class="h-16"></div>