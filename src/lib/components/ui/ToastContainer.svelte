<script>
  import { notifications } from '$lib/stores/index.js';
</script>

<div class="toast-container" role="region" aria-label="Notifications">
  {#each $notifications as toast (toast.id)}
    <div class="toast toast-{toast.type}">
      <span>{toast.type === 'error' ? '⚠️' : '✨'}</span>
      <p>{toast.message}</p>
      <button class="toast-close" onclick={() => notifications.dismiss(toast.id)} aria-label="Close notification">✕</button>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    bottom: var(--sp-6);
    right: var(--sp-6);
    z-index: 2000;
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    pointer-events: none;
  }

  .toast {
    pointer-events: auto;
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    padding: var(--sp-3) var(--sp-4);
    background: var(--forest);
    color: var(--white);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    font-size: 0.875rem;
    animation: slideUp 0.3s ease;
  }

  .toast-error {
    background: #b94a3a;
  }

  .toast p {
    margin: 0;
  }

  .toast-close {
    background: none;
    border: none;
    color: currentColor;
    opacity: 0.7;
    cursor: pointer;
    margin-left: auto;
    font-size: 0.75rem;
  }

  .toast-close:hover { opacity: 1; }
</style>
