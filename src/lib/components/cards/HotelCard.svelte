<script lang="ts">
  import type { Accommodation } from '$lib/types';

  interface Props {
    hotel: Accommodation;
    saved?: boolean;
    onsave?: () => void;
  }

  let { hotel, saved = false, onsave }: Props = $props();

  const typeLabels: Record<string, string> = {
    hotel: 'Hotel',
    resort: 'Luxury Resort',
    hostel: 'Hostel',
    airbnb: 'Villa / Home',
    guesthouse: 'Guesthouse'
  };
</script>

<div class="hotel-card card">
  <div class="hotel-cover">
    <div class="hotel-bg-placeholder">
      <span class="hotel-emoji">🏨</span>
    </div>
    {#if onsave}
      <button 
        class="save-btn" 
        class:saved 
        onclick={(e) => { e.stopPropagation(); onsave?.(); }}
        aria-label="Save accommodation"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
      </button>
    {/if}
    <div class="rating-badge">
      ★ {hotel.rating} <span class="review-count">({hotel.reviewCount})</span>
    </div>
  </div>

  <div class="card-body">
    <div class="badge badge-forest text-xs mb-2">{typeLabels[hotel.type] || 'Stay'}</div>
    <h4 class="hotel-name">{hotel.name}</h4>
    <p class="hotel-location text-xs text-gray mb-3 flex items-center gap-1">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      {hotel.location}
    </p>

    <div class="amenities-wrap mb-4">
      {#each hotel.amenities.slice(0, 4) as amen}
        <span class="chip text-xs">{amen}</span>
      {/each}
    </div>

    <div class="flex items-center justify-between pt-3 border-t">
      <div>
        <span class="price-val">₹{hotel.pricePerNight.toLocaleString('en-IN')}</span>
        <span class="text-xs text-gray"> / night</span>
      </div>
      <button class="btn btn-primary btn-sm">View Details</button>
    </div>
  </div>
</div>

<style>
  .hotel-card {
    overflow: hidden;
  }

  .hotel-cover {
    position: relative;
    height: 150px;
    background: var(--cream);
  }

  .hotel-bg-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--forest-10) 0%, var(--cream-dark) 100%);
  }

  .hotel-emoji {
    font-size: 2.5rem;
  }

  .save-btn {
    position: absolute;
    top: var(--sp-3);
    right: var(--sp-3);
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
    color: var(--terracotta);
  }

  .rating-badge {
    position: absolute;
    bottom: var(--sp-2);
    left: var(--sp-3);
    background: var(--white);
    padding: 2px 8px;
    border-radius: var(--radius-full);
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--forest);
    box-shadow: var(--shadow-sm);
  }

  .review-count {
    font-weight: 400;
    color: var(--gray);
  }

  .hotel-name {
    font-size: 1.0625rem;
    font-weight: 700;
    color: var(--forest);
    margin-bottom: 2px;
  }

  .amenities-wrap {
    display: flex;
    gap: var(--sp-1);
    flex-wrap: wrap;
  }

  .border-t {
    border-top: 1px solid var(--border);
  }

  .price-val {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--forest);
  }
</style>
