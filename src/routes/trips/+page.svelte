<script>
  import { onMount } from 'svelte';
  import { currentUser, trips, upcomingTrips, pastTrips } from '$lib/stores/index.js';
  import TripCard from '$lib/components/cards/TripCard.svelte';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';

  let activeTab = $state('upcoming');

  onMount(() => {
    if ($currentUser) {
      trips.load($currentUser.id);
    }
  });
</script>

<svelte:head>
  <title>My Trips — Travora</title>
</svelte:head>

<div class="page-with-nav trips-page">
  <div class="container py-8">
    <div class="flex items-center justify-between mb-8 flex-wrap gap-4">
      <div>
        <p class="section-label">Your Itineraries</p>
        <h1 class="section-title">My Trips</h1>
        <p class="section-desc">Manage your planned itineraries, past travel archives, and active group budgets.</p>
      </div>

      <a href="/trips/create" class="btn btn-accent btn-lg">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Create New Trip
      </a>
    </div>

    <!-- Tab Toggle -->
    <div class="tab-nav mb-8">
      <button 
        class="tab-item" 
        class:active={activeTab === 'upcoming'}
        onclick={() => activeTab = 'upcoming'}
      >
        <span class="tab-icon">✈️</span>
        Upcoming & Active ({$upcomingTrips.length})
      </button>
      <button 
        class="tab-item" 
        class:active={activeTab === 'past'}
        onclick={() => activeTab = 'past'}
      >
        <span class="tab-icon">📜</span>
        Past Trips ({$pastTrips.length})
      </button>
    </div>

    <!-- Trips Grid -->
    {#if activeTab === 'upcoming'}
      {#if $upcomingTrips.length === 0}
        <EmptyState 
          icon="🗺️"
          title="No upcoming trips yet"
          description="Your next adventure starts here. Pick a destination and start crafting your itinerary!"
          actionLabel="Create Your First Trip"
          onaction={() => window.location.href = '/trips/create'}
        />
      {:else}
        <div class="grid-3">
          {#each $upcomingTrips as trip (trip.id)}
            <TripCard {trip} />
          {/each}
        </div>
      {/if}
    {:else}
      {#if $pastTrips.length === 0}
        <EmptyState 
          icon="📜"
          title="No past trips recorded"
          description="Trips you complete will appear here along with their preserved memories and expense history."
        />
      {:else}
        <div class="grid-3">
          {#each $pastTrips as trip (trip.id)}
            <TripCard {trip} />
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</div>
