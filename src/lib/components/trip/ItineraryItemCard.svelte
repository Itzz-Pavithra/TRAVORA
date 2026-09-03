<script>
  let { item, onedit, ondelete } = $props();

  const iconMap = {
    activity: '🏄',
    sightseeing: '🏛️',
    food: '🍲',
    transport: '✈️',
    accommodation: '🏨',
    other: '📍'
  };
</script>

<div class="itinerary-card card p-4 mb-3 flex items-start gap-4">
  <div class="time-column flex-shrink-0 text-center">
    <span class="time-badge">{item.time}</span>
    <span class="type-icon text-2xl block mt-1">{iconMap[item.type] || '📍'}</span>
  </div>

  <div class="flex-1">
    <div class="flex items-center justify-between">
      <h4 class="item-title font-bold text-forest">{item.title}</h4>
      <div class="flex items-center gap-2">
        {#if item.cost}
          <span class="badge badge-terracotta text-xs">₹{item.cost.toLocaleString('en-IN')}</span>
        {/if}
        {#if onedit}
          <button class="btn-icon text-gray" onclick={() => onedit?.(item)} title="Edit item">✏️</button>
        {/if}
        {#if ondelete}
          <button class="btn-icon text-gray" onclick={() => ondelete?.(item.id)} title="Delete item">✕</button>
        {/if}
      </div>
    </div>

    {#if item.location}
      <span class="location-tag text-xs text-gray block mt-1">📍 {item.location}</span>
    {/if}

    {#if item.notes}
      <p class="notes-text text-xs text-gray mt-2">{item.notes}</p>
    {/if}
  </div>
</div>

<style>
  .itinerary-card {
    background: var(--white);
    border: 1px solid var(--border);
  }

  .time-badge {
    background: var(--forest-10);
    color: var(--forest);
    padding: 3px 8px;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 700;
  }

  .flex-shrink-0 { flex-shrink: 0; }
  .block { display: block; }
</style>
