<script>
  import { page } from '$app/stores';
  import { tripService } from '$lib/services/tripService.js';
  import { currentTrip } from '$lib/stores/index.js';
  import Sidebar from '$lib/components/layout/Sidebar.svelte';

  let { children } = $props();

  let trip = $state(null);
  let loading = $state(true);
  const tripId = $derived($page.params.id);

  const tabs = [
    { key: '', label: 'Overview', icon: '📌' },
    { key: 'itinerary', label: 'Itinerary', icon: '📅' },
    { key: 'map', label: 'Map', icon: '🗺️' },
    { key: 'transport', label: 'Transport', icon: '✈️' },
    { key: 'stay', label: 'Stay', icon: '🏨' },
    { key: 'activities', label: 'Activities', icon: '🎟️' },
    { key: 'expenses', label: 'Expenses', icon: '💸' },
    { key: 'friends', label: 'Friends', icon: '👥' },
    { key: 'chat', label: 'Chat', icon: '💬' },
    { key: 'polls', label: 'Polls', icon: '📊' },
    { key: 'fun', label: 'Fun', icon: '🎮' },
    { key: 'memories', label: 'Memories', icon: '📸' }
  ];

  function isTabActive(key) {
    const basePath = `/trips/${tripId}`;
    if (key === '') return $page.url.pathname === basePath;
    return $page.url.pathname === `${basePath}/${key}`;
  }

  $effect(() => {
    if (tripId) {
      loading = true;
      tripService.getById(tripId).then(t => {
        trip = t;
        currentTrip.set(t);
        loading = false;
      });
    }
  });
</script>

{#if loading}
  <div class="page-with-nav p-12 text-center">
    <div class="spinner-lg mx-auto mb-4"></div>
    <p class="text-gray">Loading trip workspace...</p>
  </div>
{:else if trip}
  <div class="trip-workspace-layout">
    <Sidebar {trip} />

    <div class="trip-workspace-main">
      <div class="mobile-trip-tabs">
        {#each tabs as tab}
          {@const href = tab.key === '' ? `/trips/${tripId}` : `/trips/${tripId}/${tab.key}`}
          <a 
            {href} 
            class="mobile-trip-tab-item"
            class:active={isTabActive(tab.key)}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </a>
        {/each}
      </div>

      <div class="trip-tab-content">
        {@render children()}
      </div>
    </div>
  </div>
{:else}
  <div class="page-with-nav p-12 text-center">
    <h3>Trip not found</h3>
    <a href="/trips" class="btn btn-primary mt-4">Back to My Trips</a>
  </div>
{/if}

<style>
  .trip-workspace-layout {
    display: flex;
    min-height: calc(100vh - var(--navbar-height));
    margin-top: var(--navbar-height);
  }

  .trip-workspace-main {
    flex: 1;
    min-width: 0;
    background: var(--cream);
    padding-bottom: calc(var(--bottom-nav-height) + var(--sp-6));
  }

  .mobile-trip-tabs {
    display: none;
    background: var(--white);
    border-bottom: 1px solid var(--border);
    overflow-x: auto;
    scrollbar-width: none;
    position: sticky;
    top: var(--navbar-height);
    z-index: 100;
  }
  .mobile-trip-tabs::-webkit-scrollbar { display: none; }

  .mobile-trip-tab-item {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: var(--sp-3) var(--sp-4);
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--gray);
    white-space: nowrap;
    text-decoration: none;
    border-bottom: 2px solid transparent;
  }

  .mobile-trip-tab-item.active {
    color: var(--forest);
    font-weight: 700;
    border-bottom-color: var(--terracotta);
  }

  .trip-tab-content {
    padding: var(--sp-6) var(--sp-8);
  }

  .spinner-lg {
    width: 32px;
    height: 32px;
    border: 3px solid rgba(23, 63, 53, 0.2);
    border-top-color: var(--forest);
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
  .mx-auto { margin-left: auto; margin-right: auto; }

  @media (max-width: 900px) {
    .mobile-trip-tabs {
      display: flex;
    }
    .trip-tab-content {
      padding: var(--sp-4);
    }
  }
</style>
