<script>
    import { generateQuittance } from '$lib/stores/pdfGenerator.js'
    import QuittancePreview from '$lib/components/QuittancePreview.svelte'

    // Compute current month label as default period
    const now = new Date()
    const defaultPeriod = now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    const defaultDate = now.toLocaleDateString('fr-FR')

    let lessor = {
        name: '',
        address: '',
        city: '',
        phone: '',
        email: ''
    }

    let tenant = {
        name: '',
        address: '',
        city: '',
        phone: '',
        email: ''
    }

    let property = {
        address: '',
        city: ''
    }

    let payment = {
        rent: '',
        charges: '0',
        period: defaultPeriod,
        paymentDate: defaultDate,
        signatureCity: ''
    }

    /** @type {string | undefined} */
    let signatureImage = undefined
    
    /** @type {string | null} */
    let signaturePreview = null

    /**
     * @param {Event} event
     */
    function handleSignatureUpload(event) {
        const input = /** @type {HTMLInputElement} */ (event.target)
        const file = input.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const result = e.target?.result
                if (typeof result === 'string') {
                    signatureImage = result
                    signaturePreview = URL.createObjectURL(file)
                    refreshPreview()
                }
            }
            reader.readAsDataURL(file)
        }
    }

    function clearSignature() {
        signatureImage = undefined
        signaturePreview = null
        refreshPreview()
    }

    function handleGenerate() {
        generateQuittance({
            lessor,
            tenant,
            propertyAddress: property.address,
            propertyCity: property.city,
            rent: parseFloat(payment.rent) || 0,
            charges: parseFloat(payment.charges) || 0,
            period: payment.period,
            paymentDate: payment.paymentDate,
            signatureCity: payment.signatureCity,
            signatureImage
        })
    }

    // Snapshot only updated on field blur → preview never refreshes during typing
    let previewData = buildSnapshot()

    function buildSnapshot() {
        return {
            lessor: { name: lessor.name, address: lessor.address, city: lessor.city, phone: lessor.phone, email: lessor.email },
            tenant: { name: tenant.name, address: tenant.address, city: tenant.city, phone: tenant.phone, email: tenant.email },
            propertyAddress: property.address,
            propertyCity: property.city,
            rent: parseFloat(payment.rent) || 0,
            charges: parseFloat(payment.charges) || 0,
            period: payment.period,
            paymentDate: payment.paymentDate,
            signatureCity: payment.signatureCity,
            signatureImage
        }
    }

    function refreshPreview() {
        previewData = buildSnapshot()
    }
</script>

<div class="p-6">
    <div class="mb-6">
        <h1 class="text-3xl font-bold">Générer une quittance de loyer</h1>
        <p class="text-base-content/60 mt-1">Remplissez les informations ci-dessous puis cliquez sur Générer.</p>
    </div>

    <div class="flex gap-8 items-start">

        <!-- ── Formulaire ──────────────────────────────────────────── -->
        <div class="flex-1 space-y-6 min-w-0">
    <!-- Bailleur -->
    <div class="card bg-base-200 shadow">
        <div class="card-body space-y-4">
            <h2 class="card-title text-lg">Bailleur</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label class="form-control w-full">
                    <span class="label-text mb-1">Nom complet *</span>
                    <input class="input input-bordered w-full" bind:value={lessor.name} on:blur={refreshPreview} placeholder="Nom Prénom" required />
                </label>
                <label class="form-control w-full">
                    <span class="label-text mb-1">Adresse *</span>
                    <input class="input input-bordered w-full" bind:value={lessor.address} on:blur={refreshPreview} placeholder="12 rue de la Paix" required />
                </label>
                <label class="form-control w-full">
                    <span class="label-text mb-1">Ville *</span>
                    <input class="input input-bordered w-full" bind:value={lessor.city} on:blur={refreshPreview} placeholder="75001 Paris" required />
                </label>
                <label class="form-control w-full">
                    <span class="label-text mb-1">Téléphone</span>
                    <input class="input input-bordered w-full" bind:value={lessor.phone} on:blur={refreshPreview} placeholder="06 00 00 00 00" />
                </label>
                <label class="form-control w-full md:col-span-2">
                    <span class="label-text mb-1">Email</span>
                    <input class="input input-bordered w-full" bind:value={lessor.email} on:blur={refreshPreview} type="email" placeholder="bailleur@exemple.fr" />
                </label>
            </div>
        </div>
    </div>

    <!-- Locataire -->
    <div class="card bg-base-200 shadow">
        <div class="card-body space-y-4">
            <h2 class="card-title text-lg">Locataire</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label class="form-control w-full">
                    <span class="label-text mb-1">Nom complet *</span>
                    <input class="input input-bordered w-full" bind:value={tenant.name} on:blur={refreshPreview} placeholder="Nom Prénom" required />
                </label>
                <label class="form-control w-full">
                    <span class="label-text mb-1">Adresse actuelle *</span>
                    <input class="input input-bordered w-full" bind:value={tenant.address} on:blur={refreshPreview} placeholder="5 avenue des Lilas" required />
                </label>
                <label class="form-control w-full">
                    <span class="label-text mb-1">Ville *</span>
                    <input class="input input-bordered w-full" bind:value={tenant.city} on:blur={refreshPreview} placeholder="69001 Lyon" required />
                </label>
                <label class="form-control w-full">
                    <span class="label-text mb-1">Téléphone</span>
                    <input class="input input-bordered w-full" bind:value={tenant.phone} on:blur={refreshPreview} placeholder="06 00 00 00 00" />
                </label>
                <label class="form-control w-full md:col-span-2">
                    <span class="label-text mb-1">Email</span>
                    <input class="input input-bordered w-full" bind:value={tenant.email} on:blur={refreshPreview} type="email" placeholder="locataire@exemple.fr" />
                </label>
            </div>
        </div>
    </div>

    <!-- Logement -->
    <div class="card bg-base-200 shadow">
        <div class="card-body space-y-4">
            <h2 class="card-title text-lg">Logement loué</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label class="form-control w-full">
                    <span class="label-text mb-1">Adresse du bien *</span>
                    <input class="input input-bordered w-full" bind:value={property.address} on:blur={refreshPreview} placeholder="8 impasse des Roses" required />
                </label>
                <label class="form-control w-full">
                    <span class="label-text mb-1">Ville *</span>
                    <input class="input input-bordered w-full" bind:value={property.city} on:blur={refreshPreview} placeholder="13001 Marseille" required />
                </label>
            </div>
        </div>
    </div>

    <!-- Signature -->
    <div class="card bg-base-200 shadow">
        <div class="card-body space-y-4">
            <h2 class="card-title text-lg">Signature</h2>
            <p class="text-sm text-base-content/70">Téléchargez une image PNG de votre signature pour l'inclure dans la quittance</p>
            <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                on:change={handleSignatureUpload}
                class="file-input file-input-bordered w-full"
            />
            {#if signaturePreview}
                <div class="space-y-2">
                    <p class="text-sm font-semibold">Aperçu de la signature :</p>
                    <div class="border border-base-300 rounded-lg p-2 bg-base-100 flex items-center justify-center max-w-xs">
                        <img src={signaturePreview} alt="Signature preview" class="max-h-24 max-w-48" />
                    </div>
                    <button
                        type="button"
                        on:click={clearSignature}
                        class="btn btn-sm btn-outline btn-error"
                    >
                        Supprimer la signature
                    </button>
                </div>
            {/if}
        </div>
    </div>

    <!-- Paiement -->
    <div class="card bg-base-200 shadow">
        <div class="card-body space-y-4">
            <h2 class="card-title text-lg">Paiement</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label class="form-control w-full">
                    <span class="label-text mb-1">Période (mois) *</span>
                    <input class="input input-bordered w-full" bind:value={payment.period} on:blur={refreshPreview} placeholder="février 2026" required />
                </label>
                <label class="form-control w-full">
                    <span class="label-text mb-1">Date de paiement *</span>
                    <input class="input input-bordered w-full" bind:value={payment.paymentDate} on:blur={refreshPreview} placeholder="01/02/2026" required />
                </label>
                <label class="form-control w-full">
                    <span class="label-text mb-1">Loyer hors charges (€) *</span>
                    <input class="input input-bordered w-full" bind:value={payment.rent} on:blur={refreshPreview} type="number" min="0" step="0.01" placeholder="800.00" required />
                </label>
                <label class="form-control w-full">
                    <span class="label-text mb-1">Charges (€)</span>
                    <input class="input input-bordered w-full" bind:value={payment.charges} on:blur={refreshPreview} type="number" min="0" step="0.01" placeholder="50.00" />
                </label>
                <label class="form-control w-full">
                    <span class="label-text mb-1">Ville de signature *</span>
                    <input class="input input-bordered w-full" bind:value={payment.signatureCity} on:blur={refreshPreview} placeholder="Paris" required />
                </label>
                <div class="form-control w-full flex justify-end items-end">
                    <div class="stat bg-base-100 rounded-box p-4 w-full">
                        <div class="stat-title">Total à payer</div>
                        <div class="stat-value text-primary">
                            {((parseFloat(payment.rent) || 0) + (parseFloat(payment.charges) || 0)).toFixed(2)} €
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

        <!-- Bouton -->
        <div class="flex justify-end">
            <button
                class="btn btn-primary btn-lg"
                on:click={handleGenerate}
                disabled={!lessor.name || !tenant.name || !property.address || !payment.rent || !payment.period}
            >
                Générer la quittance PDF
            </button>
        </div>

        </div><!-- end form column -->

        <!-- ── Prévisualisation ────────────────────────────────────── -->
        <aside class="w-[420px] shrink-0 sticky top-6 hidden lg:block">
            <div class="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-2">Prévisualisation</div>
            <QuittancePreview data={previewData} />
        </aside>

    </div><!-- end flex row -->
</div>
