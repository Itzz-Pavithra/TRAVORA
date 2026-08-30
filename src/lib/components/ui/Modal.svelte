<script lang="ts">
  interface Props {
    title?: string;
    maxWidth?: string;
    onclose?: () => void;
    children?: import('svelte').Snippet;
    header?: import('svelte').Snippet;
    footer?: import('svelte').Snippet;
  }

  let { title, maxWidth = '520px', onclose, children, header, footer }: Props = $props();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onclose?.();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modal-backdrop" onclick={(e) => { if (e.target === e.currentTarget) onclose?.(); }} role="dialog" aria-modal="true">
  <div class="modal-box" style="max-width:{maxWidth}">
    {#if header}
      {@render header()}
    {:else if title}
      <div class="modal-header">
        <h3 class="modal-title">{title}</h3>
        {#if onclose}
          <button class="modal-close" onclick={onclose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        {/if}
      </div>
    {/if}

    <div class="modal-body">
      {#if children}
        {@render children()}
      {/if}
    </div>

    {#if footer}
      <div class="modal-footer">
        {@render footer()}
      </div>
    {/if}
  </div>
</div>

<style>
  .modal-title {
    font-size: 1.1875rem;
    font-weight: 600;
    color: var(--forest);
  }

  .modal-close {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--gray);
    padding: var(--sp-1);
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);
  }
  .modal-close:hover { background: var(--forest-10); color: var(--forest); }
</style>
