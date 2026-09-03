<script>
  import { page } from '$app/stores';
  import { tripService } from '$lib/services/tripService.js';

  const tripId = $derived($page.params.id);

  let itinerary = $state([]);
  let currentTrip = $state(null);

  $effect(() => {
    if (tripId) {
      tripService.getById(tripId).then(t => currentTrip = t);
      const unsub = tripService.subscribeToItinerary(tripId, data => itinerary = data);
      return () => unsub();
    }
  });

  const allLocations = $derived(
    itinerary.flatMap(d => d.items || []).filter(item => item.location)
  );
</script>

<svelte:head>
  <title>Trip Map — Travora</title>
</svelte:head>

<div class="map-tab">
  <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
    <div>
      <h2 class="section-title">🗺️ Interactive Itinerary Map</h2>
      <p class="text-xs text-gray">Visual pin plotting for all planned sights, stays, and activities.</p>
    </div>
  </div>

  <div class="map-container card p-6 mb-6">
    <div class="map-placeholder-box">
      <div class="map-grid-pattern"></div>
      <div class="map-pins-layer">
        {#each allLocations as loc, idx}
          <div class="map-pin-marker" style="top: {25 + (idx * 15)}%; left: {20 + (idx * 20)}%;">
            <span class="pin-icon">📍</span>
            <div class="pin-tooltip">
              <strong>{loc.title}</strong>
              <span class="text-xs text-gray block">{loc.location}</span>
            </div>
          </div>
        {/each}
      </div>

      <div class="map-overlay-card card p-4">
        <h4 class="text-forest font-bold text-sm mb-1">{currentTrip?.destination || 'Goa'} Trip Pins</h4>
        <p class="text-xs text-gray">{allLocations.length} locations plotted on itinerary</p>
      </div>
    </div>
  </div>

  <div class="card p-6">
    <h3 class="font-bold text-forest mb-4">Plotted Locations List</h3>
    {#if allLocations.length === 0}
      <p class="text-xs text-gray">No itinerary items with locations added yet. Add items in the Itinerary tab!</p>
    {:else}
      <div class="grid-3 gap-3">
        {#each allLocations as item}
          <div class="location-item-card card p-3">
            <span class="badge badge-forest text-xs mb-1">{item.time}</span>
            <strong class="text-sm text-forest block">{item.title}</strong>
            <span class="text-xs text-gray">📍 {item.location}</span>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .map-placeholder-box {
    position: relative;
    width: 100%;
    height: 380px;
    background: linear-gradient(135deg, #e8f0ec 0%, #d4e4dc 100%);
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  .map-grid-pattern {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(#173f35 1px, transparent 1px);
    background-size: 24px 24px;
    opacity: 0.15;
  }

  .map-pins-layer {
    position: absolute;
    inset: 0;
  }

  .map-pin-marker {
    position: absolute;
    cursor: pointer;
    transition: transform var(--transition-fast);
  }

  .map-pin-marker:hover {
    transform: scale(1.2);
    z-index: 10;
  }

  .pin-icon {
    font-size: 1.75rem;
  }

  .pin-tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: var(--white);
    padding: 4px 8px;
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-sm);
    white-space: nowrap;
    display: none;
  }

  .map-pin-marker:hover .pin-tooltip {
    display: block;
  }

  .map-overlay-card {
    position: absolute;
    bottom: var(--sp-4);
    left: var(--sp-4);
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
  }

  .location-item-card {
    background: var(--cream);
  }
  .block { display: block; }
</style>
