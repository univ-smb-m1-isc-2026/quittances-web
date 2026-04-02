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

    type Quittance = {
        id?: number;
        period: string;
        tenant: { nom: string; prenom: string } | null;
        propriete: { id: number; loyer: number; charges: number } | null;
        paymentDate: string;
        statut: string | null; // Tu ajusteras selon comment tu gères l'état côté appli (ex "envoyée")
    };

    type ApiEnvelope<T> = {
        data: T;
        state: string;
    };

    let selectedPropriete = $state<Propriete | null>(null);
    let proprieteList = $state<Propriete[]>([]);
    let isLoadingProprietes = $state(true);
    let propertiesError = $state('');
    let quittances = $state<Quittance[]>([]);


    let longitude = $state(0);
    let latitude = $state(0);

    async function loadProprietes() {
        isLoadingProprietes = true;
        propertiesError = '';

        try {
            const response = await fetch('/dashboard/proprietes');
            const payload = await response.json() as ApiEnvelope<Propriete[] | null>;

            if (!response.ok) {
                propertiesError = payload.state ?? '[ERROR] Impossible de charger les proprietes.';
                proprieteList = [];
                return;
            }

            proprieteList = payload.data ?? [];
            if (payload.state.startsWith('[INFO]')) {
                propertiesError = payload.state;
            }
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

        if (!selectedPropriete?.id) return;
        quittances = []; // reset
        fetch(`/dashboard/quittances`)
            .then(r => r.json())
            .then((payload) => {
                const data = payload.data || [];
                console.log("Toutes les quittances retournées par l'API :", data);
                console.log("ID de la propriété sélectionnée :", selectedPropriete?.id);
                // On filtre les quittances pour ne garder que celles de la propriété sélectionnée
                quittances = Array.isArray(data) ? data.filter((q: any) => Number(q.propriete?.id) === Number(selectedPropriete?.id)) : [];
                console.log("Quittances après filtrage :", quittances);
            })
            .catch(() => {
                quittances = [];
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
                        ></iframe>
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
                            {#each quittances as q, i (q.id || i)}
                            <tr class="hover">
                                <td class="font-medium">{q.period || ''}</td>
                                <td class="text-sm">{q.tenant?.prenom || ''} {q.tenant?.nom || ''}</td>
                                <td class="font-mono font-semibold">{q.propriete ? (q.propriete.loyer + q.propriete.charges) : 0} €</td>
                                <td class="text-sm text-gray-400">{q.paymentDate || ''}</td>
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