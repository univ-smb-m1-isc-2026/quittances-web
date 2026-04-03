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

    type ApiEnvelope<T> = {
        data: T;
        state: string;
    };

    let {
        open = false,
        mode = 'create',
        propriete = null
    }: {
        open?: boolean;
        mode?: 'create' | 'edit';
        propriete?: Propriete | null;
    } = $props();

    const dispatch = createEventDispatcher<{
        close: void;
        saved: { property: Propriete };
    }>();

    let formError = $state('');
    let isSubmitting = $state(false);

    let adresse = $state('');
    let ville = $state('');
    let pays = $state('France');
    let surfaceM2 = $state('');
    let type = $state('');
    let loyer = $state('');
    let charges = $state('');
    let dureeBail = $state('');
    let periodicitePreset = $state('1');
    let periodiciteCustom = $state('');
    let infosComplementaires = $state('');
    let image = $state('');
    let idLocataire = $state('');

    let locataireList = $state<Locataire[]>([]);
    let isLoadingLocataires = $state(false);
    let wasOpen = $state(false);
    let showAddLocataireModal = $state(false);

    const typeOptions = ['STUDIO', 'T1', 'T2', 'T3', 'T4', 'T5', 'DUPLEX', 'TRIPLEX', 'SOUPLEX', 'LOFT'];

    const isEditMode = $derived(mode === 'edit');
    const modalTitle = $derived(isEditMode ? 'Modifier la propriete' : 'Ajouter une propriete');
    const submitLabel = $derived(isEditMode ? 'Enregistrer' : 'Creer la propriete');
    const submitLoadingLabel = $derived(isEditMode ? 'Enregistrement...' : 'Creation...');

    $effect(() => {
        if (open && !wasOpen) {
            if (isEditMode) {
                prefillForm();
            } else {
                resetForm();
            }
            void loadLocataires();
        }

        wasOpen = open;
    });

    function prefillForm() {
        if (!propriete) {
            resetForm();
            return;
        }

        const current = propriete as Record<string, unknown>;
        adresse = String(current.adresse ?? '');
        ville = String(current.ville ?? '');
        pays = String(current.pays ?? 'France');
        surfaceM2 = String(current.surfaceM2 ?? '');
        type = String(current.type ?? '');
        loyer = String(current.loyer ?? '');
        charges = String(current.charges ?? '');
        dureeBail = String(current.dureeBail ?? '');
        periodicite = current.periodicite == null ? '' : String(current.periodicite);
        infosComplementaires = String(current.infosComplementaires ?? '');
        image = String(current.image ?? '');
        idLocataire = current.idLocataire == null ? '' : String(current.idLocataire);
        formError = '';
    }

    function resetForm() {
        adresse = '';
        ville = '';
        pays = 'France';
        surfaceM2 = '';
        type = '';
        loyer = '';
        charges = '';
        dureeBail = '';
        periodicitePreset = '1';
        periodiciteCustom = '';
        infosComplementaires = '';
        image = '';
        idLocataire = '';
        formError = '';
    }

    function closeModal() {
        if (isSubmitting) return;
        dispatch('close');
    }

    function handleLocataireCreated(event: CustomEvent<{ locataire: Locataire }>) {
        const createdLocataire = event.detail.locataire;
        locataireList = [createdLocataire, ...locataireList];
        idLocataire = String(createdLocataire.id);
        showAddLocataireModal = false;
        formError = '';
    }

    async function loadLocataires() {
        if (locataireList.length > 0) {
            return;
        }

        isLoadingLocataires = true;
        try {
            const response = await fetch('/dashboard/locataires');
            const payload = await response.json() as ApiEnvelope<Locataire[] | null>;

            if (!response.ok) {
                formError = payload.state ?? '[ERROR] Impossible de charger les locataires.';
                return;
            }

            locataireList = payload.data ?? [];
            if (locataireList.length === 0) {
                formError = payload.state || '[INFO] Aucun locataire en bdd';
            }
        } catch {
            formError = 'Impossible de charger les locataires.';
        } finally {
            isLoadingLocataires = false;
        }
    }

    async function submitProperty(event: SubmitEvent) {
        event.preventDefault();
        formError = '';

        if (!adresse || !ville || !pays || !surfaceM2 || !type || !loyer || !charges || !dureeBail || !idLocataire) {
            formError = 'Merci de remplir tous les champs obligatoires.';
            return;
        }

        if (periodicitePreset === 'custom' && (!periodiciteCustom || Number(periodiciteCustom) <= 0)) {
            createError = 'Merci de renseigner une periodicite personnalisee valide.';
            return;
        }

        const periodiciteValue = periodicitePreset === 'custom' ? Number(periodiciteCustom) : Number(periodicitePreset);
        if (!periodiciteValue || periodiciteValue <= 0) {
            createError = 'La periodicite est obligatoire.';
            return;
        }

        if (locataireList.length === 0) {
            formError = 'Aucun locataire disponible. Creez d\'abord un locataire.';
            return;
        }

        if (!typeOptions.includes(String(type).trim().toUpperCase())) {
            formError = 'Type invalide. Choisissez une valeur dans la liste.';
            return;
        }

        if (isEditMode && !propriete?.id) {
            formError = 'Identifiant de propriete manquant.';
            return;
        }

        isSubmitting = true;

        try {
            const body = {
                ...(isEditMode ? { id: propriete?.id } : {}),
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
            };

            const response = await fetch('/dashboard/proprietes', {
                method: isEditMode ? 'PUT' : 'POST',
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
                    periodicite: periodiciteValue,
                    infosComplementaires: infosComplementaires ? infosComplementaires.trim() : null,
                    image: image ? image.trim() : null,
                    idLocataire: Number(idLocataire)
                })
            });

            const payload = await response.json() as ApiEnvelope<Propriete | null>;

            if (!response.ok || !payload.data) {
                formError = payload.state ?? '[ERROR] Impossible de sauvegarder la propriete.';
                return;
            }

            dispatch('saved', { property: payload.data });
            if (!isEditMode) {
                resetForm();
            }
            dispatch('close');
        } catch {
            formError = 'Impossible de sauvegarder la propriete pour le moment.';
        } finally {
            isSubmitting = false;
        }
    }
</script>

<Modal open={open} onClose={closeModal} title={modalTitle} maxWidthClass="max-w-2xl">
    <form class="grid grid-cols-1 md:grid-cols-2 gap-4" onsubmit={submitProperty}>
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
            <span class="label-text">Surface (m2)</span>
            <input type="number" min="0" step="0.1" class="input input-bordered" bind:value={surfaceM2} required />
        </label>

        <label class="form-control w-full">
            <span class="label-text">Type de logement</span>
            <select class="select select-bordered" bind:value={type} required>
                <option value="" disabled>Choisir un type</option>
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
            <span class="label-text">Duree du bail (mois)</span>
            <input type="number" min="1" step="1" class="input input-bordered" bind:value={dureeBail} required />
        </label>

        <label class="form-control w-full">
            <span class="label-text">Locataire</span>
            <div class="flex gap-2">
                <select class="select select-bordered" bind:value={idLocataire} required disabled={isLoadingLocataires || locataireList.length === 0}>
                    <option value="" disabled>Choisir un locataire</option>
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
            <span class="label-text">Periodicite d'envoi</span>
            <select class="select select-bordered" bind:value={periodicitePreset} required>
                <option value="1">Mensuel (1 mois)</option>
                <option value="3">Trimestriel (3 mois)</option>
                <option value="6">Semestriel (6 mois)</option>
                <option value="12">Annuel (12 mois)</option>
                <option value="custom">Personnalise (X mois)</option>
            </select>
            {#if periodicitePreset === 'custom'}
                <input
                    type="number"
                    min="1"
                    step="1"
                    class="input input-bordered mt-2"
                    bind:value={periodiciteCustom}
                    placeholder="Nombre de mois"
                    required
                />
            {/if}
        </label>

        <label class="form-control w-full md:col-span-2">
            <span class="label-text">Image (URL optionnelle)</span>
            <input type="url" class="input input-bordered" bind:value={image} placeholder="https://..." />
        </label>

        <label class="form-control w-full md:col-span-2">
            <span class="label-text">Informations complementaires (optionnel)</span>
            <textarea class="textarea textarea-bordered min-h-24" bind:value={infosComplementaires}></textarea>
        </label>

        {#if formError}
            <p class="md:col-span-2 text-sm text-error">{formError}</p>
        {/if}

        <div class="md:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" class="btn btn-ghost" onclick={closeModal} disabled={isSubmitting}>Annuler</button>
            <button type="submit" class="btn btn-primary" disabled={isSubmitting}>
                {#if isSubmitting}{submitLoadingLabel}{:else}{submitLabel}{/if}
            </button>
        </div>
    </form>
</Modal>

<FormAddLocataire
    open={showAddLocataireModal}
    on:close={() => (showAddLocataireModal = false)}
    on:created={handleLocataireCreated}
/>
