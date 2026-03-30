<script>
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
                adresse: "12 Rue des Lilas, Paris, France",
                ville: "Paris",
                pays: "France",
                locataire: "locataire 4"
            },
            {
                id: 5,
                image: "https://via.placeholder.com/150?text=Maison+5",
                nom: "Propriété 5",
                adresse: "34 Avenue des Champs, Lyon, France",
                ville: "Lyon",
                pays: "France",
                locataire: "locataire 5"
            },
            {
                id: 6,
                image: "https://via.placeholder.com/150?text=Maison+6",
                nom: "Propriété 6",
                adresse: "56 Boulevard Voltaire, Marseille, France",
                ville: "Marseille",
                pays: "France",
                locataire: "locataire 6"
            },
            {
                id: 7,
                image: "https://via.placeholder.com/150?text=Maison+7",
                nom: "Propriété 7",
                adresse: "78 Rue de la Paix, Nice, France",
                ville: "Nice",
                pays: "France",
                locataire: "locataire 7"
            },
            {
                id: 8,
                image: "https://via.placeholder.com/150?text=Maison+8",
                nom: "Propriété 8",
                adresse: "90 Avenue Jean Jaurès, Bordeaux, France",
                ville: "Bordeaux",
                pays: "France",
                locataire: "locataire 8"
            },
            {
                id: 9,
                image: "https://via.placeholder.com/150?text=Maison+9",
                nom: "Propriété 9",
                adresse: "101 Rue Nationale, Lille, France",
                ville: "Lille",
                pays: "France",
                locataire: "locataire 9"
            },
            {
                id: 10,
                image: "https://via.placeholder.com/150?text=Maison+10",
                nom: "Propriété 10",
                adresse: "202 Avenue de la République, Toulouse, France",
                ville: "Toulouse",
                pays: "France",
                locataire: "locataire 10"
            },
            {
                id: 11,
                image: "https://via.placeholder.com/150?text=Maison+11",
                nom: "Propriété 11",
                adresse: "303 Boulevard Saint-Germain, Paris, France",
                ville: "Paris",
                pays: "France",
                locataire: "locataire 11"
            },
            {
                id: 12,
                image: "https://via.placeholder.com/150?text=Maison+12",
                nom: "Propriété 12",
                adresse: "404 Rue Victor Hugo, Nantes, France",
                ville: "Nantes",
                pays: "France",
                locataire: "locataire 12"
            },
            {
                id: 13,
                image: "https://via.placeholder.com/150?text=Maison+13",
                nom: "Propriété 13",
                adresse: "505 Avenue de la Liberté, Strasbourg, France",
                ville: "Strasbourg",
                pays: "France",
                locataire: "locataire 13"
            },
            {
                id: 14,
                image: "https://via.placeholder.com/150?text=Maison+14",
                nom: "Propriété 14",
                adresse: "606 Boulevard Carnot, Montpellier, France",
                ville: "Montpellier",
                pays: "France",
                locataire: "locataire 14"
            },
            {
                id: 15,
                image: "https://via.placeholder.com/150?text=Maison+15",
                nom: "Propriété 15",
                adresse: "707 Rue de la Gare, Rennes, France",
                ville: "Rennes",
                pays: "France",
                locataire: "locataire 15"
            },
            {
                id: 16,
                image: "https://via.placeholder.com/150?text=Maison+16",
                nom: "Propriété 16",
                adresse: "808 Avenue du Général Leclerc, Dijon, France",
                ville: "Dijon",
                pays: "France",
                locataire: "locataire 16"
            },
            {
                id: 17,
                image: "https://via.placeholder.com/150?text=Maison+17",
                nom: "Propriété 17",
                adresse: "909 Boulevard de la Mer, Toulon, France",
                ville: "Toulon",
                pays: "France",
                locataire: "locataire 17"
            },
            {
                id: 18,
                image: "https://via.placeholder.com/150?text=Maison+18",
                nom: "Propriété 18",
                adresse: "1010 Rue des Fleurs, Grenoble, France",
                ville: "Grenoble",
                pays: "France",
                locataire: "locataire 18"
            },
            {
                id: 19,
                image: "https://via.placeholder.com/150?text=Maison+19",
                nom: "Propriété 19",
                adresse: "1111 Avenue des Alpes, Annecy, France",
                ville: "Annecy",
                pays: "France",
                locataire: "locataire 19"
            },
            {
                id: 20,
                image: "https://via.placeholder.com/150?text=Maison+20",
                nom: "Propriété 20",
                adresse: "1212 Boulevard du Lac, Aix-les-Bains, France",
                ville: "Aix-les-Bains",
                pays: "France",
                locataire: "locataire 20"
            },
            {
                id: 21,
                image: "https://via.placeholder.com/150?text=Maison+21",
                nom: "Propriété 21",
                adresse: "1313 Rue du Soleil, Perpignan, France",
                ville: "Perpignan",
                pays: "France",
                locataire: "locataire 21"
            },
            {
                id: 22,
                image: "https://via.placeholder.com/150?text=Maison+22",
                nom: "Propriété 22",
                adresse: "1414 Avenue des Pyrénées, Pau, France",
                ville: "Pau",
                pays: "France",
                locataire: "locataire 22"
            },
            {
                id: 23,
                image: "https://via.placeholder.com/150?text=Maison+23",
                nom: "Propriété 23",
                adresse: "1515 Boulevard des Platanes, Béziers, France",
                ville: "Béziers",
                pays: "France",
                locataire: "locataire 23"
            }
    ];

    let collapsed = false;
</script>

<div class="flex flex-col h-[calc(100vh-5rem)] bg-base-100 rounded-2xl shadow-lg p-2 gap-2
            border border-gray-100 transition-all duration-300 ease-in-out {collapsed ? 'w-18' : 'w-1/4'}">

    <div class="flex items-center flex-shrink-0 {collapsed ? 'justify-center' : 'justify-between px-1'}">
        {#if !collapsed}
            <h2 class="text-2xl font-bold text-primary">Mes propriétés</h2>
        {/if}
        <button
            on:click={() => collapsed = !collapsed}
            class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0 h-14 w-14 flex items-center justify-center"
            aria-label={collapsed ? 'Ouvrir' : 'Réduire'}
        >
        {#if collapsed}
            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/>
            </svg>
        {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/>
            </svg>
        {/if}
        </button>
    </div>

    <ul class="flex-1 min-h-0 flex flex-col gap-2 w-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {#each proprieteList as propriete (propriete.id)}
        <li
            class="flex gap-2 items-center bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 cursor-pointer border border-gray-200 flex-shrink-0 {collapsed ? 'justify-center' : ''}"
            title={collapsed ? `${propriete.adresse} — ${propriete.ville}` : ''}
        >
            <img src={propriete.image} alt={propriete.nom} class="w-14 h-14 object-cover flex-shrink-0" />
            {#if !collapsed}
            <div class="flex-1 min-w-0 mr-2">
                <p class="text-lg font-semibold text-gray-800 truncate">{propriete.adresse}</p>
                <p class="text-sm text-gray-500">{propriete.ville}, {propriete.pays}</p>
            </div>
            {/if}
        </li>
        {/each}
    </ul>

    <button class="flex items-center justify-center gap-2 h-14 rounded-xl bg-primary text-white font-bold shadow-md hover:bg-primary/90 transition-colors cursor-pointer text-base flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5 h-5 fill-white flex-shrink-0">
            <path d="M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/>
        </svg>
        {#if !collapsed}
            <span>Ajouter une propriété</span>
        {/if}
    </button>

</div>