<script>
  import { onMount } from 'svelte';
  import { currentUser, trips, upcomingTrips, savedPlaces } from '$lib/stores/index.js';
  import { mockDestinations } from '$lib/data/mockData.js';
  import TripCard from '$lib/components/cards/TripCard.svelte';
  import DestinationCard from '$lib/components/cards/DestinationCard.svelte';

  onMount(() => {
    if ($currentUser) {
      trips.load($currentUser.id);
      savedPlaces.load($currentUser.id);
    }
  });

  function handleSave(dest) {
    if (!$currentUser) return;
    savedPlaces.toggle({
      id: '',
      userId: $currentUser.id,
      placeId: dest.id,
      name: dest.name,
      location: dest.country,
      type: 'destination',
      savedAt: new Date().toISOString()
    });
  }
</script>

<svelte:head>
  <title>Dashboard — Travora</title>
</svelte:head>

<div class="page-with-nav home-page">
  <div class="container py-8">
    <div class="home-welcome card p-8 mb-8">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span class="badge badge-forest text-xs mb-2">Welcome Back</span>
          <h1 class="text-3xl font-bold text-forest">Hello, {$currentUser?.name || 'Traveler'} 👋</h1>
          <p class="text-gray text-sm mt-1">Ready for your next journey? Track your trips, split expenses, and relive memories.</p>
        </div>

        <a href="/trips/create" class="btn btn-accent btn-lg">
          + Plan New Trip ✦
        </a>
      </div>
    </div>

    <!-- Active & Upcoming Trips Section -->
    <div class="mb-10">
      <div class="flex items-center justify-between mb-4">
        <h2 class="section-title">Active & Upcoming Trips</h2>
        <a href="/trips" class="btn btn-ghost btn-sm">View All ({$trips.length}) →</a>
      </div>

      {#if $upcomingTrips.length === 0}
        <div class="card p-8 text-center">
          <p class="text-gray text-sm mb-3">No active or upcoming trips planned right now.</p>
          <a href="/trips/create" class="btn btn-primary btn-sm">+ Create Your Next Journey</a>
        </div>
      {:else}
        <div class="grid-3">
          {#each $upcomingTrips as trip (trip.id)}
            <TripCard {trip} />
          {/each}
        </div>
      {/if}
    </div>

    <!-- Recommended Destinations -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="section-title">Trending Destinations</h2>
        <a href="/discover" class="btn btn-ghost btn-sm">Explore World →</a>
      </div>

      <div class="grid-3">
        {#each mockDestinations.slice(0, 3) as dest (dest.id)}
          <DestinationCard 
            destination={dest} 
            saved={$currentUser ? savedPlaces.isSaved(dest.id, $currentUser.id) : false}
            onsave={() => handleSave(dest)}
          />
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .home-welcome {
    background: linear-gradient(135deg, var(--white) 0%, var(--cream) 100%);
    border: 1.5px solid var(--border);
  }
</style>
