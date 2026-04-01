<script lang="ts">
    import { onMount } from 'svelte';
    import ListPropriete from "$lib/components/dashboard/listPropriete.svelte";
    import ProprieteInfo from "$lib/components/dashboard/proprieteInfo.svelte";

    type Propriete = {
        id: number;
        adresse: string;
        ville: string;
        pays: string;
        image?: string | null;
        [key: string]: unknown;
    };

    let selectedPropriete = $state<Propriete | null>(null);
    let proprieteList = $state<Propriete[]>([]);
    let isLoadingProprietes = $state(true);
    let propertiesError = $state('');

    let longitude = $state(0);
    let latitude = $state(0);

    async function loadProprietes() {
        isLoadingProprietes = true;
        propertiesError = '';

        try {
            const response = await fetch('/dashboard/proprietes');
            const data = await response.json() as { error?: string; properties?: Propriete[] };

            if (!response.ok) {
                propertiesError = data.error ?? 'Impossible de charger les propriétés.';
                proprieteList = [];
                return;
            }

            proprieteList = data.properties ?? [];
        } catch {
            propertiesError = 'Impossible de charger les propriétés.';
            proprieteList = [];
        } finally {
            isLoadingProprietes = false;
        }
    }

    onMount(async () => {
        await loadProprietes();
    });

    $effect(() => {
        if (!selectedPropriete?.adresse) return;

        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(selectedPropriete.adresse + ', ' + selectedPropriete.ville + ', ' + selectedPropriete.pays)}`)
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    longitude = parseFloat(data[0].lon);
                    latitude = parseFloat(data[0].lat);
                }
            });
    });
</script>

<div class="flex h-[calc(100vh-4rem)]">
    <ListPropriete
        proprieteList={proprieteList}
        isLoading={isLoadingProprietes}
        on:select={(e: CustomEvent<{ id: Propriete }>) => selectedPropriete = e.detail.id}
        on:propertyCreated={loadProprietes}
    />
    <div class="border-l border-t border-gray-400 h-full w-full rounded-tl-xl p-6 bg-base-300">
        {#if propertiesError}
            <div class="mb-4 rounded-md border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
                {propertiesError}
            </div>
        {/if}

        {#if selectedPropriete}
            <div class="text-4xl font-bold mb-6">
                Tableau de bord - {selectedPropriete.adresse}, {selectedPropriete.ville}, {selectedPropriete.pays}
            </div>

            <div class="flex gap-6 w-full">
                <ProprieteInfo propriete={selectedPropriete}/>
                <div class="w-1/3 bg-base-100 border rounded-lg border-gray-400">
                    {#if latitude !== 0 && longitude !== 0}
                        <iframe
                            title="Localisation"
                            width="100%"
                            height="100%"
                            frameborder="0"
                            class="rounded-lg"
                            src="https://www.openstreetmap.org/export/embed.html?bbox={longitude - 0.01},{latitude - 0.01},{longitude + 0.01},{latitude + 0.01}&layer=mapnik&marker={latitude},{longitude}"
                        ></iframe>
                    {:else}
                        <div class="flex items-center justify-center h-full text-gray-400 text-sm">
                            Chargement de la carte…
                        </div>
                    {/if}
                </div>
            </div>

            <div class="mt-6 bg-base-100 border rounded-lg border-gray-400 h-108"></div>
        {:else}
            <div class="text-gray-500">Sélectionnez une propriété pour voir les détails</div>
        {/if}
    </div>
</div>