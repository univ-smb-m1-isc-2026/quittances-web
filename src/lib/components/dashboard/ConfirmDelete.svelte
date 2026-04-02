<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Modal from '$lib/components/ui/Modal.svelte';

    let {
        open = false,
        title = 'Confirmer la suppression',
        message = 'Voulez-vous vraiment supprimer cet element ?'
    }: {
        open?: boolean;
        title?: string;
        message?: string;
    } = $props();

    const dispatch = createEventDispatcher<{
        close: void;
        confirm: void;
    }>();

    function closeModal() {
        dispatch('close');
    }

    function confirmDelete() {
        dispatch('confirm');
    }
</script>

<Modal open={open} onClose={closeModal} title={title} maxWidthClass="max-w-lg">
    <div class="space-y-6">
        <p class="text-sm text-base-content/80">{message}</p>

        <div class="flex justify-end gap-3">
            <button type="button" class="btn btn-ghost" onclick={closeModal}>Annuler</button>
            <button type="button" class="btn btn-error text-white" onclick={confirmDelete}>Supprimer</button>
        </div>
    </div>
</Modal>
