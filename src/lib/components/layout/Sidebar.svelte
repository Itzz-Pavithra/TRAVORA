<script lang="ts">
  import { page } from '$app/stores';
  import type { Trip } from '$lib/types';

  interface Props {
    trip: Trip;
  }

  let { trip }: Props = $props();

  const navItems = [
    { key: '', label: 'Overview', icon: '📌' },
    { key: 'itinerary', label: 'Itinerary', icon: '📅' },
    { key: 'map', label: 'Map', icon: '🗺️' },
    { key: 'transport', label: 'Transportation', icon: '✈️' },
    { key: 'stay', label: 'Stay', icon: '🏨' },
    { key: 'activities', label: 'Activities', icon: '🎟️' },
    { key: 'expenses', label: 'Expenses', icon: '💸' },
    { key: 'friends', label: 'Friends', icon: '👥' },
    { key: 'chat', label: 'Chat', icon: '💬' },
    { key: 'polls', label: 'Polls', icon: '📊' },
    { key: 'fun', label: 'Travel Fun', icon: '🎮' },
    { key: 'memories', label: 'Memories', icon: '📸' }
  ];

  function isTabActive(key: string) {
    const basePath = `/trips/${trip.id}`;
    if (key === '') {
      return $page.url.pathname === basePath;
    }
    return $page.url.pathname === `${basePath}/${key}`;
  }
</script>

<aside class="trip-sidebar">
  <div class="trip-sidebar-header">
    <a href="/trips" class="back-link">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      All Trips
    </a>
    <h3 class="sidebar-trip-name line-clamp-1">{trip.name}</h3>
    <span class="badge badge-forest text-xs">{trip.type === 'group' ? '👥 Group Trip' : '🧍 Solo Trip'}</span>
  </div>

  <nav class="sidebar-nav" aria-label="Trip Navigation">
    {#each navItems as item}
      {@const href = item.key === '' ? `/trips/${trip.id}` : `/trips/${trip.id}/${item.key}`}
      <a 
        {href} 
        class="sidebar-link" 
        class:active={isTabActive(item.key)}
      >
        <span class="sidebar-icon">{item.icon}</span>
        <span class="sidebar-label">{item.label}</span>
      </a>
    {/each}
  </nav>
</aside>

<style>
  .trip-sidebar {
    width: var(--sidebar-width);
    background: var(--white);
    border-right: 1px solid var(--border);
    height: calc(100vh - var(--navbar-height));
    position: sticky;
    top: var(--navbar-height);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    flex-shrink: 0;
  }

  .trip-sidebar-header {
    padding: var(--sp-4) var(--sp-5);
    border-bottom: 1px solid var(--border);
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.75rem;
    color: var(--gray);
    text-decoration: none;
    margin-bottom: var(--sp-2);
  }
  .back-link:hover { color: var(--forest); }

  .sidebar-trip-name {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--forest);
    margin-bottom: var(--sp-2);
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    padding: var(--sp-3) var(--sp-2);
    gap: 2px;
  }

  .sidebar-link {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    padding: var(--sp-2) var(--sp-3);
    border-radius: var(--radius-md);
    color: var(--gray);
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    transition: all var(--transition-fast);
  }

  .sidebar-link:hover {
    background: var(--cream);
    color: var(--forest);
  }

  .sidebar-link.active {
    background: var(--forest-10);
    color: var(--forest);
    font-weight: 600;
  }

  .sidebar-icon {
    font-size: 1.1rem;
    width: 20px;
    display: flex;
    justify-content: center;
  }

  @media (max-width: 900px) {
    .trip-sidebar {
      display: none;
    }
  }
</style>
