<script lang="ts">
    import { onMount } from 'svelte';
    import { generateQuittance } from '$lib/stores/pdfGenerator.js';
    import ListPropriete from "$lib/components/dashboard/listPropriete.svelte";
    import ProprieteInfo from "$lib/components/dashboard/proprieteInfo.svelte";

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
    let isGeneratingQuittance = $state(false);
    let isCatchingUp = $state(false);
    let isResendingById = $state<Record<number, boolean>>({});

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
        if (normalized === 'envoyee' || normalized === 'envoye' || normalized === 'sent') return 'Envoyee';
        if (normalized === 'echec' || normalized === 'failed' || normalized === 'fail') return 'Echec';
        return 'Echec';
    }

    function getStatusBadgeClass(statut: string | null | undefined): string {
        const label = getStatusLabel(statut);
        if (label === 'Envoyee') return 'badge-success';
        if (label === 'En attente') return 'badge-warning';
        return 'badge-error';
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
            return;
        }

        isLoadingQuittances = true;

        try {
            const response = await fetch('/dashboard/quittances');
            const payload = await response.json() as ApiEnvelope<Quittance[] | null>;

            if (!response.ok) {
                actionError = payload.state ?? '[ERROR] Impossible de charger les quittances.';
                quittances = [];
                return;
            }

            const data = payload.data ?? [];
            quittances = Array.isArray(data)
                ? data.filter((q: Quittance) => Number(q.propriete?.id) === Number(selectedPropriete?.id))
                : [];
        } catch {
            actionError = 'Impossible de charger les quittances.';
            quittances = [];
        } finally {
            isLoadingQuittances = false;
        }
    }

    async function createQuittanceForPeriod(period: string): Promise<{ ok: boolean; state: string; status: number }> {
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
                    paymentDate: currentDateLabel(),
                    signatureCity: selectedPropriete.ville ?? '',
                    statut: 'ENVOYEE'
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
        isGeneratingQuittance = true;

        const result = await createQuittanceForPeriod(currentPeriodLabel());
        if (!result.ok) {
            actionError = result.state || '[ERROR] Impossible de generer la quittance.';
            isGeneratingQuittance = false;
            return;
        }

        actionMessage = '[SUCCESS] Quittance generee.';
        if (result.state) {
            actionMessage = result.state;
        }
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

    function downloadQuittance(q: Quittance) {
        if (!selectedPropriete) {
            actionError = '[ERROR] Selectionnez une propriete avant de telecharger.';
            return;
        }

        const rent = Number(q.propriete?.loyer ?? selectedPropriete.loyer ?? 0);
        const charges = Number(q.propriete?.charges ?? selectedPropriete.charges ?? 0);

        generateQuittance({
            proprio: {
                name: 'Proprietaire',
                address: '',
                city: selectedPropriete.ville ?? '',
                phone: '',
                email: ''
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

    onMount(async () => {
        await loadProprietes();
    });

    $effect(() => {
        if (!selectedPropriete?.adresse) return;

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
        on:select={(e: CustomEvent<{ id: Propriete }>) => selectedPropriete = e.detail.id}
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
                <button class="btn btn-outline btn-sm gap-2 border-gray-400 text-gray-500 hover:bg-gray-400 hover:text-base-100 hover:border-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    Modifier
                </button>
            </div>

            <div class="flex gap-6 w-full shrink-0">
                <ProprieteInfo
                    propriete={{
                        ...selectedPropriete,
                        locataire: selectedPropriete.locataire ?? undefined
                    }}
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
                        <button class="btn btn-sm btn-primary" onclick={generateCurrentQuittance} disabled={isGeneratingQuittance || isCatchingUp || isLoadingQuittances}>
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