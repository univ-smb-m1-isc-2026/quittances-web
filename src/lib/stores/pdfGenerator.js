import { jsPDF } from 'jspdf'

/**
 * @typedef {Object} Lessor
 * @property {string} name
 * @property {string} address
 * @property {string} city
 * @property {string} phone
 * @property {string} email
 */

/**
 * @typedef {Object} Tenant
 * @property {string} name
 * @property {string} address
 * @property {string} city
 * @property {string} phone
 * @property {string} email
 */

/**
 * @typedef {Object} QuittanceData
 * @property {Lessor} lessor
 * @property {Tenant} tenant
 * @property {string} propertyAddress
 * @property {string} propertyCity
 * @property {number} rent
 * @property {number} charges
 * @property {string} period      - e.g. "février 2026"
 * @property {string} paymentDate - e.g. "01/02/2026"
 * @property {string} signatureCity
 */

/**
 * Builds the jsPDF document without saving it.
 * @param {QuittanceData} data
 * @returns {import('jspdf').jsPDF}
 */
function buildDoc(data) {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    const total = (data.rent + data.charges).toFixed(2)
    const pageW = doc.internal.pageSize.getWidth()
    const margin = 20

    // ── Helpers ─────────────────────────────────────────────────────────────
    const centerText = (text, y) => {
        doc.text(text, pageW / 2, y, { align: 'center' })
    }

    const line = (y) => {
        doc.setDrawColor(180)
        doc.line(margin, y, pageW - margin, y)
    }

    // ── Title ────────────────────────────────────────────────────────────────
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    centerText('QUITTANCE DE LOYER', 28)

    doc.setFontSize(13)
    centerText(`Période : ${data.period}`, 37)

    line(43)

    // ── Bailleur ─────────────────────────────────────────────────────────────
    let y = 52
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('BAILLEUR', margin, y)
    doc.setFont('helvetica', 'normal')
    y += 7
    doc.text(data.lessor.name, margin, y)
    y += 6
    doc.text(data.lessor.address, margin, y)
    y += 6
    doc.text(data.lessor.city, margin, y)
    if (data.lessor.phone) { y += 6; doc.text(`Tél. : ${data.lessor.phone}`, margin, y) }
    if (data.lessor.email) { y += 6; doc.text(`Email : ${data.lessor.email}`, margin, y) }

    // ── Locataire ─────────────────────────────────────────────────────────────
    let yT = 52
    const colRight = pageW / 2 + 5
    doc.setFont('helvetica', 'bold')
    doc.text('LOCATAIRE', colRight, yT)
    doc.setFont('helvetica', 'normal')
    yT += 7
    doc.text(data.tenant.name, colRight, yT)
    yT += 6
    doc.text(data.tenant.address, colRight, yT)
    yT += 6
    doc.text(data.tenant.city, colRight, yT)
    if (data.tenant.phone) { yT += 6; doc.text(`Tél. : ${data.tenant.phone}`, colRight, yT) }
    if (data.tenant.email) { yT += 6; doc.text(`Email : ${data.tenant.email}`, colRight, yT) }

    y = Math.max(y, yT) + 8
    line(y)

    // ── Logement ──────────────────────────────────────────────────────────────
    y += 10
    doc.setFont('helvetica', 'bold')
    doc.text('LOGEMENT', margin, y)
    doc.setFont('helvetica', 'normal')
    y += 7
    doc.text(data.propertyAddress, margin, y)
    y += 6
    doc.text(data.propertyCity, margin, y)

    y += 10
    line(y)

    // ── Corps de la quittance ─────────────────────────────────────────────────
    y += 12
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)

    const bodyLines = doc.splitTextToSize(
        `Je soussigné(e), ${data.lessor.name}, propriétaire du logement désigné ci-dessus, ` +
        `déclare avoir reçu de ${data.tenant.name}, locataire dudit logement, ` +
        `la somme de ${total} € (${data.rent.toFixed(2)} € de loyer + ${data.charges.toFixed(2)} € de charges), ` +
        `au titre du loyer et des charges du mois de ${data.period}, ` +
        `réglée le ${data.paymentDate}.`,
        pageW - margin * 2
    )
    doc.text(bodyLines, margin, y)
    y += bodyLines.length * 6 + 4

    const disclaimer = doc.splitTextToSize(
        `Cette quittance annule tous les reçus qui auraient pu être établis précédemment ` +
        `en cas de paiement partiel dudit loyer.`,
        pageW - margin * 2
    )
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(9.5)
    doc.text(disclaimer, margin, y)
    y += disclaimer.length * 5 + 6

    line(y)

    // ── Tableau récapitulatif ──────────────────────────────────────────────────
    y += 10
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text('Récapitulatif', margin, y)
    y += 8

    const col1 = margin
    const col2 = pageW - margin - 30

    const row = (label, value) => {
        doc.setFont('helvetica', 'normal')
        doc.text(label, col1, y)
        doc.text(`${value} €`, col2, y, { align: 'right' })
        y += 7
    }

    doc.setFont('helvetica', 'normal')
    row('Loyer', data.rent.toFixed(2))
    row('Charges', data.charges.toFixed(2))

    doc.setDrawColor(100)
    line(y)
    y += 4

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Total', col1, y)
    doc.text(`${total} €`, col2, y, { align: 'right' })

    // ── Signature ─────────────────────────────────────────────────────────────
    y += 20
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    const today = new Date().toLocaleDateString('fr-FR')
    doc.text(`Fait à ${data.signatureCity}, le ${today}`, margin, y)
    y += 14
    doc.text('Signature du bailleur :', margin, y)
    // Signature placeholder box
    doc.setDrawColor(150)
    doc.rect(margin + 45, y - 5, 60, 20)

    // ── Pied de page ──────────────────────────────────────────────────────────
    const pageH = doc.internal.pageSize.getHeight()
    doc.setFontSize(8)
    doc.setTextColor(150)
    centerText("Document généré automatiquement – Quittances App", pageH - 10)

    return doc
}

/**
 * Generates and downloads a French rent receipt (quittance de loyer) as a PDF.
 * @param {QuittanceData} data
 */
export function generateQuittance(data) {
    buildDoc(data).save(`quittance_${data.period.replace(' ', '_')}.pdf`)
}

/**
 * Returns the PDF as a Uint8Array for canvas-based preview rendering.
 * @param {QuittanceData} data
 * @returns {Uint8Array}
 */
export function getPdfBytes(data) {
    return buildDoc(data).output('arraybuffer')
}