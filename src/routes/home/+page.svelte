<script lang="ts">
  import { onMount } from 'svelte';
  import { currentUser, trips, savedPlaces, notifications } from '$lib/stores';
  import { getDestinations } from '$lib/data/mockData';
  import type { Destination, SavedPlace } from '$lib/types';
  import DestinationCard from '$lib/components/cards/DestinationCard.svelte';
  import TripCard from '$lib/components/cards/TripCard.svelte';

  let destinations = $state<Destination[]>([]);
  let searchQuery = $state('');
  let selectedCategory = $state<string>('All');

  const categories = ['All', 'Beaches', 'Nature', 'Culture', 'Adventure', 'Relaxation', 'Food', 'Mountains'];

  onMount(() => {
    destinations = getDestinations();
    if ($currentUser) {
      savedPlaces.load($currentUser.id);
    }
  });

  const filteredDestinations = $derived(
    destinations.filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            d.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'All' || d.category.includes(selectedCategory);
      return matchesSearch && matchesCat;
    })
  );

  function handleSave(dest: Destination) {
    if (!$currentUser) return;
    const place: SavedPlace = {
      id: '',
      userId: $currentUser.id,
      placeId: dest.id,
      name: dest.name,
      location: dest.country,
      type: 'destination',
      savedAt: new Date().toISOString()
    };
    savedPlaces.toggle(place);
    const isNowSaved = savedPlaces.isSaved(dest.id, $currentUser.id);
    notifications.show(isNowSaved ? `Saved ${dest.name} to places!` : `Removed ${dest.name} from saved.`);
  }

  function getTimeGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }
</script>

<svelte:head>
  <title>Home — Travora</title>
</svelte:head>

<div class="page-with-nav home-page">
  <div class="container py-6">
    <!-- Welcome Header -->
    <section class="welcome-banner card mb-8">
      <div class="welcome-content">
        <p class="section-label">{getTimeGreeting()}, {$currentUser?.name || 'Explorer'}</p>
        <h1 class="welcome-title display-serif">Where will your next journey take you?</h1>
        <p class="welcome-sub">Explore popular destinations or jump right back into planning your upcoming adventures.</p>
        
        <!-- Search bar -->
        <div class="home-search-wrap mt-6">
          <div class="input-icon-wrap w-full">
            <span class="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input 
              type="text" 
              class="input home-search-input" 
              bind:value={searchQuery}
              placeholder="Search destinations, places, or experiences..." 
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Active Trips Strip (if user has any) -->
    {#if $trips.length > 0}
      <section class="mb-10">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="section-title">Your Current Trips</h2>
            <p class="text-xs text-gray">Continue planning or managing your active itineraries</p>
          </div>
          <a href="/trips" class="btn btn-ghost btn-sm">View All ({$trips.length}) →</a>
        </div>

        <div class="grid-3">
          {#each $trips.slice(0, 3) as trip (trip.id)}
            <TripCard {trip} />
          {/each}
        </div>
      </section>
    {/if}

    <!-- Recommended Experiences Categories -->
    <section class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="section-title">Recommended Experiences</h2>
      </div>

      <div class="category-chips-scroll">
        {#each categories as cat}
          <button 
            class="chip" 
            class:active={selectedCategory === cat}
            onclick={() => selectedCategory = cat}
          >
            {cat}
          </button>
        {/each}
      </div>
    </section>

    <!-- Popular Destinations Grid -->
    <section class="mb-12">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="section-title">Popular Destinations</h2>
          <p class="text-xs text-gray">Handpicked spots with estimated budgets and top highlights</p>
        </div>
      </div>

      {#if filteredDestinations.length === 0}
        <div class="card p-8 text-center">
          <p class="text-gray">No destinations found matching your search. Try another query!</p>
        </div>
      {:else}
        <div class="grid-3">
          {#each filteredDestinations as dest (dest.id)}
            <DestinationCard 
              destination={dest} 
              saved={$currentUser ? savedPlaces.isSaved(dest.id, $currentUser.id) : false}
              onsave={() => handleSave(dest)}
            />
          {/each}
        </div>
      {/if}
    </section>
  </div>
</div>

<style>
  .welcome-banner {
    background: linear-gradient(135deg, var(--forest) 0%, var(--forest-light) 100%);
    color: var(--white);
    padding: var(--sp-10) var(--sp-8);
    position: relative;
    overflow: hidden;
  }

  .welcome-banner::after {
    content: '✦';
    position: absolute;
    right: 4%;
    bottom: -10%;
    font-size: 14rem;
    color: rgba(255,255,255,0.03);
    pointer-events: none;
  }

  .welcome-content {
    max-width: 680px;
    position: relative;
    z-index: 2;
  }

  .welcome-banner .section-label {
    color: var(--terracotta-light);
  }

  .welcome-title {
    font-size: clamp(1.75rem, 3.5vw, 2.5rem);
    color: var(--white);
    line-height: 1.2;
    margin-bottom: var(--sp-2);
  }

  .welcome-sub {
    color: rgba(255,255,255,0.8);
    font-size: 1rem;
  }

  .home-search-wrap {
    max-width: 540px;
  }

  .home-search-input {
    background: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
  }

  .category-chips-scroll {
    display: flex;
    gap: var(--sp-2);
    overflow-x: auto;
    padding-bottom: var(--sp-2);
    scrollbar-width: none;
  }
  .category-chips-scroll::-webkit-scrollbar { display: none; }
</style>
