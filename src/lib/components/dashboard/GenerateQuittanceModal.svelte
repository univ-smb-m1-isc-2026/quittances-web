<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Modal from '$lib/components/ui/Modal.svelte';

    type Proprio = {
        nom?: string;
        prenom?: string;
        email?: string;
        telephone?: string;
    } | null;

    type Locataire = {
        nom?: string;
        prenom?: string;
        email?: string;
        telephone?: string;
    } | null;

    type Propriete = {
        adresse?: string;
        ville?: string;
        loyer?: number;
        charges?: number;
    } | null;

    type ConfirmPayload = {
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

    let {
        open = false,
        isSubmitting = false,
        proprio = null,
        locataire = null,
        propriete = null,
        defaultPeriod = '',
        defaultDate = ''
    }: {
        open?: boolean;
        isSubmitting?: boolean;
        proprio?: Proprio;
        locataire?: Locataire;
        propriete?: Propriete;
        defaultPeriod?: string;
        defaultDate?: string;
    } = $props();

    const dispatch = createEventDispatcher<{
        close: void;
        confirm: ConfirmPayload;
    }>();

    let wasOpen = $state(false);
    let formError = $state('');

    let proprioName = $state('');
    let proprioAddress = $state('');
    let proprioCity = $state('');
    let proprioPhone = $state('');
    let proprioEmail = $state('');

    let locataireName = $state('');
    let locataireAddress = $state('');
    let locataireCity = $state('');
    let locatairePhone = $state('');
    let locataireEmail = $state('');

    let propertyAddress = $state('');
    let propertyCity = $state('');
    let rent = $state('0');
    let charges = $state('0');
    let period = $state('');
    let paymentDate = $state('');
    let signatureCity = $state('');

    let signatureImage = $state<string | undefined>(undefined);
    let signaturePreview = $state<string | null>(null);

    $effect(() => {
        if (open && !wasOpen) {
            resetForm();
        }

        wasOpen = open;
    });

    function resetForm() {
        proprioName = `${proprio?.prenom ?? ''} ${proprio?.nom ?? ''}`.trim();
        proprioAddress = '';
        proprioCity = '';
        proprioPhone = proprio?.telephone ?? '';
        proprioEmail = proprio?.email ?? '';

        locataireName = `${locataire?.prenom ?? ''} ${locataire?.nom ?? ''}`.trim();
        locataireAddress = '';
        locataireCity = propriete?.ville ?? '';
        locatairePhone = locataire?.telephone ?? '';
        locataireEmail = locataire?.email ?? '';

        propertyAddress = propriete?.adresse ?? '';
        propertyCity = propriete?.ville ?? '';
        rent = String(Number(propriete?.loyer ?? 0));
        charges = String(Number(propriete?.charges ?? 0));
        period = defaultPeriod;
        paymentDate = defaultDate;
        signatureCity = propriete?.ville ?? '';

        signatureImage = undefined;
        signaturePreview = null;
        formError = '';
    }

    function closeModal() {
        if (isSubmitting) return;
        dispatch('close');
    }

    function handleSignatureUpload(event: Event) {
        const input = event.currentTarget as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            if (typeof result === 'string') {
                signatureImage = result;
                signaturePreview = URL.createObjectURL(file);
            }
        };
        reader.readAsDataURL(file);
    }

    function clearSignature() {
        signatureImage = undefined;
        signaturePreview = null;
    }

    function handleConfirm() {
        formError = '';

        if (!period.trim()) {
            formError = 'La periode est obligatoire.';
            return;
        }

        if (!paymentDate.trim()) {
            formError = 'La date de paiement est obligatoire.';
            return;
        }

        if (!signatureCity.trim()) {
            formError = 'La ville de signature est obligatoire.';
            return;
        }

        if (!proprioName.trim()) {
            formError = 'Le nom du bailleur est obligatoire.';
            return;
        }

        if (!locataireName.trim()) {
            formError = 'Le nom du locataire est obligatoire.';
            return;
        }

        const parsedRent = Number(rent);
        const parsedCharges = Number(charges);

        dispatch('confirm', {
            createData: {
                period: period.trim(),
                paymentDate: paymentDate.trim(),
                signatureCity: signatureCity.trim(),
                signatureImage: signatureImage ?? null,
                statut: 'ENVOYEE'
            },
            pdfData: {
                proprio: {
                    name: proprioName.trim(),
                    address: proprioAddress.trim(),
                    city: proprioCity.trim(),
                    phone: proprioPhone.trim(),
                    email: proprioEmail.trim()
                },
                locataire: {
                    name: locataireName.trim(),
                    address: locataireAddress.trim(),
                    city: locataireCity.trim(),
                    phone: locatairePhone.trim(),
                    email: locataireEmail.trim()
                },
                propertyAddress: propertyAddress.trim(),
                propertyCity: propertyCity.trim(),
                rent: Number.isFinite(parsedRent) ? parsedRent : 0,
                charges: Number.isFinite(parsedCharges) ? parsedCharges : 0,
                period: period.trim(),
                paymentDate: paymentDate.trim(),
                signatureCity: signatureCity.trim(),
                signatureImage
            }
        });
    }
</script>

<Modal open={open} title="Generer une quittance" onClose={closeModal} maxWidthClass="max-w-4xl">
    <div class="grid gap-4 max-h-[70vh] overflow-y-auto pr-1">
        {#if formError}
            <div class="rounded-md border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
                {formError}
            </div>
        {/if}

        <div class="grid gap-3 rounded-lg border border-base-300 p-4">
            <h3 class="font-semibold">Bailleur</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label class="form-control w-full">
                    <span class="label-text mb-1">Nom complet</span>
                    <input class="input input-bordered w-full" bind:value={proprioName} placeholder="Nom Prenom" />
                </label>
                <label class="form-control w-full">
                    <span class="label-text mb-1">Adresse</span>
                    <input class="input input-bordered w-full" bind:value={proprioAddress} placeholder="Adresse bailleur" />
                </label>
                <label class="form-control w-full">
                    <span class="label-text mb-1">Ville</span>
                    <input class="input input-bordered w-full" bind:value={proprioCity} placeholder="Ville bailleur" />
                </label>
                <label class="form-control w-full">
                    <span class="label-text mb-1">Telephone</span>
                    <input class="input input-bordered w-full" bind:value={proprioPhone} placeholder="06 00 00 00 00" />
                </label>
                <label class="form-control w-full md:col-span-2">
                    <span class="label-text mb-1">Email</span>
                    <input class="input input-bordered w-full" bind:value={proprioEmail} placeholder="bailleur@exemple.fr" />
                </label>
            </div>
        </div>

        <div class="grid gap-3 rounded-lg border border-base-300 p-4">
            <h3 class="font-semibold">Locataire</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label class="form-control w-full">
                    <span class="label-text mb-1">Nom complet</span>
                    <input class="input input-bordered w-full" bind:value={locataireName} placeholder="Nom Prenom" />
                </label>
                <label class="form-control w-full">
                    <span class="label-text mb-1">Adresse</span>
                    <input class="input input-bordered w-full" bind:value={locataireAddress} placeholder="Adresse locataire" />
                </label>
                <label class="form-control w-full">
                    <span class="label-text mb-1">Ville</span>
                    <input class="input input-bordered w-full" bind:value={locataireCity} placeholder="Ville locataire" />
                </label>
                <label class="form-control w-full">
                    <span class="label-text mb-1">Telephone</span>
                    <input class="input input-bordered w-full" bind:value={locatairePhone} placeholder="06 00 00 00 00" />
                </label>
                <label class="form-control w-full md:col-span-2">
                    <span class="label-text mb-1">Email</span>
                    <input class="input input-bordered w-full" bind:value={locataireEmail} placeholder="locataire@exemple.fr" />
                </label>
            </div>
        </div>

        <div class="grid gap-3 rounded-lg border border-base-300 p-4">
            <h3 class="font-semibold">Logement et paiement</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label class="form-control w-full">
                    <span class="label-text mb-1">Adresse du bien</span>
                    <input class="input input-bordered w-full" bind:value={propertyAddress} placeholder="Adresse du bien" />
                </label>
                <label class="form-control w-full">
                    <span class="label-text mb-1">Ville du bien</span>
                    <input class="input input-bordered w-full" bind:value={propertyCity} placeholder="Ville du bien" />
                </label>
                <label class="form-control w-full">
                    <span class="label-text mb-1">Periode</span>
                    <input class="input input-bordered w-full" bind:value={period} placeholder="avril 2026" />
                </label>
                <label class="form-control w-full">
                    <span class="label-text mb-1">Date de paiement</span>
                    <input class="input input-bordered w-full" bind:value={paymentDate} placeholder="03/04/2026" />
                </label>
                <label class="form-control w-full">
                    <span class="label-text mb-1">Loyer</span>
                    <input class="input input-bordered w-full" bind:value={rent} type="number" min="0" step="0.01" />
                </label>
                <label class="form-control w-full">
                    <span class="label-text mb-1">Charges</span>
                    <input class="input input-bordered w-full" bind:value={charges} type="number" min="0" step="0.01" />
                </label>
            </div>
        </div>

        <div class="grid gap-3 rounded-lg border border-base-300 p-4">
            <h3 class="font-semibold">Signature</h3>
            <label class="form-control w-full">
                <span class="label-text mb-1">Ville de signature</span>
                <input class="input input-bordered w-full" bind:value={signatureCity} placeholder="Ville" />
            </label>
            <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onchange={handleSignatureUpload}
                class="file-input file-input-bordered w-full"
            />
            {#if signaturePreview}
                <div class="space-y-2">
                    <div class="border border-base-300 rounded-lg p-2 bg-base-100 flex items-center justify-center w-fit">
                        <img src={signaturePreview} alt="Signature" class="max-h-16 max-w-40" />
                    </div>
                    <button type="button" class="btn btn-sm btn-outline btn-error" onclick={clearSignature}>
                        Supprimer la signature
                    </button>
                </div>
            {/if}
        </div>

        <div class="flex justify-end gap-2 pb-1">
            <button type="button" class="btn btn-ghost" onclick={closeModal} disabled={isSubmitting}>Annuler</button>
            <button type="button" class="btn btn-primary" onclick={handleConfirm} disabled={isSubmitting}>
                {#if isSubmitting}Generation...{:else}Generer{/if}
            </button>
        </div>
    </div>
</Modal>
