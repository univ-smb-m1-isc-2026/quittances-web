<script lang="ts">
	type Proprio = {
		id: number;
		nom: string;
		prenom: string;
		email: string;
		telephone: string;
	};

	let { data } = $props<{ data: { proprios: Proprio[]; state: string } }>();
</script>

<main class="h-screen p-6 space-y-4 bg-base-300">
	<div>
		<h1 class="text-2xl font-bold">Tous les proprios</h1>
		<p class="text-base-content/70">Vue globale administrateur des comptes proprietaires.</p>
	</div>

	{#if data.state.startsWith('[ERROR]')}
		<div class="alert alert-error">
			<span>{data.state}</span>
		</div>
	{:else if data.state.startsWith('[INFO]')}
		<div class="alert alert-info">
			<span>{data.state}</span>
		</div>
	{/if}

	<div class="overflow-x-auto rounded-box border border-base-300 bg-base-100">
		<table class="table table-zebra">
			<thead>
				<tr>
					<th>ID</th>
					<th>Nom</th>
					<th>Prenom</th>
					<th>Email</th>
					<th>Telephone</th>
				</tr>
			</thead>
			<tbody>
				{#if data.proprios.length === 0}
					<tr>
						<td colspan="5" class="text-center text-base-content/60 py-8">Aucun proprio a afficher.</td>
					</tr>
				{:else}
					{#each data.proprios as p (p.id)}
						<tr>
							<td>{p.id}</td>
							<td>{p.nom}</td>
							<td>{p.prenom}</td>
							<td>{p.email}</td>
							<td>{p.telephone}</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</main>
