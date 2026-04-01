<script lang="ts">
    import type { Snippet } from 'svelte';

    let {
        open = false,
        title = 'Modal',
        onClose = () => {},
        closeOnBackdrop = true,
        closeOnEscape = true,
        maxWidthClass = 'max-w-2xl',
        children,
        header,
        footer
    }: {
        open?: boolean;
        title?: string;
        onClose?: () => void;
        closeOnBackdrop?: boolean;
        closeOnEscape?: boolean;
        maxWidthClass?: string;
        children?: Snippet;
        header?: Snippet;
        footer?: Snippet;
    } = $props();

    function handleBackdropClick(event: MouseEvent) {
        if (!closeOnBackdrop) {
            return;
        }

        if (event.target === event.currentTarget) {
            onClose();
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (closeOnEscape && event.key === 'Escape') {
            onClose();
        }
    }
</script>

{#if open}
    <div
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabindex="0"
        onclick={handleBackdropClick}
        onkeydown={handleKeydown}
    >
        <div class={`w-full ${maxWidthClass} rounded-xl bg-base-100 shadow-xl border border-base-300`}>
            <div class="flex items-center justify-between border-b border-base-300 px-6 py-4">
                {#if header}
                    {@render header()}
                {:else}
                    <h3 class="text-lg font-bold">{title}</h3>
                {/if}
                <button type="button" class="btn btn-sm btn-ghost" onclick={onClose} aria-label="Fermer">✕</button>
            </div>

            <div class="px-6 py-4">
                {#if children}
                    {@render children()}
                {/if}
            </div>

            {#if footer}
                <div class="border-t border-base-300 px-6 py-4">
                    {@render footer()}
                </div>
            {/if}
        </div>
    </div>
{/if}
