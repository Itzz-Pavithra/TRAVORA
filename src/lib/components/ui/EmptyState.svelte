<script>
  let { icon = '🗺️', title, description = '', actionLabel = '', onaction } = $props();
</script>

<div class="empty-state card p-12 text-center">
  <div class="empty-icon text-5xl mb-3">{icon}</div>
  <h3 class="empty-title text-forest font-bold mb-2">{title}</h3>
  {#if description}
    <p class="empty-desc text-gray text-sm max-w-sm mx-auto mb-6">{description}</p>
  {/if}
  {#if actionLabel && onaction}
    <button class="btn btn-primary" onclick={onaction}>
      {actionLabel}
    </button>
  {/if}
</div>

<style>
  .empty-state {
    background: var(--white);
  }
  .max-w-sm { max-width: 24rem; }
  .mx-auto { margin-left: auto; margin-right: auto; }
</style>
