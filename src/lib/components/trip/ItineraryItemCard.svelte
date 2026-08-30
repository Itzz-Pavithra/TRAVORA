<script lang="ts">
  import type { ItineraryItem } from '$lib/types';

  interface Props {
    item: ItineraryItem;
    onedit?: (item: ItineraryItem) => void;
    ondelete?: (id: string) => void;
  }

  let { item, onedit, ondelete }: Props = $props();

  const typeIcons: Record<string, string> = {
    accommodation: '🏨',
    transport: '✈️',
    food: '🍽️',
    activity: '🏖️',
    sightseeing: '🏛️',
    other: '📍'
  };
</script>

<div class="itinerary-item-card">
  <div class="time-col">
    <span class="time-text">{item.time}</span>
  </div>

  <div class="node-col">
    <div class="node-icon">{typeIcons[item.type] || '📍'}</div>
    <div class="node-line"></div>
  </div>

  <div class="content-col card">
    <div class="card-body">
      <div class="flex items-start justify-between">
        <div>
          <h4 class="item-title">{item.title}</h4>
          {#if item.location}
            <p class="item-location text-xs text-gray flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {item.location}
            </p>
          {/if}
        </div>

        <div class="item-actions flex items-center gap-1">
          {#if onedit}
            <button 
              class="btn-icon text-gray" 
              onclick={() => onedit?.(item)}
              title="Edit activity"
              aria-label="Edit activity"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
          {/if}
          {#if ondelete}
            <button 
              class="btn-icon text-gray" 
              onclick={() => ondelete?.(item.id)}
              title="Delete activity"
              aria-label="Delete activity"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          {/if}
        </div>
      </div>

      {#if item.notes}
        <p class="item-notes text-xs text-gray mt-2">{item.notes}</p>
      {/if}

      <div class="flex items-center gap-4 mt-3 pt-2 border-t text-xs text-gray">
        {#if item.duration}
          <span class="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {item.duration}
          </span>
        {/if}
        {#if item.cost && item.cost > 0}
          <span class="font-semibold text-forest">Est. ₹{item.cost.toLocaleString('en-IN')}</span>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .itinerary-item-card {
    display: flex;
    gap: var(--sp-3);
    position: relative;
  }

  .time-col {
    width: 60px;
    padding-top: var(--sp-3);
    text-align: right;
    flex-shrink: 0;
  }

  .time-text {
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--forest);
  }

  .node-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 32px;
    flex-shrink: 0;
  }

  .node-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--white);
    border: 2px solid var(--forest);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9375rem;
    z-index: 2;
    box-shadow: var(--shadow-sm);
  }

  .node-line {
    flex: 1;
    width: 2px;
    background: var(--border-strong);
    margin-top: 4px;
    margin-bottom: -4px;
  }

  .content-col {
    flex: 1;
    margin-bottom: var(--sp-4);
  }

  .item-title {
    font-size: 1rem;
    font-weight: 700;
    color: var(--forest);
    margin-bottom: 2px;
  }

  .border-t {
    border-top: 1px solid var(--border);
  }
</style>
