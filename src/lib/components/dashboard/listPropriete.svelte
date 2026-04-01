<script>
    import { createEventDispatcher } from 'svelte';

    let proprieteList = [
        {
            id: 1,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJGG3scjreflg1MpNXasD6QKorkr71acjmIoUIAORphrlpXqmrBv_cTFw4ttXAApyU07THdCDrQ_SP0T6WKhUqIqyKAVjcpD0cuB6MHbAIQw&s=10",
            nom: "Propriété 1",
            adresse: "444 Rue des Jonquilles",
            ville: "Le Cheylas",
            pays: "France",
            locataire: "ntm va"
        },
        {
            id: 2,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJGG3scjreflg1MpNXasD6QKorkr71acjmIoUIAORphrlpXqmrBv_cTFw4ttXAApyU07THdCDrQ_SP0T6WKhUqIqyKAVjcpD0cuB6MHbAIQw&s=10",
            nom: "Propriété 2",
            adresse: "49 Rue Du Rhône",
            ville: "Chambery",
            pays: "France",
            locataire: "nathan roi"
        },
        {
            id: 3,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJGG3scjreflg1MpNXasD6QKorkr71acjmIoUIAORphrlpXqmrBv_cTFw4ttXAApyU07THdCDrQ_SP0T6WKhUqIqyKAVjcpD0cuB6MHbAIQw&s=10",
            nom: "Propriété 3",
            adresse: "789 Boulevard Tertiaire",
            ville: "Ville",
            pays: "Pays",
            locataire: "Timéo le beau gosse"
        },
        {
            id: 4,
            image: "https://via.placeholder.com/150?text=Maison+4",
            nom: "Propriété 4",
            adresse: "12 Rue des Lilas",
            ville: "Paris",
            pays: "France",
            locataire: "locataire 4"
        },
        {
            id: 5,
            image: "https://via.placeholder.com/150?text=Maison+5",
            nom: "Propriété 5",
            adresse: "34 Avenue des Champs",
            ville: "Lyon",
            pays: "France",
            locataire: "locataire 5"
        },
        {
            id: 6,
            image: "https://via.placeholder.com/150?text=Maison+6",
            nom: "Propriété 6",
            adresse: "56 Boulevard Voltaire",
            ville: "Marseille",
            pays: "France",
            locataire: "locataire 6"
        },
        {
            id: 7,
            image: "https://via.placeholder.com/150?text=Maison+7",
            nom: "Propriété 7",
            adresse: "78 Rue de la Paix",
            ville: "Nice",
            pays: "France",
            locataire: "locataire 7"
        }
    ];

    let collapsed = false;
    /** @type {number|null} */
    let selectedId = proprieteList[0].id;
    const dispatch = createEventDispatcher();
</script>

<div class="flex flex-col h-full bg-base-100 gap-2 p-2 transition-[width] duration-300 ease-in-out overflow-hidden {collapsed ? 'w-18' : 'w-1/4'}">

    <!-- Header -->
    <div class="flex items-center flex-shrink-0 h-13">
        <button
            on:click={() => collapsed = !collapsed}
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
        {#each proprieteList as propriete (propriete.id)}
            <button
                type="button"
                class="flex h-13 rounded-lg overflow-hidden cursor-pointer flex-shrink-0 transition-colors items-center
                    {collapsed ? 'w-13' : 'w-full gap-2'}
                    {selectedId === propriete.id ? 'bg-primary text-primary-content' : 'bg-base-300 hover:bg-gray-100'}"
                title={collapsed ? `${propriete.adresse} — ${propriete.ville}` : ''}
                on:click={() => { selectedId = propriete.id; dispatch('select', { id: propriete }); }}
                aria-pressed={selectedId === propriete.id}
            >
                <div class="relative h-13 w-13 flex-shrink-0">
                    <img
                        src={propriete.image}
                        alt={propriete.nom}
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
    <button class="flex items-center justify-center h-13 rounded-xl bg-primary text-primary-content font-bold shadow-md hover:bg-primary/90 transition-colors cursor-pointer text-base flex-shrink-0 overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5 h-5 fill-primary-content flex-shrink-0">
            <path d="M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/>
        </svg>
        <div class="overflow-hidden transition-[max-width,opacity] duration-300 ease-in-out {collapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'}">
            <span class="whitespace-nowrap ml-2">Ajouter une propriété</span>
        </div>
    </button>

</div>