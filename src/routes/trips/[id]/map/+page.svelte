<script lang="ts">
  import { page } from '$app/stores';
  import { tripService } from '$lib/services/tripService';
  import type { Trip, ItineraryDay } from '$lib/types';

  const tripId = $derived($page.params.id);
  
  let trip = $state<Trip | null>(null);
  let itinerary = $state<ItineraryDay[]>([]);
  let activeMarker = $state<string | null>(null);

  $effect(() => {
    if (tripId) {
      trip = tripService.getById(tripId);
      itinerary = tripService.getItinerary(tripId);
    }
  });

  // Extract all unique locations from itinerary
  const locations = $derived(
    itinerary.flatMap(d => 
      d.items.filter(i => i.location).map(i => ({
        id: i.id,
        day: d.dayNumber,
        title: i.title,
        location: i.location || '',
        time: i.time,
        type: i.type
      }))
    )
  );
</script>

<svelte:head>
  <title>Trip Map — Travora</title>
</svelte:head>

<div class="map-tab">
  <div class="flex items-center justify-between mb-6">
    <div>
      <h2 class="section-title">Interactive Trip Map</h2>
      <p class="text-xs text-gray">Explore scheduled locations, stops, and visual routes across your itinerary.</p>
    </div>
  </div>

  <div class="grid-3 gap-6">
    <!-- Map Canvas Display -->
    <div class="map-container-card card col-span-2">
      <div class="map-canvas">
        <div class="map-grid-overlay"></div>
        <div class="map-water-area"></div>
        <div class="map-land-area"></div>
        
        <!-- Mock Map Markers & Connecting Routes -->
        <svg class="map-route-svg" viewBox="0 0 600 400">
          <path d="M 120 180 Q 250 120 380 220 T 500 280" fill="none" stroke="#D97745" stroke-width="3" stroke-dasharray="6,6" />
        </svg>

        <!-- Marker 1 -->
        <button 
          type="button"
          class="map-marker-pin pin-1" 
          class:selected={activeMarker === 'p1'}
          onclick={() => activeMarker = 'p1'}
          aria-label="Location pin 1: Baga Beach"
        >
          <div class="pin-head"><span>1</span></div>
          <div class="pin-popup">
            <strong>Baga Beach</strong>
            <span>Day 1 • 15:00</span>
          </div>
        </button>

        <!-- Marker 2 -->
        <button 
          type="button"
          class="map-marker-pin pin-2" 
          class:selected={activeMarker === 'p2'}
          onclick={() => activeMarker = 'p2'}
          aria-label="Location pin 2: Fort Aguada"
        >
          <div class="pin-head"><span>2</span></div>
          <div class="pin-popup">
            <strong>Fort Aguada</strong>
            <span>Day 2 • 10:30</span>
          </div>
        </button>

        <!-- Marker 3 -->
        <button 
          type="button"
          class="map-marker-pin pin-3" 
          class:selected={activeMarker === 'p3'}
          onclick={() => activeMarker = 'p3'}
          aria-label="Location pin 3: Old Goa Basilica"
        >
          <div class="pin-head"><span>3</span></div>
          <div class="pin-popup">
            <strong>Old Goa Basilica</strong>
            <span>Day 2 • 15:30</span>
          </div>
        </button>

        <!-- Marker 4 -->
        <button 
          type="button"
          class="map-marker-pin pin-4" 
          class:selected={activeMarker === 'p4'}
          onclick={() => activeMarker = 'p4'}
          aria-label="Location pin 4: Sahakari Spice Farm"
        >
          <div class="pin-head"><span>4</span></div>
          <div class="pin-popup">
            <strong>Sahakari Spice Farm</strong>
            <span>Day 3 • 09:30</span>
          </div>
        </button>

        <div class="map-controls">
          <button type="button" class="map-btn" aria-label="Zoom in">+</button>
          <button type="button" class="map-btn" aria-label="Zoom out">−</button>
        </div>

        <div class="map-legend">
          <span class="legend-item"><span class="legend-dot"></span> Day Stops</span>
          <span class="legend-item"><span class="legend-line"></span> Planned Route</span>
        </div>
      </div>
    </div>

    <!-- Location Points Roster -->
    <div class="card p-5">
      <h3 class="font-bold text-forest mb-4">Itinerary Locations ({locations.length})</h3>

      {#if locations.length === 0}
        <p class="text-xs text-gray">Add locations to your itinerary items to see them plotted here.</p>
      {:else}
        <div class="locations-list flex-col gap-3">
          {#each locations as loc, i}
            <button 
              type="button"
              class="location-list-item card p-3 text-left w-full"
              class:highlighted={activeMarker === `p${i+1}`}
              onclick={() => activeMarker = `p${i+1}`}
            >
              <div class="flex items-center gap-3">
                <span class="loc-index">{i + 1}</span>
                <div class="flex-1">
                  <h5 class="text-forest font-semibold text-sm">{loc.title}</h5>
                  <p class="text-xs text-gray">{loc.location}</p>
                </div>
                <span class="badge badge-forest text-xs">Day {loc.day}</span>
              </div>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .col-span-2 {
    grid-column: span 2;
  }

  .map-container-card {
    height: 480px;
    position: relative;
    overflow: hidden;
  }

  .map-canvas {
    width: 100%;
    height: 100%;
    background: #e8ebe8;
    position: relative;
    overflow: hidden;
  }

  .map-grid-overlay {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(102, 115, 111, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(102, 115, 111, 0.1) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .map-water-area {
    position: absolute;
    top: 0;
    left: 0;
    width: 45%;
    height: 100%;
    background: #d8e5e1;
    border-right: 3px solid rgba(23, 63, 53, 0.15);
    border-radius: 0 40% 60% 0 / 0 50% 50% 0;
  }

  .map-route-svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2;
  }

  .map-marker-pin {
    position: absolute;
    z-index: 5;
    cursor: pointer;
    transform: translate(-50%, -100%);
  }

  .pin-1 { top: 45%; left: 20%; }
  .pin-2 { top: 30%; left: 45%; }
  .pin-3 { top: 55%; left: 65%; }
  .pin-4 { top: 70%; left: 82%; }

  .pin-head {
    width: 28px;
    height: 28px;
    border-radius: 50% 50% 50% 0;
    background: var(--terracotta);
    color: var(--white);
    transform: rotate(-45deg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8125rem;
    font-weight: 700;
    box-shadow: var(--shadow-md);
    transition: transform var(--transition-fast);
  }

  .pin-head > * {
    transform: rotate(45deg);
  }

  .map-marker-pin:hover .pin-head,
  .map-marker-pin.selected .pin-head {
    background: var(--forest);
    transform: rotate(-45deg) scale(1.2);
  }

  .pin-popup {
    position: absolute;
    bottom: 36px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--white);
    padding: var(--sp-2) var(--sp-3);
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-md);
    white-space: nowrap;
    display: none;
    flex-direction: column;
    border: 1px solid var(--border);
  }

  .pin-popup strong { font-size: 0.8125rem; color: var(--forest); }
  .pin-popup span { font-size: 0.6875rem; color: var(--gray); }

  .map-marker-pin:hover .pin-popup,
  .map-marker-pin.selected .pin-popup {
    display: flex;
  }

  .map-controls {
    position: absolute;
    bottom: var(--sp-4);
    right: var(--sp-4);
    display: flex;
    flex-direction: column;
    gap: 4px;
    z-index: 10;
  }

  .map-btn {
    width: 32px;
    height: 32px;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    color: var(--forest);
    box-shadow: var(--shadow-sm);
  }

  .map-legend {
    position: absolute;
    bottom: var(--sp-4);
    left: var(--sp-4);
    background: rgba(255, 255, 255, 0.9);
    padding: var(--sp-2) var(--sp-3);
    border-radius: var(--radius-sm);
    display: flex;
    gap: var(--sp-3);
    font-size: 0.75rem;
    color: var(--forest);
    font-weight: 600;
    z-index: 10;
  }

  .legend-item { display: flex; align-items: center; gap: 4px; }
  .legend-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--terracotta); }
  .legend-line { width: 14px; height: 2px; background: var(--terracotta); }

  .location-list-item {
    cursor: pointer;
    background: var(--cream);
    transition: all var(--transition-fast);
  }

  .location-list-item:hover,
  .location-list-item.highlighted {
    background: var(--cream-dark);
    border-left: 3px solid var(--terracotta);
  }

  .loc-index {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--forest);
    color: var(--white);
    font-size: 0.75rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 900px) {
    .col-span-2 { grid-column: span 1; }
    .grid-3 { grid-template-columns: 1fr; }
  }
</style>
