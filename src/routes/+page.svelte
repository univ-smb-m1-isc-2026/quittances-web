<script lang="ts">
	import { resolve } from '$app/paths';

	const keyNumbers = [
		{ value: '2 min', label: 'pour une quittance complète' },
		{ value: 'Multi-tenant', label: 'données isolées par propriétaire' },
		{ value: '100% web', label: 'desktop et mobile' }
	];

	const coreFeatures = [
		'Inscription et authentification sécurisées',
		'Gestion des biens et des locataires',
		'Génération automatique de quittances PDF',
		'Envoi programmé par email',
		'Historique, recherche et archivage',
		'Génération catch-up pour périodes passées'
	];

	const workflow = [
		{
			title: 'Configurer votre parc locatif',
			desc: 'Ajoutez vos biens, vos locataires, et vos informations de loyer en quelques minutes.'
		},
		{
			title: 'Automatiser la génération',
			desc: 'Planifiez les périodes de génération et personnalisez le modèle de quittance.'
		},
		{
			title: 'Archiver et retrouver facilement',
			desc: 'Filtrez par date, bien ou locataire, puis téléchargez un document unique ou en lot.'
		}
	];

	const faqs = [
		{
			q: 'L\'application gère-t-elle le paiement du loyer ?',
			a: 'Non. Le produit est focalisé sur la création, l\'envoi et l\'archivage des quittances.'
		},
		{
			q: 'Peut-on générer des quittances rétroactives ?',
			a: 'Oui. Le mode catch-up permet de générer une période passée, par lot, avec export individuel ou consolidé.'
		},
		{
			q: 'Y a-t-il un espace administration ?',
			a: 'Oui. Un panneau admin permet de suivre les comptes, les statistiques et le journal d\'audit.'
		}
	];
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&display=swap" rel="stylesheet" />
	<title>Quittances Web | Automatisez vos quittances de loyer</title>
	<meta
		name="description"
		content="Application pour proprietaires: generation automatique de quittances, archivage, envoi email et gestion multi-tenant."
	/>
</svelte:head>

<main class="landing text-base-content" style="font-family: 'Manrope', 'Segoe UI', sans-serif;">
	<section class="hero relative overflow-hidden px-4 pb-20 pt-8 sm:px-6 sm:pt-10 lg:px-8">
		<div class="relative mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
			<div class="space-y-6">
				<h1 class="text-4xl font-extrabold leading-[0.95] sm:text-5xl lg:text-6xl">
					Automatisez vos quittances de loyer,
					<span class="text-primary">sans sacrifier la qualité.</span>
				</h1>
				<p class="max-w-2xl text-base leading-relaxed text-base-content/75 sm:text-lg">
					Une application pensée pour les propriétaires : génération PDF planifiée, historique complet,
					catch-up des périodes passées et gestion sécurisée des données par utilisateur.
				</p>
				<div class="flex flex-wrap gap-3">
					<a href={resolve('/register')} class="btn btn-primary btn-wide">Commencer gratuitement</a>
					<a href={resolve('/dashboard/generator')} class="btn btn-outline btn-wide">Voir la generation</a>
				</div>
			</div>

			<div class="rounded-3xl border border-base-content/10 bg-base-100/95 p-5 shadow-xl">
				<p class="text-xs font-bold uppercase tracking-[0.12em] text-base-content/60">Pitch</p>
				<p class="mt-3 text-sm leading-relaxed text-base-content/80">
					Quittances Web aide les proprietaires a centraliser leurs biens, leurs locataires et leurs
					quittances dans une seule interface, simple et fiable.
				</p>
				<div class="mt-5 space-y-2">
					<p class="text-xs uppercase tracking-[0.12em] text-base-content/50">Participants</p>
					<p class="text-sm font-semibold text-base-content/80">Timéo Chatelain</p>
					<p class="text-sm font-semibold text-base-content/80">Nathan Roi</p>
				</div>
			</div>
		</div>
	</section>

	<section class="sticky top-16 z-10 border-y border-base-content/10 bg-base-100/85 backdrop-blur">
		<div class="mx-auto grid w-full max-w-7xl gap-3 px-4 py-4 sm:px-6 md:grid-cols-3 lg:px-8">
			{#each keyNumbers as stat (stat.label)}
				<div class="text-center">
					<p class="text-lg font-extrabold text-primary sm:text-xl">{stat.value}</p>
					<p class="text-xs font-semibold uppercase tracking-[0.11em] text-base-content/60">{stat.label}</p>
				</div>
			{/each}
		</div>
	</section>

	<section class="px-4 py-20 sm:px-6 lg:px-8">
		<div class="mx-auto w-full max-w-7xl">
			<div class="max-w-3xl">
			<p class="text-xs font-bold uppercase tracking-[0.12em] text-primary">Fonctionnalités principales</p>
			<h2 class="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
				Une plateforme complète pour la gestion locative documentaire
				</h2>
			</div>
			<div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each coreFeatures as feature (feature)}
					<div class="rounded-xl border border-base-content/10 bg-base-100 p-4 text-sm font-medium text-base-content/80 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
						{feature}
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="bg-base-200/60 px-4 py-20 sm:px-6 lg:px-8">
		<div class="mx-auto grid w-full max-w-7xl gap-10 lg:grid-rows-[0.9fr_1.1fr] lg:items-start">
			<div>
				<p class="text-xs font-bold uppercase tracking-[0.12em] text-primary">Parcours</p>
				<h2 class="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
					Un flux simple pour passer de la configuration a l'envoi
				</h2>
			</div>
			<div class="flex gap-4">
				{#each workflow as step, index (step.title)}
					<div class="rounded-2xl border border-base-content/10 bg-base-100 p-5 shadow-sm">
						<div class="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-extrabold text-primary">
							{index + 1}
						</div>
						<h3 class="text-lg font-bold">{step.title}</h3>
						<p class="mt-2 text-sm leading-relaxed text-base-content/75">{step.desc}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="px-4 py-20 sm:px-6 lg:px-8">
		<div class="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-2">
			<div class="rounded-3xl border border-base-content/10 bg-base-100 p-6 shadow-sm">
			<p class="text-xs font-bold uppercase tracking-[0.12em] text-primary">Sécurité et architecture</p>
			<h3 class="mt-3 text-2xl font-extrabold leading-tight">Un socle multi-tenant, scalable et sécurisé</h3>
			<p class="mt-3 text-sm leading-relaxed text-base-content/75">
				Chaque propriétaire dispose de ses propres données, avec isolation logique et journalisation des actions
				critiques pour garantir la confidentialité et la traçabilité.
				</p>
			</div>
			<div class="rounded-3xl border border-base-content/10 bg-base-100 p-6 shadow-sm">
			<p class="text-xs font-bold uppercase tracking-[0.12em] text-primary">Catch-up et envois programmés</p>
			<h3 class="mt-3 text-2xl font-extrabold leading-tight">Rattrapez les périodes passées en lot</h3>
			<p class="mt-3 text-sm leading-relaxed text-base-content/75">
				Générez les quittances des 12 derniers mois, téléchargez en PDF individuel ou consolidé, puis envoyez
					par email selon votre planning.
				</p>
			</div>
		</div>
	</section>

	<section class="bg-base-200/60 px-4 py-20 sm:px-6 lg:px-8">
		<div class="mx-auto w-full max-w-5xl">
			<p class="text-center text-xs font-bold uppercase tracking-[0.12em] text-primary">FAQ</p>
			<h2 class="mt-3 text-center text-3xl font-extrabold sm:text-4xl">Questions fréquentes</h2>
			<div class="mt-10 space-y-3">
				{#each faqs as item (item.q)}
					<details class="rounded-xl border border-base-content/10 bg-base-100 p-5">
						<summary class="cursor-pointer list-none text-sm font-bold sm:text-base">{item.q}</summary>
						<p class="mt-3 text-sm leading-relaxed text-base-content/75">{item.a}</p>
					</details>
				{/each}
			</div>
		</div>
	</section>

	<section class="px-4 pb-20 pt-16 sm:px-6 lg:px-8">
		<div class="mx-auto w-full max-w-7xl rounded-3xl border border-primary/25 bg-gradient-to-r from-primary/10 via-info/10 to-transparent p-7 sm:p-10">
			<div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
				<div>
					<p class="text-xs font-bold uppercase tracking-[0.12em] text-base-content/60">Pret a lancer votre espace</p>
					<h2 class="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
						Construisez une gestion de quittances fiable, claire et evolutive.
					</h2>
				</div>
				<div class="flex gap-3 flex-row md:flex-col">
				<a href={resolve('/register')} class="btn btn-primary">Créer un compte</a>
					<a href={resolve('/login')} class="btn btn-ghost border border-base-content/15">Se connecter</a>
				</div>
			</div>
		</div>
	</section>
</main>

<style>
	.hero {
		animation: fadeInHero 600ms ease-out;
	}

	@keyframes fadeInHero {
		from {
			opacity: 0;
			transform: translateY(18px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
