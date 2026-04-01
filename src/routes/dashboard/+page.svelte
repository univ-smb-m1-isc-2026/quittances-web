<script>
    import ListPropriete from "$lib/components/dashboard/listPropriete.svelte";
    import ProprieteInfo from "$lib/components/dashboard/proprieteInfo.svelte";

    let selectedProprieteId = {};
</script>

<div class="flex h-[calc(100vh-4rem)]">
    <ListPropriete on:select={e => selectedProprieteId = e.detail.id}/>
    <div class="border-l-1 border-t-1 border-gray-400 h-full w-full rounded-tl-xl p-6 bg-base-300">
        {#if selectedProprieteId}
            <div class="text-4xl font-bold mb-6"> Tableau de bord - {selectedProprieteId.adresse}, {selectedProprieteId.ville}, {selectedProprieteId.pays}</div>

            <div class="flex gap-6 w-full">
                <ProprieteInfo propriete={selectedProprieteId}/>
                <div class="w-1/3 bg-base-100 border-1 rounded-lg border-gray-400"></div>
            </div>
            <div class="mt-6 bg-base-100 border-1 rounded-lg border-gray-400 h-108">
                
            </div>
        {:else}
            <div class="text-gray-500">Sélectionnez une propriété pour voir les détails</div>
        {/if}
    </div>
</div>