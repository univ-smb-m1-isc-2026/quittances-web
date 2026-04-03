<script lang="ts">
    let {
        propriete
    }: {
        propriete: {
            statut?: string;
            loyer?: number;
            periodicite?: number;
            locataire?: {
                prenom?: string;
                nom?: string;
            } | null;
            quittanceEnCours?: string;
            [key: string]: unknown;
        };
    } = $props();
</script>

<div class="flex flex-col bg-base-100 rounded-lg p-4 border-gray-400 border-1 w-2/3">
    <div class="text-2xl font-bold">Details et Quittance Actuelle</div>
    <div class="flex w-full gap-4">
        <div class="flex justify-between w-1/2">
            <div class="flex flex-col divide-y divide-gray-300 [&>div]:py-2 font-medium text-lg
                [&>div]:flex [&>div]:justify-between w-full
            ">
                <div>
                    <div>Locataire</div>
                    <div>
                        {#if propriete.locataire?.prenom || propriete.locataire?.nom}
                            {propriete.locataire?.prenom ?? ''} {propriete.locataire?.nom ?? ''}
                        {:else}
                            Non renseigne
                        {/if}
                    </div>
                </div>
                <div><div>Loyer</div> <div>{propriete.loyer}</div></div>
                <div class="items-start">
                    <div>Periodicite</div>
                    <div>{propriete.periodicite ?? '-'} mois</div>
                </div>
            </div>
        </div>
        <div class="flex flex-col justify-between w-1/2">
            <div class="flex flex-col divide-y divide-gray-300 [&>div]:py-2 font-medium text-lg
                [&>div]:flex [&>div]:justify-between w-full
            ">
                <div><div>Quittance en cours</div> <div>{propriete.quittanceEnCours}</div></div> <!-- quittanceEnCours.name -->
                <div><div>Échéance</div> <div>{propriete.quittanceEnCours}</div></div> <!-- quittanceEnCours.echeance -->
                <div><div>Statut</div> <div>{propriete.quittanceEnCours}</div></div> <!-- quittanceEnCours.status -->
                
            </div>
            <button type="button" class="border-1 border-gray-400 text-gray-400 py-1 px-2 rounded-md font-semibold hover:bg-gray-400 hover:text-base-100 transition-colors">
                Renvoyez une quittance
            </button>
        </div>
    </div>
</div>