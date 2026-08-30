<script lang="ts">
  import type { SavedPlace } from '$lib/types';

  interface Props {
    place: SavedPlace;
    onremove?: (id: string) => void;
  }

  let { place, onremove }: Props = $props();

  const typeIcons: Record<string, string> = {
    destination: '🏖️',
    restaurant: '🍽️',
    hotel: '🏨',
    activity: '🎟️'
  };
</script>

<div class="place-card card">
  <div class="place-cover">
    <div class="place-placeholder">
      <span>{typeIcons[place.type] || '📍'}</span>
    </div>
    {#if onremove}
      <button 
        class="remove-btn" 
        onclick={() => onremove?.(place.id)}
        title="Remove saved place"
        aria-label="Remove saved place"
      >
        ✕
      </button>
    {/if}
  </div>

  <div class="card-body">
    <span class="badge badge-forest text-xs mb-1">{place.type.toUpperCase()}</span>
    <h4 class="place-name">{place.name}</h4>
    <p class="place-location text-xs text-gray">{place.location}</p>
    <div class="text-xs text-gray mt-2">Saved on {new Date(place.savedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</div>
  </div>
</div>

<style>
  .place-card {
    overflow: hidden;
  }

  .place-cover {
    position: relative;
    height: 120px;
    background: var(--cream);
  }

  .place-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    background: linear-gradient(135deg, var(--forest-10) 0%, var(--terracotta-10) 100%);
  }

  .remove-btn {
    position: absolute;
    top: var(--sp-2);
    right: var(--sp-2);
    background: rgba(255,255,255,0.9);
    border: none;
    border-radius: 50%;
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--gray);
    font-size: 0.75rem;
    transition: all var(--transition-fast);
  }

  .remove-btn:hover {
    background: var(--white);
    color: var(--terracotta);
  }

  .place-name {
    font-size: 1rem;
    font-weight: 700;
    color: var(--forest);
  }
</style>
