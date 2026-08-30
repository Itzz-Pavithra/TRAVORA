<script lang="ts">
  import { onMount } from 'svelte';
  import { currentUser, savedPlaces, notifications } from '$lib/stores';
  import PlaceCard from '$lib/components/cards/PlaceCard.svelte';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';

  let selectedFilter = $state<string>('all');

  onMount(() => {
    if ($currentUser) {
      savedPlaces.load($currentUser.id);
    }
  });

  const categories = [
    { id: 'all', label: 'All Places' },
    { id: 'destination', label: '🏖️ Destinations' },
    { id: 'hotel', label: '🏨 Hotels' },
    { id: 'restaurant', label: '🍽️ Restaurants' },
    { id: 'activity', label: '🎟️ Activities' }
  ];

  const filtered = $derived(
    selectedFilter === 'all'
      ? $savedPlaces
      : $savedPlaces.filter(p => p.type === selectedFilter)
  );

  function handleRemove(id: string) {
    const place = $savedPlaces.find(p => p.id === id);
    if (place) {
      savedPlaces.toggle(place);
      notifications.show('Removed from saved places.');
    }
  }
</script>

<svelte:head>
  <title>Saved Places — Travora</title>
</svelte:head>

<div class="page-with-nav saved-page">
  <div class="container py-8">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div>
        <p class="section-label">Your Bookmarks</p>
        <h1 class="section-title">Saved Places</h1>
        <p class="section-desc">Destinations, restaurants, and stays you've bookmarked for future adventures.</p>
      </div>
    </div>

    <!-- Category filter chips -->
    <div class="flex gap-2 mb-8 flex-wrap">
      {#each categories as cat}
        <button 
          class="chip" 
          class:active={selectedFilter === cat.id}
          onclick={() => selectedFilter = cat.id}
        >
          {cat.label}
        </button>
      {/each}
    </div>

    {#if filtered.length === 0}
      <EmptyState 
        icon="📍"
        title="No saved places yet"
        description="Bookmark destinations and hotels as you discover them to easily reference them later."
        actionLabel="Explore Destinations"
        onaction={() => window.location.href = '/discover'}
      />
    {:else}
      <div class="grid-4">
        {#each filtered as place (place.id)}
          <PlaceCard {place} onremove={handleRemove} />
        {/each}
      </div>
    {/if}
  </div>
</div>
