<script>
    import { getPdfBytes } from '$lib/stores/pdfGenerator.js'
    import { onMount, onDestroy } from 'svelte'

    /** @type {import('$lib/stores/pdfGenerator.js').QuittanceData} */
    export let data

    const DISPLAY_W = 420

    /** @type {HTMLCanvasElement} */
    let canvas
    let rendering = false
    let pendingData = null
    let pdfjs = null  // loaded client-side only

    onMount(async () => {
        // Dynamic import keeps pdfjs-dist out of SSR entirely
        pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
            'pdfjs-dist/build/pdf.worker.min.mjs',
            import.meta.url
        ).href
        // Render with whatever data is current once the lib is ready
        render(data)
    })

    onDestroy(() => {
        // Free the canvas GPU backing store
        if (canvas) { canvas.width = 0; canvas.height = 0 }
    })

    async function render(d) {
        if (!canvas || !pdfjs) return
        if (rendering) {
            pendingData = d
            return
        }
        rendering = true
        pendingData = null
        let pdfDoc = null
        try {
            const bytes  = getPdfBytes(d)
            pdfDoc = await pdfjs.getDocument({ data: bytes }).promise
            const page   = await pdfDoc.getPage(1)

            const base     = page.getViewport({ scale: 1 })
            const scale    = (DISPLAY_W / base.width) * 2
            const viewport = page.getViewport({ scale })

            // Render into an offscreen canvas first — visible canvas stays intact
            const offscreen = new OffscreenCanvas(viewport.width, viewport.height)
            await page.render({
                canvasContext: offscreen.getContext('2d'),
                viewport
            }).promise

            // Atomic swap: resize + draw in one shot, no blank frame
            canvas.width  = viewport.width
            canvas.height = viewport.height
            canvas.style.width  = DISPLAY_W + 'px'
            canvas.style.height = Math.round(viewport.height / 2) + 'px'
            if (canvas.parentElement) {
                canvas.parentElement.style.height = Math.round(viewport.height / 2) + 'px'
            }
            canvas.getContext('2d').drawImage(offscreen, 0, 0)
        } finally {
            // Free all pdfjs internal caches and font/image buffers for this document
            if (pdfDoc) pdfDoc.destroy()
            rendering = false
            if (pendingData) render(pendingData)
        }
    }

    // Called by parent on field blur — re-render with new snapshot
    $: if (canvas && pdfjs) render(data)
</script>

<div
    class="rounded shadow-2xl overflow-hidden border border-gray-200 bg-white"
    style="width:{DISPLAY_W}px;"
>
    <canvas bind:this={canvas} style="display:block;"></canvas>
</div>
