<script lang="ts">
	import ConfirmDelete from '$lib/components/dashboard/ConfirmDelete.svelte';
	import FormProprio from '$lib/components/dashboard/FormProprio.svelte';

	type Proprio = {
		id: number;
		nom: string;
		prenom: string;
		email: string;
		telephone: string;
	};

	type ApiEnvelope<T> = {
		data: T;
		state: string;
	};

	const DELETE_FEEDBACK_DELAY_MS = 2000;

	let { data } = $props<{ data: { proprios: Proprio[]; state: string } }>();
	let proprios = $state<Proprio[]>([]);
	let stateMessage = $state('');
	let showEditModal = $state(false);
	let showDeleteModal = $state(false);
	let isDeleting = $state(false);
	let selectedProprio = $state<Proprio | null>(null);
	let deleteNeedsForce = $state(false);
	let deleteModalMessage = $state('Cette action est irreversible. Voulez-vous vraiment supprimer ce proprio ?');
	let deleteConfirmLabel = $state('Supprimer');
	let isInitialized = $state(false);
	let feedbackTimeout: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		if (isInitialized) {
			return;
		}

		proprios = data.proprios ?? [];
		isInitialized = true;
	});

	function showDeleteFeedback(message: string) {
		stateMessage = message;

		if (feedbackTimeout) {
			clearTimeout(feedbackTimeout);
		}

		feedbackTimeout = setTimeout(() => {
			stateMessage = '';
			feedbackTimeout = null;
		}, DELETE_FEEDBACK_DELAY_MS);
	}

	function openDeleteModal(proprio: Proprio) {
		selectedProprio = proprio;
		deleteNeedsForce = false;
		deleteModalMessage = 'Cette action est irreversible. Voulez-vous vraiment supprimer ce proprio ?';
		deleteConfirmLabel = 'Supprimer';
		showDeleteModal = true;
	}

	function openEditModal(proprio: Proprio) {
		selectedProprio = proprio;
		showEditModal = true;
	}

	function closeEditModal() {
		showEditModal = false;
		selectedProprio = null;
	}

	function handleProprioUpdated(event: CustomEvent<{ proprio: Proprio }>) {
		const updatedProprio = event.detail.proprio;
		proprios = proprios.map((p) => (p.id === updatedProprio.id ? updatedProprio : p));
		showEditModal = false;
		selectedProprio = null;
		showDeleteFeedback('[SUCCESS] Proprio modifie');
	}

	function closeDeleteModal() {
		if (isDeleting) {
			return;
		}

		showDeleteModal = false;
		deleteNeedsForce = false;
		deleteModalMessage = 'Cette action est irreversible. Voulez-vous vraiment supprimer ce proprio ?';
		deleteConfirmLabel = 'Supprimer';
		selectedProprio = null;
	}

	async function confirmDeleteProprio() {
		if (!selectedProprio?.id) {
			return;
		}

		isDeleting = true;
		if (feedbackTimeout) {
			clearTimeout(feedbackTimeout);
			feedbackTimeout = null;
		}
		stateMessage = '';

		try {
			const forceQuery = deleteNeedsForce ? '?force=true' : '';
			const response = await fetch(`/dashboard/admin/proprios/${selectedProprio.id}${forceQuery}`, {
				method: 'DELETE'
			});

			const payload = (await response.json()) as ApiEnvelope<null>;

			if (!response.ok) {
				if (response.status === 409 && !deleteNeedsForce) {
					deleteNeedsForce = true;
					deleteModalMessage =
						'Attention: il y a des proprietes enregistrees pour ce proprietaire. Forcer la suppression supprimera aussi ses proprietes.';
					deleteConfirmLabel = 'Forcer la suppression';
					return;
				}

				showDeleteFeedback(payload?.state ?? '[ERROR] Impossible de supprimer ce proprio.');
				return;
			}

			proprios = proprios.filter((p) => p.id !== selectedProprio?.id);
			showDeleteFeedback(payload?.state ?? '[SUCCESS] Proprio supprime');
			showDeleteModal = false;
			deleteNeedsForce = false;
			deleteModalMessage = 'Cette action est irreversible. Voulez-vous vraiment supprimer ce proprio ?';
			deleteConfirmLabel = 'Supprimer';
			selectedProprio = null;
		} catch {
			showDeleteFeedback('[ERROR] Impossible de supprimer ce proprio pour le moment.');
		} finally {
			isDeleting = false;
		}
	}
</script>

<main class="h-screen p-6 space-y-4 bg-base-300">
	<div>
		<h1 class="text-2xl font-bold">Tous les proprios</h1>
		<p class="text-base-content/70">Vue globale administrateur des comptes proprietaires.</p>
	</div>

	{#if stateMessage.startsWith('[ERROR]')}
		<div class="alert alert-error">
			<span>{stateMessage}</span>
		</div>
	{:else if stateMessage.startsWith('[INFO]') || stateMessage.startsWith('[SUCCESS]')}
		<div class="alert alert-info">
			<span>{stateMessage}</span>
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
					<th class="text-right">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#if proprios.length === 0}
					<tr>
						<td colspan="6" class="text-center text-base-content/60 py-8">Aucun proprio a afficher.</td>
					</tr>
				{:else}
					{#each proprios as p (p.id)}
						<tr>
							<td>{p.id}</td>
							<td>{p.nom}</td>
							<td>{p.prenom}</td>
							<td>{p.email}</td>
							<td>{p.telephone}</td>
							<td class="text-right flex justify-end gap-2">
								<button
									type="button"
									class="btn btn-sm btn-outline"
									onclick={() => openEditModal(p)}
								>
									Modifier
								</button>
								<button
									type="button"
									class="btn btn-sm btn-error text-white"
									onclick={() => openDeleteModal(p)}
								>
									Supprimer
								</button>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</main>

<FormProprio
	open={showEditModal}
	proprio={selectedProprio}
	on:close={closeEditModal}
	on:saved={handleProprioUpdated}
/>

<ConfirmDelete
	open={showDeleteModal}
	title="Supprimer le proprio"
	message={deleteModalMessage}
	confirmLabel={deleteConfirmLabel}
	on:close={closeDeleteModal}
	on:confirm={confirmDeleteProprio}
/>
