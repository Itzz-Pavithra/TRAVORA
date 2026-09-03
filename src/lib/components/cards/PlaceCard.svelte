<script>
  let { place, onremove } = $props();
</script>

<div class="place-card card p-4 flex items-center justify-between">
  <div>
    <span class="badge badge-forest text-xs mb-1">{place.type?.toUpperCase() || 'PLACE'}</span>
    <h4 class="text-forest font-bold text-base">{place.name}</h4>
    <p class="text-xs text-gray">📍 {place.location}</p>
  </div>

  {#if onremove}
    <button class="btn-icon text-terracotta" onclick={() => onremove?.(place)} title="Remove bookmark">
      🔖
    </button>
  {/if}
</div>

<style>
  .place-card {
    background: var(--white);
  }
</style>
