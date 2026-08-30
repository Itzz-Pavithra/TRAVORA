<script lang="ts">
  import type { Trip } from '$lib/types';

  interface Props {
    trip: Trip;
  }

  let { trip }: Props = $props();

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }

  function formatYear(d: string) {
    return new Date(d).getFullYear();
  }

  const progress = $derived(Math.round((trip.budgetSpent / trip.budget) * 100));

  const statusLabel: Record<string, string> = {
    upcoming: 'Upcoming',
    active: 'Active',
    past: 'Completed'
  };

  const coverGradients: Record<string, string> = {
    'Goa': 'linear-gradient(135deg, #D97745 0%, #173F35 100%)',
    'Kerala': 'linear-gradient(135deg, #173F35 0%, #1f5448 100%)',
    'Singapore': 'linear-gradient(135deg, #4a5550 0%, #173F35 100%)',
  };

  const coverEmoji: Record<string, string> = {
    'Goa': '🏖️',
    'Kerala': '🌿',
    'Singapore': '🌃',
  };
</script>

<a href="/trips/{trip.id}" class="trip-card card" aria-label="View {trip.name} trip">
  <div class="cover" style="background: {coverGradients[trip.destination] || 'linear-gradient(135deg, #173F35 0%, #D97745 100%)'}">
    {#if trip.coverImage}
      <img src={trip.coverImage} alt={trip.destination} class="img-cover cover-img" onerror={(e) => (e.currentTarget as HTMLImageElement).style.display='none'} />
    {/if}
    <div class="cover-overlay"></div>
    <div class="cover-content">
      <span class="dest-emoji">{coverEmoji[trip.destination] || '✈️'}</span>
      <div class="trip-name-top">{trip.name.toUpperCase()}</div>
    </div>
    <div class="cover-badge badge badge-cream">
      {statusLabel[trip.status]}
    </div>
  </div>

  <div class="card-body">
    <div class="trip-meta">
      <span class="trip-dates">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        {formatDate(trip.startDate)} – {formatDate(trip.endDate)}, {formatYear(trip.endDate)}
      </span>
      <span class="trip-type badge {trip.type === 'group' ? 'badge-forest' : 'badge-terracotta'}">
        {trip.type === 'group' ? '👥 Group' : '🧍 Solo'}
      </span>
    </div>

    <div class="trip-stats">
      <div class="stat">
        <span class="stat-val">{trip.travelers}</span>
        <span class="stat-lbl">Travelers</span>
      </div>
      <div class="stat-sep"></div>
      <div class="stat">
        <span class="stat-val">₹{(trip.budget / 1000).toFixed(0)}K</span>
        <span class="stat-lbl">Budget</span>
      </div>
      <div class="stat-sep"></div>
      <div class="stat">
        <span class="stat-val">{trip.interests.length}</span>
        <span class="stat-lbl">Interests</span>
      </div>
    </div>

    {#if trip.status !== 'past'}
      <div class="budget-bar mt-4">
        <div class="budget-bar-top">
          <span class="text-xs text-gray">Spent</span>
          <span class="text-xs font-semibold text-forest">₹{trip.budgetSpent.toLocaleString('en-IN')} / ₹{trip.budget.toLocaleString('en-IN')}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:{Math.min(progress, 100)}%"></div>
        </div>
      </div>
    {/if}

    <div class="card-actions mt-4">
      <button class="btn btn-primary btn-sm w-full" onclick={(e) => { e.stopPropagation(); }}>
        {trip.status === 'past' ? 'View Trip' : 'Continue Trip'}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
    </div>
  </div>
</a>

<style>
  .trip-card {
    display: block;
    text-decoration: none;
    color: inherit;
    transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  }

  .cover {
    position: relative;
    height: 160px;
    overflow: hidden;
  }

  .cover-img {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  .cover-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(23,63,53,0.7) 0%, rgba(23,63,53,0.1) 60%);
    z-index: 1;
  }

  .cover-content {
    position: absolute;
    bottom: var(--sp-4);
    left: var(--sp-4);
    z-index: 2;
    display: flex;
    align-items: center;
    gap: var(--sp-2);
  }

  .dest-emoji {
    font-size: 1.5rem;
  }

  .trip-name-top {
    font-family: var(--font-serif);
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--white);
    letter-spacing: 0.02em;
    text-shadow: 0 1px 4px rgba(0,0,0,0.3);
  }

  .cover-badge {
    position: absolute;
    top: var(--sp-3);
    right: var(--sp-3);
    z-index: 2;
    font-size: 0.7rem;
  }

  .trip-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-2);
    margin-bottom: var(--sp-4);
  }

  .trip-dates {
    display: flex;
    align-items: center;
    gap: var(--sp-1);
    font-size: 0.8125rem;
    color: var(--gray);
  }

  .trip-stats {
    display: flex;
    align-items: center;
    gap: var(--sp-4);
    padding: var(--sp-3) var(--sp-4);
    background: var(--cream);
    border-radius: var(--radius-md);
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    flex: 1;
  }

  .stat-val {
    font-size: 1rem;
    font-weight: 700;
    color: var(--forest);
  }

  .stat-lbl {
    font-size: 0.7rem;
    color: var(--gray);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-sep {
    width: 1px;
    height: 32px;
    background: var(--border);
  }

  .budget-bar-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--sp-2);
  }

  .w-full { width: 100%; }
</style>
