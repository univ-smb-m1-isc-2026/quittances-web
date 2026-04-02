<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Modal from '$lib/components/ui/Modal.svelte';

    type Locataire = {
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

    let { open = false }: { open?: boolean } = $props();

    const dispatch = createEventDispatcher<{
        close: void;
        created: { locataire: Locataire };
    }>();

    let nom = $state('');
    let prenom = $state('');
    let email = $state('');
    let telephone = $state('');

    let isSubmitting = $state(false);
    let errorMessage = $state('');

    function resetForm() {
        nom = '';
        prenom = '';
        email = '';
        telephone = '';
        errorMessage = '';
    }

    function closeModal() {
        if (isSubmitting) return;
        resetForm();
        dispatch('close');
    }

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        errorMessage = '';

        const cleanedPhone = telephone.replace(/\D/g, '');

        if (!nom || !prenom || !email || !cleanedPhone) {
            errorMessage = 'Merci de remplir tous les champs obligatoires.';
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            errorMessage = 'Veuillez saisir une adresse email valide.';
            return;
        }

        if (cleanedPhone.length !== 10) {
            errorMessage = 'Le numéro de téléphone doit contenir 10 chiffres.';
            return;
        }

        isSubmitting = true;

        try {
            const response = await fetch('/dashboard/locataires', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nom: nom.trim(),
                    prenom: prenom.trim(),
                    email: email.trim(),
                    telephone: cleanedPhone
                })
            });

            const payload = await response.json() as ApiEnvelope<Locataire | null>;

            if (!response.ok || !payload.data) {
                errorMessage = payload.state ?? '[ERROR] Impossible de creer le locataire.';
                return;
            }

            resetForm();
            dispatch('created', { locataire: payload.data });
        } catch {
            errorMessage = 'Impossible de créer le locataire pour le moment.';
        } finally {
            isSubmitting = false;
        }
    }
</script>

<Modal open={open} onClose={closeModal} title="Ajouter un locataire" maxWidthClass="max-w-xl">
    <form class="grid grid-cols-1 md:grid-cols-2 gap-4" onsubmit={handleSubmit}>
        <label class="form-control w-full">
            <span class="label-text">Prénom</span>
            <input class="input input-bordered" bind:value={prenom} required />
        </label>

        <label class="form-control w-full">
            <span class="label-text">Nom</span>
            <input class="input input-bordered" bind:value={nom} required />
        </label>

        <label class="form-control w-full md:col-span-2">
            <span class="label-text">Adresse email</span>
            <input type="email" class="input input-bordered" bind:value={email} placeholder="locataire@email.com" required />
        </label>

        <label class="form-control w-full md:col-span-2">
            <span class="label-text">Téléphone</span>
            <input type="tel" class="input input-bordered" bind:value={telephone} placeholder="06 12 34 56 78" required />
        </label>

        {#if errorMessage}
            <p class="md:col-span-2 text-sm text-error">{errorMessage}</p>
        {/if}

        <div class="md:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" class="btn btn-ghost" onclick={closeModal} disabled={isSubmitting}>Annuler</button>
            <button type="submit" class="btn btn-primary" disabled={isSubmitting}>
                {#if isSubmitting}Création...{:else}Créer le locataire{/if}
            </button>
        </div>
    </form>
</Modal>
