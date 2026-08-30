<script lang="ts">
  import { page } from '$app/stores';
  import { getAccommodations } from '$lib/data/mockData';
  import { currentUser, savedPlaces, notifications } from '$lib/stores';
  import HotelCard from '$lib/components/cards/HotelCard.svelte';
  import type { Accommodation, SavedPlace } from '$lib/types';

  const tripId = $derived($page.params.id);
  
  let hotels = $state<Accommodation[]>([]);

  $effect(() => {
    if (tripId) {
      hotels = getAccommodations(tripId);
    }
  });

  function handleSave(hotel: Accommodation) {
    if (!$currentUser) return;
    const place: SavedPlace = {
      id: '',
      userId: $currentUser.id,
      placeId: hotel.id,
      name: hotel.name,
      location: hotel.location,
      type: 'hotel',
      savedAt: new Date().toISOString()
    };
    savedPlaces.toggle(place);
    const isSaved = savedPlaces.isSaved(hotel.id, $currentUser.id);
    notifications.show(isSaved ? `Saved ${hotel.name} to places!` : `Removed ${hotel.name} from saved.`);
  }
</script>

<svelte:head>
  <title>Stay & Accommodation — Travora</title>
</svelte:head>

<div class="stay-tab">
  <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
    <div>
      <h2 class="section-title">Stay & Accommodation</h2>
      <p class="text-xs text-gray">Recommended hotels, beachside villas, and boutique resorts.</p>
    </div>
  </div>

  <div class="grid-3">
    {#each hotels as hotel (hotel.id)}
      <HotelCard 
        {hotel} 
        saved={$currentUser ? savedPlaces.isSaved(hotel.id, $currentUser.id) : false}
        onsave={() => handleSave(hotel)}
      />
    {/each}
  </div>
</div>
