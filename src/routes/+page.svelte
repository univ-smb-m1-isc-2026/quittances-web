<div class="bg-base-100 h-[calc(100vh-4rem)] flex flex-col">
	<div class="bg-base-300 flex- mx-4 rounded-t-2xl border-gray-400 border-1 overflow-y-auto scroll-container">

		<!-- HERO -->
		<div
			style="background: linear-gradient(180deg,var(--color-primary) 0%, var(--color-base-300) 100%);"
			class="h-160 flex flex-col gap-8 items-center justify-center text-4xl font-bold text-white"
		>
			<div class="text-center px-8">
				ClaQuittances, votre solution de gestion de quittances en ligne.
			</div>
			<p class="text-base font-normal text-white/80 text-center max-w-xl px-4">
				Générez, envoyez et archivez vos quittances de loyer en quelques secondes. Zéro paperasse, 100% légal.
			</p>
			<div class="flex gap-4 flex-wrap justify-center">
				<a href="/dashboard/generator" class="bg-white py-2 px-5 text-primary rounded-md font-semibold hover:bg-white/90 transition-colors shadow-lg">
					Générer une quittance gratuitement
				</a>
				<a href="#how-it-works" class="border border-white/60 py-2 px-5 text-white rounded-md font-semibold hover:bg-white/10 transition-colors">
					Voir comment ça marche
				</a>
			</div>
		</div>

		<!-- BANDEAU STATS -->
		<div class="border-gray-400 border-y-1 bg-base-200 px-4 py-6 flex flex-wrap justify-around gap-6 text-center">
			<div>
				<div class="text-3xl font-extrabold text-primary">12 000+</div>
				<div class="text-sm text-gray-500 mt-1">Quittances générées</div>
			</div>
			<div>
				<div class="text-3xl font-extrabold text-primary">3 500+</div>
				<div class="text-sm text-gray-500 mt-1">Propriétaires satisfaits</div>
			</div>
			<div>
				<div class="text-3xl font-extrabold text-primary">2 min</div>
				<div class="text-sm text-gray-500 mt-1">Temps moyen de génération</div>
			</div>
			<div>
				<div class="text-3xl font-extrabold text-primary">100%</div>
				<div class="text-sm text-gray-500 mt-1">Conforme à la loi française</div>
			</div>
		</div>

		<!-- SEPARATOR -->
		<div
			class="border-gray-400 border-y-1 h-30 flex items-center justify-center"
			style="background: repeating-linear-gradient(135deg, var(--color-gray-400) 0 1px, transparent 1px 12px);"
		>
			<div class="rounded-xl text-gray-400 bg-base-300 px-6 py-4 text-black/50 text-4xl font-bold border-gray-400 border-1">
				Une solution qui vous ressemble vraiment
			</div>
		</div>

		<!-- FEATURES -->
		<div class="flex flex-row flex-wrap justify-between gap-4 px-4 py-8 w-full">
			<div class="bg-base-100 rounded-xl p-6 flex-1 border-gray-400 border-1 flex flex-col items-center">
				<span class="text-3xl mb-3">🔒</span>
				<h3 class="font-bold text-lg mb-2">Sécurité des données</h3>
				<p class="text-center text-sm text-gray-600">Vos quittances et informations sont protégées et stockées en toute sécurité.</p>
			</div>
			<div class="bg-base-100 rounded-xl p-6 flex-1 border-gray-400 border-1 flex flex-col items-center">
				<span class="text-3xl mb-3">⚡</span>
				<h3 class="font-bold text-lg mb-2">Rapidité & Simplicité</h3>
				<p class="text-center text-sm text-gray-600">Générez et envoyez vos quittances en quelques clics, sans prise de tête.</p>
			</div>
			<div class="bg-base-100 rounded-xl p-6 flex-1 border-gray-400 border-1 flex flex-col items-center">
				<span class="text-3xl mb-3">📱</span>
				<h3 class="font-bold text-lg mb-2">Accessible partout</h3>
				<p class="text-center text-sm text-gray-600">Accédez à la plateforme depuis votre ordinateur, tablette ou smartphone.</p>
			</div>
			<div class="bg-base-100 rounded-xl p-6 flex-1 border-gray-400 border-1 flex flex-col items-center">
				<span class="text-3xl mb-3">🤝</span>
				<h3 class="font-bold text-lg mb-2">Support dédié</h3>
				<p class="text-center text-sm text-gray-600">Une équipe à votre écoute pour vous accompagner à chaque étape.</p>
			</div>
		</div>

		<div class="border-t-1 border-gray-400"></div>

		<!-- COMMENT CA MARCHE -->
		<div id="how-it-works" class="px-4 py-12 flex flex-col items-center gap-8">
			<h2 class="text-3xl font-bold text-center">Comment ça marche ?</h2>
			<p class="text-gray-500 text-center max-w-lg">En 3 étapes, vos quittances sont prêtes et envoyées. C'est aussi simple que ça.</p>
			<div class="flex flex-col md:flex-row gap-6 w-full max-w-4xl justify-center">
				<div class="flex-1 bg-base-200 rounded-2xl p-6 flex flex-col items-center gap-3 border border-gray-400/40">
					<div class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">1</div>
					<h3 class="font-bold text-lg">Saisissez les informations</h3>
					<p class="text-sm text-gray-500 text-center">Renseignez le locataire, le logement et le montant du loyer en quelques secondes.</p>
				</div>
				<div class="hidden md:flex items-center text-3xl text-gray-300">→</div>
				<div class="flex-1 bg-base-200 rounded-2xl p-6 flex flex-col items-center gap-3 border border-gray-400/40">
					<div class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">2</div>
					<h3 class="font-bold text-lg">Générez le PDF</h3>
					<p class="text-sm text-gray-500 text-center">Votre quittance est créée instantanément, conforme aux exigences légales françaises.</p>
				</div>
				<div class="hidden md:flex items-center text-3xl text-gray-300">→</div>
				<div class="flex-1 bg-base-200 rounded-2xl p-6 flex flex-col items-center gap-3 border border-gray-400/40">
					<div class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">3</div>
					<h3 class="font-bold text-lg">Envoyez & archivez</h3>
					<p class="text-sm text-gray-500 text-center">Transmettez-la par email à votre locataire et retrouvez-la à tout moment dans votre espace.</p>
				</div>
			</div>
		</div>

		<div class="border-t-1 border-gray-400"></div>

		<!-- PRICING -->
		<div class="px-4 py-12 flex flex-col items-center gap-8 bg-base-200">
			<h2 class="text-3xl font-bold text-center">Des tarifs clairs, sans surprise</h2>
			<p class="text-gray-500 text-center max-w-lg">Commencez gratuitement, passez au premium quand vous en avez besoin.</p>
			<div class="flex flex-col md:flex-row gap-6 w-full max-w-3xl justify-center">

				<!-- FREE -->
				<div class="flex-1 bg-base-100 rounded-2xl p-8 flex flex-col gap-4 border border-gray-400/40">
					<div class="text-lg font-bold">Gratuit</div>
					<div class="text-4xl font-extrabold">0 €<span class="text-base font-normal text-gray-400"> / mois</span></div>
					<ul class="flex flex-col gap-2 text-sm text-gray-600 mt-2">
						<li class="flex items-center gap-2">✅ 3 quittances / mois</li>
						<li class="flex items-center gap-2">✅ Export PDF</li>
						<li class="flex items-center gap-2">✅ 1 logement</li>
						<li class="flex items-center gap-2 text-gray-300">❌ Envoi par email</li>
						<li class="flex items-center gap-2 text-gray-300">❌ Archivage illimité</li>
					</ul>
					<a href="/dashboard/generator" class="mt-4 border border-primary text-primary text-center py-2 rounded-lg font-semibold hover:bg-primary/10 transition-colors">
						Commencer gratuitement
					</a>
				</div>

				<!-- PRO -->
				<div class="flex-1 bg-primary text-primary-content rounded-2xl p-8 flex flex-col gap-4 shadow-xl relative">
					<div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
						Le plus populaire
					</div>
					<div class="text-lg font-bold">Pro</div>
					<div class="text-4xl font-extrabold">4,90 €<span class="text-base font-normal opacity-70"> / mois</span></div>
					<ul class="flex flex-col gap-2 text-sm mt-2">
						<li class="flex items-center gap-2">✅ Quittances illimitées</li>
						<li class="flex items-center gap-2">✅ Export PDF</li>
						<li class="flex items-center gap-2">✅ Logements illimités</li>
						<li class="flex items-center gap-2">✅ Envoi par email automatique</li>
						<li class="flex items-center gap-2">✅ Archivage illimité</li>
					</ul>
					<a href="/register" class="mt-4 bg-white text-primary text-center py-2 rounded-lg font-semibold hover:bg-white/90 transition-colors">
						Essayer 14 jours gratuits
					</a>
				</div>

			</div>
		</div>

		<div class="border-t-1 border-gray-400"></div>

		<!-- AVIS -->
		<div class="bg-base-100 rounded-xl p-6 mt-10 mx-4 border-gray-400 border-1 flex flex-col items-center">
			<h3 class="font-bold text-2xl mb-2">Vos avis comptent pour nous</h3>
			<div class="flex items-center gap-2 mb-6">
				<div class="text-yellow-400 text-xl">★ ★ ★ ★ ★</div>
				<span class="text-gray-500 text-sm">4,8/5 basé sur 230 avis</span>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full justify-center">
				<div class="bg-base-100 rounded-lg p-4 text-center border-black/10 border-1 min-w-[220px] max-w-[320px] mx-auto">
					<div class="font-semibold mb-2 text-lg">Marie D.</div>
					<div class="flex justify-center mb-2 text-yellow-400 text-xl">★ ★ ★ ★ ★</div>
					<div class="text-sm text-gray-600">Super simple d'utilisation, j'ai pu envoyer mes quittances en 2 minutes !</div>
				</div>
				<div class="bg-base-100 rounded-lg p-4 text-center border-black/10 border-1 min-w-[220px] max-w-[320px] mx-auto">
					<div class="font-semibold mb-2 text-lg">Julien P.</div>
					<div class="flex justify-center mb-2 text-yellow-400 text-xl">★ ★ ★ ★ ☆</div>
					<div class="text-sm text-gray-600">Plateforme intuitive et équipe réactive, je recommande !</div>
				</div>
				<div class="bg-base-100 rounded-lg p-4 text-center border-black/10 border-1 min-w-[220px] max-w-[320px] mx-auto">
					<div class="font-semibold mb-2 text-lg">Sophie L.</div>
					<div class="flex justify-center mb-2 text-yellow-400 text-xl">★ ★ ★ ★ ★</div>
					<div class="text-sm text-gray-600">Enfin une solution moderne pour gérer mes quittances, merci !</div>
				</div>
				<div class="bg-base-100 rounded-lg p-4 text-center border-black/10 border-1 min-w-[220px] max-w-[320px] mx-auto">
					<div class="font-semibold mb-2 text-lg">Antoine R.</div>
					<div class="flex justify-center mb-2 text-yellow-400 text-xl">★ ★ ★ ★ ★</div>
					<div class="text-sm text-gray-600">Service client au top, réponses rapides et efficaces.</div>
				</div>
				<div class="bg-base-100 rounded-lg p-4 text-center border-black/10 border-1 min-w-[220px] max-w-[320px] mx-auto">
					<div class="font-semibold mb-2 text-lg">Claire B.</div>
					<div class="flex justify-center mb-2 text-yellow-400 text-xl">★ ★ ★ ★ ☆</div>
					<div class="text-sm text-gray-600">Interface agréable, tout est clair et facile à utiliser.</div>
				</div>
				<div class="bg-base-100 rounded-lg p-4 text-center border-black/10 border-1 min-w-[220px] max-w-[320px] mx-auto">
					<div class="font-semibold mb-2 text-lg">Lucas M.</div>
					<div class="flex justify-center mb-2 text-yellow-400 text-xl">★ ★ ★ ★ ★</div>
					<div class="text-sm text-gray-600">Je gagne un temps fou chaque mois, bravo à l'équipe !</div>
				</div>
			</div>
		</div>

		<!-- FAQ -->
		<div class="px-4 py-12 flex flex-col items-center gap-6 max-w-3xl mx-auto w-full">
			<h2 class="text-3xl font-bold text-center">Questions fréquentes</h2>
			<div class="w-full flex flex-col gap-3">
				<details class="bg-base-200 rounded-xl border border-gray-400/30 px-5 py-4 group">
					<summary class="font-semibold cursor-pointer list-none flex justify-between items-center">
						Est-ce que ClaQuittances est conforme à la loi française ?
						<span class="text-primary group-open:rotate-45 transition-transform">+</span>
					</summary>
					<p class="mt-3 text-sm text-gray-500">Oui, toutes les quittances générées respectent les mentions obligatoires prévues par la loi du 6 juillet 1989.</p>
				</details>
				<details class="bg-base-200 rounded-xl border border-gray-400/30 px-5 py-4 group">
					<summary class="font-semibold cursor-pointer list-none flex justify-between items-center">
						Puis-je utiliser ClaQuittances pour plusieurs logements ?
						<span class="text-primary group-open:rotate-45 transition-transform">+</span>
					</summary>
					<p class="mt-3 text-sm text-gray-500">Avec le plan gratuit, vous pouvez gérer 1 logement. Le plan Pro lève cette limite et vous permet d'ajouter autant de biens que vous le souhaitez.</p>
				</details>
				<details class="bg-base-200 rounded-xl border border-gray-400/30 px-5 py-4 group">
					<summary class="font-semibold cursor-pointer list-none flex justify-between items-center">
						Mes données sont-elles en sécurité ?
						<span class="text-primary group-open:rotate-45 transition-transform">+</span>
					</summary>
					<p class="mt-3 text-sm text-gray-500">Absolument. Vos données sont chiffrées et stockées sur des serveurs sécurisés hébergés en France, conformément au RGPD.</p>
				</details>
				<details class="bg-base-200 rounded-xl border border-gray-400/30 px-5 py-4 group">
					<summary class="font-semibold cursor-pointer list-none flex justify-between items-center">
						Comment fonctionne la période d'essai Pro ?
						<span class="text-primary group-open:rotate-45 transition-transform">+</span>
					</summary>
					<p class="mt-3 text-sm text-gray-500">Vous bénéficiez de 14 jours d'accès complet au plan Pro sans aucune carte bancaire requise. À l'issue de la période, vous choisissez librement de continuer ou non.</p>
				</details>
			</div>
		</div>

		<!-- CTA FINAL -->
		<div
			style="background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-content, #1e3a5f) 100%);"
			class="mx-4 mb-4 rounded-2xl p-12 flex flex-col items-center gap-6 text-white text-center"
		>
			<h2 class="text-3xl font-extrabold">Prêt à gagner du temps chaque mois ?</h2>
			<p class="text-white/80 max-w-md">Rejoignez plus de 3 500 propriétaires qui font confiance à ClaQuittances. C'est gratuit pour commencer.</p>
			<a href="/dashboard/generator" class="bg-white text-primary font-bold py-3 px-8 rounded-xl hover:bg-white/90 transition-colors shadow-lg text-lg">
				Créer ma première quittance →
			</a>
			<p class="text-white/50 text-xs">Aucune carte bancaire requise · Annulation à tout moment</p>
		</div>

		<div class="h-4"></div>
	</div>
</div>