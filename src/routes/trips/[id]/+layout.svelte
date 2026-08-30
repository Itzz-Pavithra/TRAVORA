<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { tripService } from '$lib/services/tripService';
  import { currentTrip } from '$lib/stores';
  import Sidebar from '$lib/components/layout/Sidebar.svelte';
  import type { Trip } from '$lib/types';
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  let trip = $state<Trip | null>(null);
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

  function isTabActive(key: string) {
    const basePath = `/trips/${tripId}`;
    if (key === '') return $page.url.pathname === basePath;
    return $page.url.pathname === `${basePath}/${key}`;
  }

  $effect(() => {
    if (tripId) {
      trip = tripService.getById(tripId);
      currentTrip.set(trip);
    }
  });
</script>

{#if trip}
  <div class="trip-workspace-layout">
    <!-- Desktop Sidebar -->
    <Sidebar {trip} />

    <!-- Main Content Area -->
    <div class="trip-workspace-main">
      <!-- Mobile Sub-navigation Bar -->
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

  @media (max-width: 900px) {
    .mobile-trip-tabs {
      display: flex;
    }
    .trip-tab-content {
      padding: var(--sp-4);
    }
  }
</style>
