<script>
  let { title = '', maxWidth = '540px', onclose, children, header } = $props();

  function handleKeydown(e) {
    if (e.key === 'Escape' && onclose) {
      onclose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="modal-backdrop" onclick={(e) => { if (e.target === e.currentTarget) onclose?.(); }} role="dialog" aria-modal="true" tabindex="-1">
  <div class="modal-box" style="max-width:{maxWidth}">
    {#if header}
      {@render header()}
    {:else if title}
      <div class="modal-header">
        <h3 class="modal-title">{title}</h3>
        <button class="btn-icon" onclick={() => onclose?.()} aria-label="Close modal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    {/if}

    <div class="modal-body">
      {@render children?.()}
    </div>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(23, 63, 53, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--sp-4);
    animation: fadeIn var(--transition-fast) ease;
  }

  .modal-box {
    background: var(--white);
    border-radius: var(--radius-lg);
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border);
    animation: slideUp 0.25s ease;
  }

  .modal-header {
    padding: var(--sp-5) var(--sp-6);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .modal-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--forest);
  }

  .modal-body {
    padding: var(--sp-6);
  }
</style>
