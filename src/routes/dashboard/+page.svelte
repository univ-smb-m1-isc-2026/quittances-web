<script lang="ts">
    import { onMount } from 'svelte';
    import { generateQuittance } from '$lib/stores/pdfGenerator.js';
    import ListPropriete from "$lib/components/dashboard/listPropriete.svelte";
    import ProprieteInfo from "$lib/components/dashboard/proprieteInfo.svelte";
    import FormPropriete from '$lib/components/dashboard/FormPropriete.svelte';
    import ConfirmDelete from '$lib/components/dashboard/ConfirmDelete.svelte';
    import GenerateQuittanceModal from '$lib/components/dashboard/GenerateQuittanceModal.svelte';

    type Propriete = {
        id: number;
        adresse: string;
        ville: string;
        pays: string;
        loyer?: number;
        charges?: number;
        idLocataire?: number | null;
        locataire?: {
            id?: number;
            nom?: string;
            prenom?: string;
            email?: string;
            telephone?: string;
        } | null;
        image?: string | null;
        [key: string]: unknown;
    };

    type Quittance = {
        id?: number;
        period: string;
        locataire: {
            id?: number;
            nom: string;
            prenom: string;
            email?: string;
            telephone?: string;
        } | null;
        propriete: {
            id: number;
            loyer: number;
            charges: number;
            adresse?: string;
            ville?: string;
        } | null;
        paymentDate: string;
        statut: string | null;
        signatureCity?: string | null;
        signatureImage?: string | null;
    };

    type ProprioProfile = {
        id: number;
        nom: string;
        prenom: string;
        email: string;
        telephone: string;
    };

    type CreateQuittanceOptions = {
        paymentDate?: string;
        signatureCity?: string;
        signatureImage?: string | null;
        statut?: string;
    };

    type QuittanceEnCours = {
        id?: number;
        period: string;
        echeance: string;
        statutLabel: string;
    } | null;

    type GenerateModalConfirmDetail = {
        createData: {
            period: string;
            paymentDate: string;
            signatureCity: string;
            signatureImage: string | null;
            statut: string;
        };
        pdfData: {
            proprio: {
                name: string;
                address: string;
                city: string;
                phone: string;
                email: string;
            };
            locataire: {
                name: string;
                address: string;
                city: string;
                phone: string;
                email: string;
            };
            propertyAddress: string;
            propertyCity: string;
            rent: number;
            charges: number;
            period: string;
            paymentDate: string;
            signatureCity: string;
            signatureImage?: string;
        };
    };

    type ApiEnvelope<T> = {
        data: T;
        state: string;
    };

    let selectedPropriete = $state<Propriete | null>(null);
    let proprieteList = $state<Propriete[]>([]);
    let isLoadingProprietes = $state(true);
    let isLoadingQuittances = $state(false);
    let propertiesError = $state('');
    let actionError = $state('');
    let actionMessage = $state('');
    let quittances = $state<Quittance[]>([]);
    let currentProprio = $state<ProprioProfile | null>(null);
    let quittanceEnCours = $state<QuittanceEnCours>(null);
    let isGeneratingQuittance = $state(false);
    let isCatchingUp = $state(false);
    let isResendingById = $state<Record<number, boolean>>({});
    let isMarkingPaidById = $state<Record<number, boolean>>({});
    let showGenerateModal = $state(false);
    let showEditModal = $state(false);
    let showDeleteModal = $state(false);
    let isDeletingPropriete = $state(false);

    const FR_MONTHS = [
        'janvier',
        'fevrier',
        'mars',
        'avril',
        'mai',
        'juin',
        'juillet',
        'aout',
        'septembre',
        'octobre',
        'novembre',
        'decembre'
    ];

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

    async function loadCurrentProprio() {
        try {
            const response = await fetch('/dashboard/proprio');
            const payload = await response.json() as ApiEnvelope<ProprioProfile | null>;

            if (!response.ok) {
                currentProprio = null;
                return;
            }

            currentProprio = payload.data ?? null;
        } catch {
            currentProprio = null;
        }
    }

    function normalizeLabel(value: string): string {
        return value
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function currentPeriodLabel(): string {
        const now = new Date();
        const month = FR_MONTHS[now.getMonth()] ?? '';
        return `${month} ${now.getFullYear()}`;
    }

    function currentDateLabel(): string {
        return new Date().toLocaleDateString('fr-FR');
    }

    function getPastPeriodsCurrentYear(): string[] {
        const now = new Date();
        const year = now.getFullYear();
        const periods: string[] = [];

        for (let monthIndex = 0; monthIndex < now.getMonth(); monthIndex += 1) {
            periods.push(`${FR_MONTHS[monthIndex]} ${year}`);
        }

        return periods;
    }

    function getStatusLabel(statut: string | null | undefined): string {
        const normalized = normalizeLabel(statut ?? '').replace(/\s+/g, '_');
        if (normalized === 'en_attente' || normalized === 'pending') return 'En attente';
        if (normalized === 'payee' || normalized === 'paye' || normalized === 'paid') return 'Payee';
        if (normalized === 'envoyee' || normalized === 'envoye' || normalized === 'sent') return 'Envoyee';
        if (normalized === 'echec' || normalized === 'failed' || normalized === 'fail') return 'Echec';
        return 'Echec';
    }

    function getStatusBadgeClass(statut: string | null | undefined): string {
        const label = getStatusLabel(statut);
        if (label === 'Payee') return 'badge-primary';
        if (label === 'Envoyee') return 'badge-success';
        if (label === 'En attente') return 'badge-warning';
        return 'badge-error';
    }

    function isStatusPayee(statut: string | null | undefined): boolean {
        const normalized = normalizeLabel(statut ?? '').replace(/\s+/g, '_');
        return normalized === 'payee' || normalized === 'paye' || normalized === 'paid';
    }

    function periodRank(period: string | null | undefined): number {
        const normalized = normalizeLabel(period ?? '');
        if (!normalized) return Number.NEGATIVE_INFINITY;

        const parts = normalized.split(' ');
        if (parts.length < 2) return Number.NEGATIVE_INFINITY;

        const year = Number(parts[parts.length - 1]);
        if (Number.isNaN(year)) return Number.NEGATIVE_INFINITY;

        const monthLabel = parts.slice(0, parts.length - 1).join(' ');
        const monthIndex = FR_MONTHS.indexOf(monthLabel);
        if (monthIndex < 0) return Number.NEGATIVE_INFINITY;

        return year * 12 + monthIndex;
    }

    function findQuittanceEnCours(items: Quittance[]): Quittance | null {
        if (items.length === 0) {
            return null;
        }

        let current = items[0];
        let currentRank = periodRank(current.period);

        for (const quittance of items) {
            const rank = periodRank(quittance.period);
            if (rank > currentRank) {
                current = quittance;
                currentRank = rank;
            }
        }

        return current;
    }

    function refreshQuittanceEnCours(items: Quittance[]) {
        const current = findQuittanceEnCours(items);
        if (!current) {
            quittanceEnCours = null;
            return;
        }

        quittanceEnCours = {
            id: current.id,
            period: current.period ?? '-',
            echeance: current.paymentDate ?? '-',
            statutLabel: getStatusLabel(current.statut)
        };
    }

    function getSelectedLocataireId(): number | null {
        if (!selectedPropriete) return null;

        const fromIdLocataire = Number(selectedPropriete.idLocataire);
        if (!Number.isNaN(fromIdLocataire) && fromIdLocataire > 0) {
            return fromIdLocataire;
        }

        const fromLocataire = Number(selectedPropriete.locataire?.id);
        if (!Number.isNaN(fromLocataire) && fromLocataire > 0) {
            return fromLocataire;
        }

        return null;
    }

    async function loadQuittances() {
        if (!selectedPropriete?.id) {
            quittances = [];
            refreshQuittanceEnCours([]);
            return;
        }

        isLoadingQuittances = true;

        try {
            const response = await fetch('/dashboard/quittances');
            const payload = await response.json() as ApiEnvelope<Quittance[] | null>;

            if (!response.ok) {
                actionError = payload.state ?? '[ERROR] Impossible de charger les quittances.';
                quittances = [];
                refreshQuittanceEnCours([]);
                return;
            }

            const data = payload.data ?? [];
            quittances = Array.isArray(data)
                ? data.filter((q: Quittance) => Number(q.propriete?.id) === Number(selectedPropriete?.id))
                : [];
            refreshQuittanceEnCours(quittances);
        } catch {
            actionError = 'Impossible de charger les quittances.';
            quittances = [];
            refreshQuittanceEnCours([]);
        } finally {
            isLoadingQuittances = false;
        }
    }

    async function createQuittanceForPeriod(
        period: string,
        options: CreateQuittanceOptions = {}
    ): Promise<{ ok: boolean; state: string; status: number }> {
        if (!selectedPropriete?.id) {
            return { ok: false, state: '[ERROR] Aucune propriete selectionnee.', status: 400 };
        }

        const locataireId = getSelectedLocataireId();
        if (!locataireId) {
            return { ok: false, state: '[ERROR] Aucun locataire lie a cette propriete.', status: 400 };
        }

        try {
            const response = await fetch('/dashboard/quittances', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    proprieteId: Number(selectedPropriete.id),
                    locataireId,
                    period,
                    paymentDate: options.paymentDate ?? currentDateLabel(),
                    signatureCity: options.signatureCity ?? selectedPropriete.ville ?? '',
                    signatureImage: options.signatureImage ?? null,
                    statut: options.statut ?? 'ENVOYEE'
                })
            });

            const payload = await response.json() as ApiEnvelope<unknown>;
            return {
                ok: response.ok,
                state: payload.state ?? '',
                status: response.status
            };
        } catch {
            return {
                ok: false,
                state: '[ERROR] Impossible de communiquer avec le serveur.',
                status: 500
            };
        }
    }

    async function generateCurrentQuittance() {
        actionError = '';
        actionMessage = '';
        showGenerateModal = true;
    }

    function closeGenerateModal() {
        if (isGeneratingQuittance) return;
        showGenerateModal = false;
    }

    async function handleGenerateModalConfirm(event: CustomEvent<GenerateModalConfirmDetail>) {
        isGeneratingQuittance = true;
        actionError = '';
        actionMessage = '';

        const result = await createQuittanceForPeriod(event.detail.createData.period, {
            paymentDate: event.detail.createData.paymentDate,
            signatureCity: event.detail.createData.signatureCity,
            signatureImage: event.detail.createData.signatureImage,
            statut: event.detail.createData.statut
        });

        if (!result.ok) {
            actionError = result.state || '[ERROR] Impossible de generer la quittance.';
            isGeneratingQuittance = false;
            return;
        }

        actionMessage = '[SUCCESS] Quittance generee.';
        if (result.state) {
            actionMessage = result.state;
        }

        generateQuittance(event.detail.pdfData);
        showGenerateModal = false;
        await loadQuittances();
        isGeneratingQuittance = false;
    }

    async function catchUpPastPeriods() {
        actionError = '';
        actionMessage = '';
        isCatchingUp = true;

        const existing = new Set(quittances.map((q) => normalizeLabel(q.period ?? '')));
        const candidates = getPastPeriodsCurrentYear();
        const missing = candidates.filter((period) => !existing.has(normalizeLabel(period)));

        if (missing.length === 0) {
            actionMessage = '[INFO] Aucune periode manquante a rattraper.';
            isCatchingUp = false;
            return;
        }

        let created = 0;
        let skipped = 0;

        for (const period of missing) {
            const result = await createQuittanceForPeriod(period);
            if (result.ok) {
                created += 1;
                continue;
            }

            if (result.status === 409 || normalizeLabel(result.state).includes('deja existante')) {
                skipped += 1;
                continue;
            }

            actionError = result.state || `[ERROR] Echec pendant le rattrapage de la periode ${period}.`;
            isCatchingUp = false;
            await loadQuittances();
            return;
        }

        actionMessage = `[SUCCESS] Rattrapage termine: ${created} creee(s), ${skipped} deja existante(s).`;
        await loadQuittances();
        isCatchingUp = false;
    }

    async function resendQuittance(quittanceId: number | undefined) {
        if (!quittanceId) return;

        actionError = '';
        actionMessage = '';
        isResendingById = {
            ...isResendingById,
            [quittanceId]: true
        };

        try {
            const response = await fetch(`/dashboard/quittances/${quittanceId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    statut: 'ENVOYEE',
                    paymentDate: currentDateLabel(),
                    signatureCity: selectedPropriete?.ville ?? ''
                })
            });

            const payload = await response.json() as ApiEnvelope<unknown>;
            if (!response.ok) {
                actionError = payload.state ?? '[ERROR] Impossible de renvoyer la quittance.';
                return;
            }

            actionMessage = payload.state ?? '[SUCCESS] Quittance renvoyee.';
            await loadQuittances();
        } catch {
            actionError = '[ERROR] Impossible de renvoyer la quittance.';
        } finally {
            isResendingById = {
                ...isResendingById,
                [quittanceId]: false
            };
        }
    }

    async function markAsPaid(quittanceId: number | undefined) {
        if (!quittanceId) return;

        actionError = '';
        actionMessage = '';
        isMarkingPaidById = {
            ...isMarkingPaidById,
            [quittanceId]: true
        };

        try {
            const response = await fetch(`/dashboard/quittances/${quittanceId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    statut: 'PAYEE'
                })
            });

            const payload = await response.json() as ApiEnvelope<unknown>;
            if (!response.ok) {
                actionError = payload.state ?? '[ERROR] Impossible de valider cette quittance comme payee.';
                return;
            }

            actionMessage = payload.state ?? '[SUCCESS] Quittance marquee comme payee.';
            await loadQuittances();
        } catch {
            actionError = '[ERROR] Impossible de valider cette quittance comme payee.';
        } finally {
            isMarkingPaidById = {
                ...isMarkingPaidById,
                [quittanceId]: false
            };
        }
    }

    function resendCurrentQuittance() {
        void resendQuittance(quittanceEnCours?.id);
    }

    function downloadQuittance(q: Quittance) {
        if (!selectedPropriete) {
            actionError = '[ERROR] Selectionnez une propriete avant de telecharger.';
            return;
        }

        const rent = Number(q.propriete?.loyer ?? selectedPropriete.loyer ?? 0);
        const charges = Number(q.propriete?.charges ?? selectedPropriete.charges ?? 0);
        const ownerName = `${currentProprio?.prenom ?? ''} ${currentProprio?.nom ?? ''}`.trim() || 'Proprietaire';

        generateQuittance({
            proprio: {
                name: ownerName,
                address: '',
                city: selectedPropriete.ville ?? '',
                phone: currentProprio?.telephone ?? '',
                email: currentProprio?.email ?? ''
            },
            locataire: {
                name: `${q.locataire?.prenom ?? ''} ${q.locataire?.nom ?? ''}`.trim() || 'Locataire',
                address: '',
                city: selectedPropriete.ville ?? '',
                phone: q.locataire?.telephone ?? '',
                email: q.locataire?.email ?? ''
            },
            propertyAddress: selectedPropriete.adresse ?? '',
            propertyCity: selectedPropriete.ville ?? '',
            rent,
            charges,
            period: q.period ?? currentPeriodLabel(),
            paymentDate: q.paymentDate ?? currentDateLabel(),
            signatureCity: q.signatureCity ?? selectedPropriete.ville ?? '',
            signatureImage: q.signatureImage ?? undefined
        });
    }
    
    function openEditModal() {
        if (!selectedPropriete) return;
        showEditModal = true;
    }

    function closeEditModal() {
        showEditModal = false;
    }

    function openDeleteModal() {
        if (!selectedPropriete) return;
        showDeleteModal = true;
    }

    function closeDeleteModal() {
        if (isDeletingPropriete) return;
        showDeleteModal = false;
    }

    async function deleteProperty() {
        if (!selectedPropriete?.id) {
            return;
        }

        isDeletingPropriete = true;
        propertiesError = '';

        try {
            const response = await fetch('/dashboard/proprietes', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedPropriete.id })
            });

            const payload = await response.json() as ApiEnvelope<null>;

            if (!response.ok) {
                propertiesError = payload.state ?? '[ERROR] Impossible de supprimer la propriete.';
                return;
            }

            const deletedId = selectedPropriete.id;
            proprieteList = proprieteList.filter((p) => p.id !== deletedId);
            selectedPropriete = proprieteList.length > 0 ? proprieteList[0] : null;
            showDeleteModal = false;
        } catch {
            propertiesError = 'Impossible de supprimer la propriété pour le moment.';
        } finally {
            isDeletingPropriete = false;
        }
    }

    function handlePropertyUpdated(event: CustomEvent<{ property: Propriete }>) {
        const updatedProperty = event.detail.property;
        proprieteList = proprieteList.map((p) => p.id === updatedProperty.id ? updatedProperty : p);
        selectedPropriete = updatedProperty;
    }

    function handlePropertySelect(event: CustomEvent<{ id: Propriete }>) {
        selectedPropriete = event.detail.id;
    }

    onMount(async () => {
        await Promise.all([loadProprietes(), loadCurrentProprio()]);
    });

    $effect(() => {
        if (!selectedPropriete?.adresse) {
            quittances = [];
            refreshQuittanceEnCours([]);
            return;
        }

        actionError = '';
        actionMessage = '';

        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(selectedPropriete.adresse + ', ' + selectedPropriete.ville + ', ' + selectedPropriete.pays)}`)
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    longitude = parseFloat(data[0].lon);
                    latitude = parseFloat(data[0].lat);
                }
            })
            .catch(() => {
                longitude = 0;
                latitude = 0;
            });

        void loadQuittances();
    });
    

</script>

<div class="flex h-[calc(100vh-4rem)]">
    <ListPropriete
        proprieteList={proprieteList}
        isLoading={isLoadingProprietes}
        on:select={handlePropertySelect}
        on:propertyCreated={loadProprietes}
    />
    <div class="border-l border-t border-gray-400 h-full w-full rounded-tl-xl p-6 bg-base-300 flex flex-col">
        {#if propertiesError}
            <div class="mb-4 rounded-md border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
                {propertiesError}
            </div>
        {/if}

        {#if selectedPropriete}
            <div class="flex items-center justify-between mb-6 shrink-0">
                <div class="text-4xl font-bold">
                    Tableau de bord - {selectedPropriete.adresse}, {selectedPropriete.ville}, {selectedPropriete.pays}
                </div>
                <div class="flex items-center gap-2">
                    <button class="btn btn-outline btn-sm gap-2 border-gray-400 text-gray-500 hover:bg-gray-400 hover:text-base-100 hover:border-gray-400" onclick={openEditModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                        Modifier
                    </button>
                    <button class="btn btn-sm btn-error text-white" onclick={openDeleteModal}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 1.5L6.75 2.25H3V3.75H3.75V15C3.75 15.3917 3.8935 15.791 4.17627 16.0737C4.45904 16.3565 4.85833 16.5 5.25 16.5H12.75C13.1417 16.5 13.541 16.3565 13.8237 16.0737C14.1065 15.791 14.25 15.3917 14.25 15V3.75H15V2.25H11.25L10.5 1.5H7.5ZM5.25 3.75H12.75V15H5.25V3.75ZM6.75 5.25V13.5H8.25V5.25H6.75ZM9.75 5.25V13.5H11.25V5.25H9.75Z" fill="#D1DBFF"/>
                        </svg>
                        Supprimer
                    </button>
                </div>
            </div>

            <div class="flex gap-6 w-full shrink-0">
                <ProprieteInfo
                    propriete={{
                        ...selectedPropriete,
                        locataire: selectedPropriete.locataire ?? undefined,
                        quittanceEnCours
                    }}
                    onResendQuittance={resendCurrentQuittance}
                />
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

            <div class="flex-1 mt-6 bg-base-100 border rounded-lg border-gray-400 flex flex-col overflow-hidden min-h-0">
                <div class="flex items-center justify-between px-6 py-4 border-b border-gray-300">
                    <h2 class="font-semibold text-lg">Historique des quittances</h2>
                    <div class="flex gap-2">
                        <button class="btn btn-sm btn-ghost" onclick={catchUpPastPeriods} disabled={isCatchingUp || isGeneratingQuittance || isLoadingQuittances}>
                            {#if isCatchingUp}Rattrapage...{:else}Catch-up periodes passees{/if}
                        </button>
                        <button class="btn btn-sm btn-primary" onclick={generateCurrentQuittance} disabled={isGeneratingQuittance || isCatchingUp || isLoadingQuittances || showGenerateModal}>
                            {#if isGeneratingQuittance}Generation...{:else}+ Generer une quittance{/if}
                        </button>
                    </div>
                </div>

                {#if actionError}
                    <div class="mx-6 mt-4 rounded-md border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
                        {actionError}
                    </div>
                {/if}

                {#if actionMessage}
                    <div class="mx-6 mt-4 rounded-md border border-success/40 bg-success/10 px-4 py-3 text-sm text-success">
                        {actionMessage}
                    </div>
                {/if}

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
                            {#if isLoadingQuittances}
                            <tr>
                                <td colspan="6" class="text-center py-12 text-gray-400 text-sm">
                                    Chargement des quittances...
                                </td>
                            </tr>
                            {:else}
                            {#each quittances as q, i (q.id || i)}
                            <tr class="hover">
                                <td class="font-medium">{q.period || ''}</td>
                                <td class="text-sm">{q.locataire?.prenom || ''} {q.locataire?.nom || ''}</td>
                                <td class="font-mono font-semibold">{q.propriete ? (q.propriete.loyer + q.propriete.charges) : 0} €</td>
                                <td class="text-sm text-gray-400">{q.paymentDate || ''}</td>
                                <td>
                                    <span class={`badge badge-sm ${getStatusBadgeClass(q.statut)}`}>{getStatusLabel(q.statut)}</span>
                                </td>
                                <td class="flex gap-1">
                                    <button class="btn btn-ghost btn-xs" title="Telecharger PDF" onclick={() => downloadQuittance(q)}>⬇</button>
                                    <button
                                        class="btn btn-ghost btn-xs"
                                        title="Renvoyer"
                                        onclick={() => resendQuittance(q.id)}
                                        disabled={q.id ? isResendingById[q.id] : true}
                                    >
                                        ✉
                                    </button>
                                    <button
                                        class="btn btn-ghost btn-xs"
                                        title="Valider payee"
                                        onclick={() => markAsPaid(q.id)}
                                        disabled={q.id ? Boolean(isMarkingPaidById[q.id]) || isStatusPayee(q.statut) : true}
                                    >
                                        ✓
                                    </button>
                                </td>
                            </tr>
                            {:else}
                            <tr>
                                <td colspan="6" class="text-center py-12 text-gray-400 text-sm">
                                    Aucune quittance générée pour cette propriété
                                </td>
                            </tr>
                            {/each}
                            {/if}
                        </tbody>
                    </table>
                </div>
            </div>
        {:else}
            <div class="text-gray-500">Sélectionnez une propriété pour voir les détails</div>
        {/if}
    </div>
</div>

<FormPropriete
    open={showEditModal}
    mode="edit"
    propriete={selectedPropriete}
    on:close={closeEditModal}
    on:saved={handlePropertyUpdated}
/>

<ConfirmDelete
    open={showDeleteModal}
    title="Supprimer la propriete"
    message="Cette action est irreversible. Voulez-vous vraiment supprimer cette propriete ?"
    on:close={closeDeleteModal}
    on:confirm={deleteProperty}
/>

<GenerateQuittanceModal
    open={showGenerateModal}
    isSubmitting={isGeneratingQuittance}
    proprio={currentProprio}
    locataire={selectedPropriete?.locataire ?? null}
    propriete={selectedPropriete ? {
        adresse: selectedPropriete.adresse,
        ville: selectedPropriete.ville,
        loyer: Number(selectedPropriete.loyer ?? 0),
        charges: Number(selectedPropriete.charges ?? 0)
    } : null}
    defaultPeriod={currentPeriodLabel()}
    defaultDate={currentDateLabel()}
    on:close={closeGenerateModal}
    on:confirm={handleGenerateModalConfirm}
/>