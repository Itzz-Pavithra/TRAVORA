<script lang="ts">
  import { notifications } from '$lib/stores';
</script>

<div class="toast-container" aria-live="polite" aria-atomic="true">
  {#each $notifications as notif (notif.id)}
    <div class="toast {notif.type}" role="alert">
      <span class="toast-icon">
        {#if notif.type === 'success'}✓{:else if notif.type === 'error'}✕{:else}ℹ{/if}
      </span>
      <span class="toast-msg">{notif.message}</span>
      <button class="toast-close" onclick={() => notifications.dismiss(notif.id)} aria-label="Dismiss">✕</button>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    bottom: calc(var(--bottom-nav-height) + var(--sp-4));
    right: var(--sp-5);
    z-index: 2000;
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
    pointer-events: none;
  }

  @media (min-width: 769px) {
    .toast-container {
      bottom: var(--sp-5);
    }
  }

  .toast {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    padding: var(--sp-3) var(--sp-4);
    border-radius: var(--radius-md);
    font-size: 0.9rem;
    font-weight: 500;
    box-shadow: var(--shadow-lg);
    pointer-events: all;
    animation: slideInRight var(--transition-normal) ease;
    min-width: 260px;
    max-width: 380px;
    color: var(--white);
  }

  .toast.success { background: var(--forest); }
  .toast.error   { background: #b94a3a; }
  .toast.info    { background: var(--gray-dark); }

  .toast-icon {
    font-size: 0.875rem;
    font-weight: 700;
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .toast-msg { flex: 1; }

  .toast-close {
    background: none;
    border: none;
    color: rgba(255,255,255,0.7);
    cursor: pointer;
    font-size: 0.75rem;
    padding: 2px;
    flex-shrink: 0;
  }
  .toast-close:hover { color: white; }
</style>
