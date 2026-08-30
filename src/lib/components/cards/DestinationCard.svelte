<script lang="ts">
  import type { Destination } from '$lib/types';

  interface Props {
    destination: Destination;
    saved?: boolean;
    onsave?: () => void;
  }

  let { destination, saved = false, onsave }: Props = $props();

  const gradients: Record<string, string> = {
    'Goa': 'linear-gradient(135deg, #D97745 0%, #173F35 100%)',
    'Kerala': 'linear-gradient(135deg, #173F35 0%, #66736F 100%)',
    'Singapore': 'linear-gradient(135deg, #4a5550 0%, #173F35 100%)',
    'Rajasthan': 'linear-gradient(135deg, #c4632e 0%, #173F35 100%)',
    'Himachal Pradesh': 'linear-gradient(135deg, #173F35 0%, #4a5550 100%)',
    'Bali': 'linear-gradient(135deg, #D97745 0%, #c4632e 100%)',
  };

  const emojis: Record<string, string> = {
    'Goa': '🏖️', 'Kerala': '🌿', 'Singapore': '🌃',
    'Rajasthan': '🏰', 'Himachal Pradesh': '🏔️', 'Bali': '🌺'
  };
</script>

<div class="dest-card card">
  <div class="dest-cover" style="background:{gradients[destination.name] || 'linear-gradient(135deg, #173F35 0%, #D97745 100%)'}">
    {#if destination.image}
      <img src={destination.image} alt={destination.name} class="img-cover" onerror={(e) => (e.currentTarget as HTMLImageElement).style.display='none'} />
    {/if}
    <div class="dest-overlay"></div>
    <div class="dest-emoji">{emojis[destination.name] || '✈️'}</div>
    <button
      class="save-btn"
      class:saved
      onclick={(e) => { e.stopPropagation(); onsave?.(); }}
      aria-label={saved ? 'Remove from saved' : 'Save destination'}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
    </button>
    <div class="dest-rating">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="#D97745" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      {destination.rating}
    </div>
  </div>

  <div class="card-body">
    <div class="dest-header">
      <div>
        <h4 class="dest-name">{destination.name}</h4>
        <p class="dest-country text-xs text-gray">{destination.country}</p>
      </div>
      <div class="dest-budget">
        <span class="text-xs text-gray">From</span>
        <span class="text-forest font-semibold text-sm">₹{(destination.estimatedBudget / 1000).toFixed(0)}K</span>
      </div>
    </div>

    <p class="dest-desc line-clamp-2">{destination.description}</p>

    <div class="dest-footer">
      <div class="dest-tags">
        {#each destination.category.slice(0, 2) as cat}
          <span class="chip">{cat}</span>
        {/each}
      </div>
      <span class="best-time text-xs text-gray">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        {destination.bestTime}
      </span>
    </div>
  </div>
</div>

<style>
  .dest-card {
    overflow: hidden;
  }

  .dest-cover {
    position: relative;
    height: 200px;
    overflow: hidden;
  }

  .dest-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(23,63,53,0.5) 0%, transparent 60%);
  }

  .dest-emoji {
    position: absolute;
    bottom: var(--sp-4);
    left: var(--sp-4);
    font-size: 2.5rem;
    z-index: 2;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  }

  .save-btn {
    position: absolute;
    top: var(--sp-3);
    right: var(--sp-3);
    z-index: 2;
    background: rgba(255,255,255,0.9);
    border: none;
    border-radius: var(--radius-sm);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--gray);
    transition: all var(--transition-fast);
  }

  .save-btn:hover, .save-btn.saved {
    background: white;
    color: var(--terracotta);
  }

  .dest-rating {
    position: absolute;
    top: var(--sp-3);
    left: var(--sp-3);
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 3px;
    background: rgba(255,255,255,0.9);
    padding: 3px 8px;
    border-radius: var(--radius-full);
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--forest);
  }

  .dest-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: var(--sp-2);
  }

  .dest-name {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--forest);
    margin-bottom: 2px;
  }

  .dest-country { margin-bottom: 0; }

  .dest-budget {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .dest-desc {
    font-size: 0.875rem;
    color: var(--gray);
    line-height: 1.55;
    margin-bottom: var(--sp-3);
  }

  .dest-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--sp-2);
  }

  .dest-tags {
    display: flex;
    gap: var(--sp-1);
    flex-wrap: wrap;
  }

  .best-time {
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
  }
</style>
