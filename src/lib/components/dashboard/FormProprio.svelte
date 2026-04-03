<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Modal from '$lib/components/ui/Modal.svelte';

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

    let {
        open = false,
        proprio = null
    }: {
        open?: boolean;
        proprio?: Proprio | null;
    } = $props();

    const dispatch = createEventDispatcher<{
        close: void;
        saved: { proprio: Proprio };
    }>();

    let formError = $state('');
    let isSubmitting = $state(false);
    let wasOpen = $state(false);

    let nom = $state('');
    let prenom = $state('');
    let email = $state('');
    let telephone = $state('');
    let password = $state('');

    $effect(() => {
        if (open && !wasOpen) {
            prefillForm();
        }

        wasOpen = open;
    });

    function prefillForm() {
        nom = proprio?.nom ?? '';
        prenom = proprio?.prenom ?? '';
        email = proprio?.email ?? '';
        telephone = proprio?.telephone ?? '';
        password = '';
        formError = '';
    }

    function closeModal() {
        if (isSubmitting) return;
        dispatch('close');
    }

    async function submitProprio(event: SubmitEvent) {
        event.preventDefault();
        formError = '';

        if (!proprio?.id) {
            formError = 'Identifiant de proprio manquant.';
            return;
        }

        if (!nom.trim() || !prenom.trim() || !email.trim() || !telephone.trim()) {
            formError = 'Merci de remplir tous les champs obligatoires.';
            return;
        }

        isSubmitting = true;

        try {
            const response = await fetch('/dashboard/admin/proprios', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: proprio.id,
                    nom: nom.trim(),
                    prenom: prenom.trim(),
                    email: email.trim(),
                    telephone: telephone.trim(),
                    password: password.trim() ? password : null
                })
            });

            const payload = (await response.json()) as ApiEnvelope<Proprio | null>;

            if (!response.ok || !payload?.data) {
                formError = payload?.state ?? '[ERROR] Impossible de modifier ce proprio.';
                return;
            }

            dispatch('saved', { proprio: payload.data });
            dispatch('close');
        } catch {
            formError = '[ERROR] Impossible de modifier ce proprio pour le moment.';
        } finally {
            isSubmitting = false;
        }
    }
</script>

<Modal open={open} onClose={closeModal} title="Modifier le proprio" maxWidthClass="max-w-2xl">
    <form class="grid grid-cols-1 md:grid-cols-2 gap-4" onsubmit={submitProprio}>
        <label class="form-control w-full">
            <span class="label-text">Nom</span>
            <input class="input input-bordered" bind:value={nom} required />
        </label>

        <label class="form-control w-full">
            <span class="label-text">Prenom</span>
            <input class="input input-bordered" bind:value={prenom} required />
        </label>

        <label class="form-control w-full md:col-span-2">
            <span class="label-text">Email</span>
            <input type="email" class="input input-bordered" bind:value={email} required />
        </label>

        <label class="form-control w-full">
            <span class="label-text">Telephone</span>
            <input class="input input-bordered" bind:value={telephone} required />
        </label>

        <label class="form-control w-full">
            <span class="label-text">Nouveau mot de passe (optionnel)</span>
            <input
                type="password"
                minlength="8"
                class="input input-bordered"
                bind:value={password}
                placeholder="Laisser vide pour ne pas changer"
            />
        </label>

        {#if formError}
            <div class="md:col-span-2 alert alert-error">
                <span>{formError}</span>
            </div>
        {/if}

        <div class="md:col-span-2 flex justify-end gap-3">
            <button type="button" class="btn btn-ghost" onclick={closeModal} disabled={isSubmitting}>
                Annuler
            </button>
            <button type="submit" class="btn btn-primary" disabled={isSubmitting}>
                {#if isSubmitting}
                    <span class="loading loading-spinner loading-sm"></span>
                    Enregistrement...
                {:else}
                    Enregistrer
                {/if}
            </button>
        </div>
    </form>
</Modal>
