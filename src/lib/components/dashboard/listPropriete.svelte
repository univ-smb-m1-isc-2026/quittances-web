<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import FormPropriete from './FormPropriete.svelte';

    type Propriete = {
        id: number;
        adresse: string;
        ville: string;
        pays: string;
        image?: string | null;
        [key: string]: unknown;
    };

    let {
        proprieteList = [],
        isLoading = false
    }: { proprieteList: Propriete[]; isLoading: boolean } = $props();

    let collapsed = $state(false);
    let selectedId = $state<number | null>(null);
    const dispatch = createEventDispatcher<{ select: { id: Propriete }; propertyCreated: void }>();

    let showCreateModal = $state(false);

    $effect(() => {
        const selectedExists = proprieteList.some((p) => p.id === selectedId);
        if (!selectedExists) {
            selectedId = proprieteList.length > 0 ? proprieteList[0].id : null;
            if (selectedId !== null) {
                const first = proprieteList.find((p) => p.id === selectedId);
                if (first) {
                    dispatch('select', { id: first });
                }
            }
        }
    });

    function handlePropertySaved(event: CustomEvent<{ property: Propriete }>) {
        showCreateModal = false;
        dispatch('propertyCreated');
        if (event.detail?.property) {
            selectedId = event.detail.property.id;
            dispatch('select', { id: event.detail.property });
        }
    }
</script>

<div class="flex flex-col h-full bg-base-100 gap-2 p-2 transition-[width] duration-300 ease-in-out overflow-hidden {collapsed ? 'w-18' : 'w-1/4'}">

    <!-- Header -->
    <div class="flex items-center flex-shrink-0 h-13">
        <button
            onclick={() => collapsed = !collapsed}
            class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0 h-13 w-13 flex items-center justify-center"
            aria-label={collapsed ? 'Ouvrir' : 'Réduire'}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="transition-transform duration-300 {collapsed ? 'rotate-180' : 'rotate-0'}"
            >
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M9 3v18"/>
                <path d="m16 15-3-3 3-3"/>
            </svg>
        </button>
    </div>

    <!-- Liste -->
    <ul class="flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {#if isLoading}
            <li class="text-sm text-gray-500 px-2 py-3">Chargement des propriétés...</li>
        {:else if proprieteList.length === 0}
            <li class="text-sm text-gray-500 px-2 py-3">Aucune propriété pour le moment.</li>
        {/if}

        {#each proprieteList as propriete (propriete.id)}
            <button
                type="button"
                class="flex h-13 rounded-lg overflow-hidden cursor-pointer flex-shrink-0 transition-colors items-center
                    {collapsed ? 'w-13' : 'w-full gap-2'}
                    {selectedId === propriete.id ? 'bg-primary text-primary-content' : 'bg-base-300 hover:bg-gray-100'}"
                title={collapsed ? `${propriete.adresse} — ${propriete.ville}` : ''}
                onclick={() => { selectedId = propriete.id; dispatch('select', { id: propriete }); }}
                aria-pressed={selectedId === propriete.id}
            >
                <div class="relative h-13 w-13 flex-shrink-0">
                    <img
                        src={propriete.image || 'https://via.placeholder.com/150?text=Propriete'}
                        alt={propriete.adresse}
                        class="h-13 w-13 object-cover rounded-l-lg"
                    />
                    {#if collapsed && selectedId === propriete.id}
                        <div class="absolute inset-0 bg-primary/70 rounded-l-lg"></div>
                    {/if}
                </div>
                <div class="overflow-hidden transition-[max-width,opacity] duration-300 ease-in-out {collapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'}">
                    <div class="flex flex-col items-start mx-2 whitespace-nowrap">
                        <p class="text-lg font-semibold">{propriete.adresse}</p>
                        <p class="text-sm opacity-50">{propriete.ville}, {propriete.pays}</p>
                    </div>
                </div>
            </button>
        {/each}
    </ul>

    <!-- Bouton ajout -->
    <button
        type="button"
        onclick={() => (showCreateModal = true)}
        class="flex items-center justify-center h-13 rounded-xl bg-primary text-primary-content font-bold shadow-md hover:bg-primary/90 transition-colors cursor-pointer text-base flex-shrink-0 overflow-hidden"
    >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5 h-5 fill-primary-content flex-shrink-0">
            <path d="M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/>
        </svg>
        <div class="overflow-hidden transition-[max-width,opacity] duration-300 ease-in-out {collapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'}">
            <span class="whitespace-nowrap ml-2">Ajouter une propriété</span>
        </div>
    </button>

</div>

<FormPropriete
    open={showCreateModal}
    mode="create"
    on:close={() => (showCreateModal = false)}
    on:saved={handlePropertySaved}
/>