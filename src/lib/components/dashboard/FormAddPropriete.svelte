<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Modal from '$lib/components/ui/Modal.svelte';
    import FormAddLocataire from './FormAddLocataire.svelte';

    type Locataire = {
        id: number;
        nom: string;
        prenom: string;
        email: string;
    };

    type Propriete = {
        id: number;
        adresse: string;
        ville: string;
        pays: string;
        image?: string | null;
        [key: string]: unknown;
    };

    let { open = false }: { open?: boolean } = $props();

    const dispatch = createEventDispatcher<{
        close: void;
        created: { property: Propriete };
    }>();

    let createError = $state('');
    let isCreating = $state(false);

    let adresse = $state('');
    let ville = $state('');
    let pays = $state('France');
    let surfaceM2 = $state('');
    let type = $state('');
    let loyer = $state('');
    let charges = $state('');
    let dureeBail = $state('');
    let periodicite = $state('');
    let infosComplementaires = $state('');
    let image = $state('');
    let idLocataire = $state('');
    let locataireList = $state<Locataire[]>([]);
    let isLoadingLocataires = $state(false);
    let wasOpen = $state(false);
    let showAddLocataireModal = $state(false);

    const typeOptions = ['STUDIO', 'T1', 'T2', 'T3', 'T4', 'T5', 'DUPLEX', 'TRIPLEX', 'SOUPLEX', 'LOFT'];

    $effect(() => {
        if (open && !wasOpen) {
            void loadLocataires();
        }

        wasOpen = open;
    });

    function resetCreateForm() {
        adresse = '';
        ville = '';
        pays = 'France';
        surfaceM2 = '';
        type = '';
        loyer = '';
        charges = '';
        dureeBail = '';
        periodicite = '';
        infosComplementaires = '';
        image = '';
        idLocataire = '';
        createError = '';
    }

    function closeModal() {
        if (isCreating) return;
        resetCreateForm();
        dispatch('close');
    }

    function handleLocataireCreated(event: CustomEvent<{ locataire: Locataire }>) {
        const createdLocataire = event.detail.locataire;
        locataireList = [createdLocataire, ...locataireList];
        idLocataire = String(createdLocataire.id);
        showAddLocataireModal = false;
        createError = '';
    }

    async function loadLocataires() {
        createError = '';

        if (locataireList.length > 0) {
            return;
        }

        isLoadingLocataires = true;
        try {
            const response = await fetch('/dashboard/locataires');
            const data = await response.json() as { error?: string; locataires?: Locataire[] };

            if (!response.ok) {
                createError = data.error ?? 'Impossible de charger les locataires.';
                return;
            }

            locataireList = data.locataires ?? [];
            if (locataireList.length === 0) {
                createError = 'Aucun locataire disponible. Créez d\'abord un locataire.';
            }
        } catch {
            createError = 'Impossible de charger les locataires.';
        } finally {
            isLoadingLocataires = false;
        }
    }

    async function createProperty(event: SubmitEvent) {
        event.preventDefault();
        createError = '';

        if (!adresse || !ville || !pays || !surfaceM2 || !type || !loyer || !charges || !dureeBail || !idLocataire) {
            createError = 'Merci de remplir tous les champs obligatoires.';
            return;
        }

        if (locataireList.length === 0) {
            createError = 'Aucun locataire disponible. Créez d\'abord un locataire.';
            return;
        }

        if (!typeOptions.includes(String(type).trim().toUpperCase())) {
            createError = 'Type invalide. Choisissez une valeur dans la liste.';
            return;
        }

        isCreating = true;

        try {
            const response = await fetch('/dashboard/proprietes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adresse: adresse.trim(),
                    ville: ville.trim(),
                    pays: pays.trim(),
                    surfaceM2: Number(surfaceM2),
                    type: String(type).trim().toUpperCase(),
                    loyer: Number(loyer),
                    charges: Number(charges),
                    dureeBail: Number(dureeBail),
                    periodicite: periodicite ? Number(periodicite) : null,
                    infosComplementaires: infosComplementaires ? infosComplementaires.trim() : null,
                    image: image ? image.trim() : null,
                    idLocataire: Number(idLocataire)
                })
            });

            const data = await response.json() as { error?: string; property?: Propriete };

            if (!response.ok || !data.property) {
                createError = data.error ?? 'Impossible de créer la propriété.';
                return;
            }

            resetCreateForm();
            dispatch('created', { property: data.property });
        } catch {
            createError = 'Impossible de créer la propriété pour le moment.';
        } finally {
            isCreating = false;
        }
    }
</script>

<Modal open={open} onClose={closeModal} title="Ajouter une propriété" maxWidthClass="max-w-2xl">
    <form class="grid grid-cols-1 md:grid-cols-2 gap-4" onsubmit={createProperty}>
        <label class="form-control w-full">
            <span class="label-text">Adresse</span>
            <input class="input input-bordered" bind:value={adresse} required />
        </label>

        <label class="form-control w-full">
            <span class="label-text">Ville</span>
            <input class="input input-bordered" bind:value={ville} required />
        </label>

        <label class="form-control w-full">
            <span class="label-text">Pays</span>
            <input class="input input-bordered" bind:value={pays} required />
        </label>

        <label class="form-control w-full">
            <span class="label-text">Surface (m²)</span>
            <input type="number" min="0" step="0.1" class="input input-bordered" bind:value={surfaceM2} required />
        </label>

        <label class="form-control w-full">
            <span class="label-text">Type de logement</span>
            <select class="select select-bordered" bind:value={type} required>
                <option value="" disabled selected>Choisir un type</option>
                {#each typeOptions as typeOption (typeOption)}
                    <option value={typeOption}>{typeOption}</option>
                {/each}
            </select>
        </label>

        <label class="form-control w-full">
            <span class="label-text">Loyer</span>
            <input type="number" min="0" step="0.01" class="input input-bordered" bind:value={loyer} required />
        </label>

        <label class="form-control w-full">
            <span class="label-text">Charges</span>
            <input type="number" min="0" step="0.01" class="input input-bordered" bind:value={charges} required />
        </label>

        <label class="form-control w-full">
            <span class="label-text">Durée du bail (mois)</span>
            <input type="number" min="1" step="1" class="input input-bordered" bind:value={dureeBail} required />
        </label>

        <label class="form-control w-full">
            <span class="label-text">Locataire</span>
            <div class="flex gap-2">
            <select class="select select-bordered" bind:value={idLocataire} required disabled={isLoadingLocataires || locataireList.length === 0}>
                <option value="" disabled selected>Choisir un locataire</option>
                {#each locataireList as locataire (locataire.id)}
                    <option value={String(locataire.id)}>
                        {locataire.prenom} {locataire.nom} ({locataire.email})
                    </option>
                {/each}
            </select>
            <button type="button" class="btn btn-outline" onclick={() => (showAddLocataireModal = true)}>
                Ajouter
            </button>
            </div>
            {#if isLoadingLocataires}
                <span class="label-text-alt">Chargement des locataires...</span>
            {/if}
        </label>

        <label class="form-control w-full">
            <span class="label-text">Périodicité (optionnel)</span>
            <input type="number" min="1" step="1" class="input input-bordered" bind:value={periodicite} />
        </label>

        <label class="form-control w-full md:col-span-2">
            <span class="label-text">Image (URL optionnelle)</span>
            <input type="url" class="input input-bordered" bind:value={image} placeholder="https://..." />
        </label>

        <label class="form-control w-full md:col-span-2">
            <span class="label-text">Informations complémentaires (optionnel)</span>
            <textarea class="textarea textarea-bordered min-h-24" bind:value={infosComplementaires}></textarea>
        </label>

        {#if createError}
            <p class="md:col-span-2 text-sm text-error">{createError}</p>
        {/if}

        <div class="md:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" class="btn btn-ghost" onclick={closeModal} disabled={isCreating}>Annuler</button>
            <button type="submit" class="btn btn-primary" disabled={isCreating}>
                {#if isCreating}Création...{:else}Créer la propriété{/if}
            </button>
        </div>
    </form>
</Modal>

<FormAddLocataire
    open={showAddLocataireModal}
    on:close={() => (showAddLocataireModal = false)}
    on:created={handleLocataireCreated}
/>
