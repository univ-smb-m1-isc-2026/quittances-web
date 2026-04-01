<script>
    import ListPropriete from "$lib/components/dashboard/listPropriete.svelte";
    import ProprieteInfo from "$lib/components/dashboard/proprieteInfo.svelte";

    let selectedPropriete = $state(null);

    let longitude = $state(0);
    let latitude = $state(0);

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
    <ListPropriete on:select={e => selectedPropriete = e.detail.id}/>
    <div class="border-l border-t border-gray-400 h-full w-full rounded-tl-xl p-6 bg-base-300">
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
                        />
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