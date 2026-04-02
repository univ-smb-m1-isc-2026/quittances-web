<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';

	let email = '';
	let password = '';
	let rememberMe = false;
	let showPassword = false;
	let isSubmitting = false;
	let errorMessage = '';

	type ApiEnvelope<T> = {
		data: T;
		state: string;
	};

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		errorMessage = '';

		if (!email || !password) {
			errorMessage = 'Merci de remplir tous les champs.';
			return;
		}

		if (password.length < 8) {
			errorMessage = 'Le mot de passe doit contenir au moins 8 caracteres.';
			return;
		}

		isSubmitting = true;

		try {
			const response = await fetch('/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});
			const payload = await response.json() as ApiEnvelope<unknown>;
			if (!response.ok) {
				errorMessage = payload?.state || '[ERROR] Identifiants invalides';
				return;
			}
			await invalidateAll();
			await goto(resolve('/dashboard'));
		} catch {
			errorMessage = 'Impossible de se connecter pour le moment.';
		} finally {
			isSubmitting = false;
		}
	}

</script>

<main class="min-h-screen grid lg:grid-cols-2 bg-base-200">
	<section class="relative flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12 bg-base-100">
		<a
			href={resolve('/')}
			class="btn btn-ghost btn-sm absolute top-4 left-4 sm:top-6 sm:left-6"
			aria-label="Retour a l'accueil"
		>
			<span aria-hidden="true">←</span>
			Accueil
		</a>

		<div class="w-full max-w-md">
			<div class="mb-7">
				<p class="text-sm uppercase tracking-[0.2em] text-base-content/50">Quittances Web</p>
				<h1 class="text-3xl sm:text-4xl font-bold mt-2">Connexion</h1>
				<p class="text-base-content/65 mt-2">Accedez a votre tableau de bord pour continuer.</p>
			</div>

			{#if errorMessage}
				<div class="alert alert-error mb-4" role="alert">
					<span>{errorMessage}</span>
				</div>
			{/if}

			<form class="flex flex-col gap-4" on:submit={handleSubmit}>
				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Adresse email</span>
					</div>
					<input
						type="email"
						bind:value={email}
						class="input input-bordered w-full"
						placeholder="vous@exemple.com"
						autocomplete="email"
						required
					/>
				</label>

				<label class="form-control w-full">
					<div class="label flex justify-between">
						<span class="label-text">Mot de passe</span>
						<a href={resolve('/')} class="label-text-alt link link-hover">Mot de passe oublie ?</a>
					</div>

					<div class="join w-full">
						<input
							type={showPassword ? 'text' : 'password'}
							bind:value={password}
							class="input input-bordered join-item w-full"
							placeholder="Minimum 8 caracteres"
							autocomplete="current-password"
							minlength="8"
							required
						/>
						<button
							type="button"
							class="btn join-item btn-outline"
							on:click={() => (showPassword = !showPassword)}
							aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
						>
							{showPassword ? 'Masquer' : 'Afficher'}
						</button>
					</div>
				</label>

				<div class="flex items-center justify-between gap-4">
					<label class="label cursor-pointer gap-3 p-0">
						<input type="checkbox" bind:checked={rememberMe} class="checkbox checkbox-primary" />
						<span class="label-text">Se souvenir de moi</span>
					</label>
					<a href={resolve('/')} class="link link-primary">Besoin d'aide ?</a>
				</div>

				<button type="submit" class="btn btn-primary w-full" disabled={isSubmitting}>
					{#if isSubmitting}
						<span class="loading loading-spinner loading-sm"></span>
						Connexion...
					{:else}
						Se connecter
					{/if}
				</button>
			</form>

			<p class="text-sm text-base-content/65 mt-5 text-center">
				Vous n'avez pas encore de compte ?
				<a href={resolve('/register')} class="link link-primary">Creer un compte</a>
			</p>
		</div>
	</section>

	<section class="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent text-primary-content">
		<div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.18),transparent_40%)]"></div>
		<div class="absolute top-12 left-10 right-10 h-40 border-2 border-white/35 rounded-[999px] rotate-[-7deg]"></div>
		<div class="absolute top-28 left-28 right-6 h-52 border-2 border-white/25 rounded-[999px] rotate-[8deg]"></div>

		<div class="relative z-10 m-auto w-full max-w-md px-10">
			<h2 class="text-5xl font-bold leading-tight">Generez vos quittances en un geste</h2>
			<p class="mt-5 text-lg text-primary-content/90">
				Un espace simple pour centraliser vos documents locatifs et gagner du temps chaque mois.
			</p>
		</div>
	</section>
</main>

