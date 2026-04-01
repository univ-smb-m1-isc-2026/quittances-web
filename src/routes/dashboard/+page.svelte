<script>
    import ListPropriete from "$lib/components/dashboard/listPropriete.svelte";
    import ProprieteInfo from "$lib/components/dashboard/proprieteInfo.svelte";

    let selectedPropriete = $state(null);
        let quittances = $state([]);


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

        if (!selectedPropriete?.id) return;
        quittances = []; // reset
        fetch(`/api/quittances?proprieteId=${selectedPropriete.id}`)
            .then(r => r.json())
            .then(data => quittances = data);
    });

</script>

<div class="flex h-[calc(100vh-4rem)]">
    <ListPropriete on:select={e => selectedPropriete = e.detail.id}/>
    <div class="border-l border-t border-gray-400 h-full w-full rounded-tl-xl p-6 bg-base-300">
        {#if selectedPropriete}
            <div class="flex items-center justify-between mb-6">
                <div class="text-4xl font-bold">
                    Tableau de bord - {selectedPropriete.adresse}, {selectedPropriete.ville}, {selectedPropriete.pays}
                </div>
                <button class="btn btn-outline btn-sm gap-2 border-gray-400 text-gray-500 hover:bg-gray-400 hover:text-base-100 hover:border-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    Modifier
                </button>
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

            <div class="mt-6 bg-base-100 border rounded-lg border-gray-400 h-108 flex flex-col overflow-hidden">
                <div class="flex items-center justify-between px-6 py-4 border-b border-gray-300">
                    <h2 class="font-semibold text-lg">Historique des quittances</h2>
                    <div class="flex gap-2">
                        <button class="btn btn-sm btn-ghost">Catch-up périodes passées</button>
                        <button class="btn btn-sm btn-primary">+ Générer une quittance</button>
                    </div>
                </div>
                <div class="overflow-y-auto flex-1">
                    <table class="table table-zebra w-full">
                        <thead class="sticky top-0 bg-base-200 text-xs uppercase text-gray-500">
                            <tr>
                                <th>Période</th>
                                <th>Locataire</th>
                                <th>Montant</th>
                                <th>Envoyée le</th>
                                <th>Statut</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each quittances as q}
                            <tr class="hover">
                                <td class="font-medium">{q.periode}</td>
                                <td class="text-sm">{q.locataire}</td>
                                <td class="font-mono font-semibold">{q.montant} €</td>
                                <td class="text-sm text-gray-400">{q.dateEnvoi}</td>
                                <td>
                                    {#if q.statut === 'envoyée'}
                                        <span class="badge badge-success badge-sm">Envoyée</span>
                                    {:else if q.statut === 'en attente'}
                                        <span class="badge badge-warning badge-sm">En attente</span>
                                    {:else}
                                        <span class="badge badge-error badge-sm">Échec</span>
                                    {/if}
                                </td>
                                <td class="flex gap-1">
                                    <button class="btn btn-ghost btn-xs" title="Télécharger PDF">⬇</button>
                                    <button class="btn btn-ghost btn-xs" title="Renvoyer">✉</button>
                                </td>
                            </tr>
                            {:else}
                            <tr>
                                <td colspan="6" class="text-center py-12 text-gray-400 text-sm">
                                    Aucune quittance générée pour cette propriété
                                </td>
                            </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        {:else}
            <div class="text-gray-500">Sélectionnez une propriété pour voir les détails</div>
        {/if}
    </div>
</div>