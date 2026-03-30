<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let firstName = '';
	let lastName = '';
	let email = '';
	let phone = '';
	let password = '';
	let confirmPassword = '';
	let acceptTerms = false;
	let showPassword = false;
	let showConfirmPassword = false;
	let isSubmitting = false;
	let errorMessage = '';

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		errorMessage = '';

		if (!firstName || !lastName || !email || !password || !confirmPassword) {
			errorMessage = 'Merci de remplir tous les champs.';
			return;
		}

		if (password.length < 8) {
			errorMessage = 'Le mot de passe doit contenir au moins 8 caracteres.';
			return;
		}

		if (password !== confirmPassword) {
			errorMessage = 'Les mots de passe ne correspondent pas.';
			return;
		}

		if (!acceptTerms) {
			errorMessage = 'Vous devez accepter les conditions d\'utilisation.';
			return;
		}

		isSubmitting = true;

		try {
			const response = await fetch('/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					nom: lastName,
					prenom: firstName,
					email,
					telephone: phone,
					password
				})
			});

			if (!response.ok) {
				const data = await response.json();
				errorMessage = data.error || 'Impossible de créer le compte pour le moment.';
				return;
			}

			await goto('/dashboard');
		} catch {
			errorMessage = 'Impossible de créer le compte pour le moment.';
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
				<h1 class="text-3xl sm:text-4xl font-bold mt-2">Creer un compte</h1>
				<p class="text-base-content/65 mt-2">Inscrivez-vous pour generer vos quittances en quelques clics.</p>
			</div>

			{#if errorMessage}
				<div class="alert alert-error mb-4" role="alert">
					<span>{errorMessage}</span>
				</div>
			{/if}

			<form class="flex flex-col gap-4" on:submit={handleSubmit}>
				<div class="grid sm:grid-cols-2 gap-4">
					<label class="form-control w-full">
						<div class="label">
							<span class="label-text">Prenom</span>
						</div>
						<input
							type="text"
							bind:value={firstName}
							class="input input-bordered w-full"
							placeholder="Jean"
							autocomplete="given-name"
							required
						/>
					</label>

					<label class="form-control w-full">
						<div class="label">
							<span class="label-text">Nom</span>
						</div>
						<input
							type="text"
							bind:value={lastName}
							class="input input-bordered w-full"
							placeholder="Dupont"
							autocomplete="family-name"
							required
						/>
					</label>
				</div>

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
					<div class="label">
						<span class="label-text">Téléphone</span>
					</div>
					<input
						type="tel"
						bind:value={phone}
						class="input input-bordered w-full"
						placeholder="06 12 34 56 78"
						autocomplete="tel"
						required
					/>
				</label>

				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Mot de passe</span>
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

				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Confirmer le mot de passe</span>
					</div>

					<div class="join w-full">
						<input
							type={showConfirmPassword ? 'text' : 'password'}
							bind:value={confirmPassword}
							class="input input-bordered join-item w-full"
							placeholder="Retapez votre mot de passe"
							autocomplete="new-password"
							minlength="8"
							required
						/>
						<button
							type="button"
							class="btn join-item btn-outline"
							on:click={() => (showConfirmPassword = !showConfirmPassword)}
							aria-label={showConfirmPassword ? 'Masquer la confirmation du mot de passe' : 'Afficher la confirmation du mot de passe'}
						>
							{showConfirmPassword ? 'Masquer' : 'Afficher'}
						</button>
					</div>
				</label>

				<label class="label cursor-pointer justify-start gap-3 p-0 mt-1">
					<input type="checkbox" bind:checked={acceptTerms} class="checkbox checkbox-primary" />
					<span class="label-text">
						J'accepte les
						<a href={resolve('/')} class="link link-primary">conditions d'utilisation</a>.
					</span>
				</label>

				<button type="submit" class="btn btn-primary w-full" disabled={isSubmitting}>
					{#if isSubmitting}
						<span class="loading loading-spinner loading-sm"></span>
						Creation...
					{:else}
						Creer mon compte
					{/if}
				</button>
			</form>

			<p class="text-sm text-base-content/65 mt-5 text-center">
				Vous avez deja un compte ?
				<a href={resolve('/login')} class="link link-primary">Se connecter</a>
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
