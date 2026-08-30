<script lang="ts">
  import { page } from '$app/stores';
  import { getTransportation } from '$lib/data/mockData';
  import TransportCard from '$lib/components/cards/TransportCard.svelte';
  import type { Transportation } from '$lib/types';

  const tripId = $derived($page.params.id);
  
  let transportList = $state<Transportation[]>([]);
  let selectedFilter = $state<string>('all');

  $effect(() => {
    if (tripId) {
      transportList = getTransportation(tripId);
    }
  });

  const categories = [
    { id: 'all', label: 'All Modes' },
    { id: 'flight', label: '✈️ Flights' },
    { id: 'train', label: '🚆 Trains' },
    { id: 'cab', label: '🚕 Cab & Taxi' },
    { id: 'bus', label: '🚌 Bus' },
    { id: 'car', label: '🚗 Car Rental' }
  ];

  const filtered = $derived(
    selectedFilter === 'all' 
      ? transportList 
      : transportList.filter(t => t.type === selectedFilter)
  );
</script>

<svelte:head>
  <title>Transportation Options — Travora</title>
</svelte:head>

<div class="transport-tab">
  <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
    <div>
      <h2 class="section-title">Transportation Options</h2>
      <p class="text-xs text-gray">Compare routes, flight options, transfers, and cab estimates for your journey.</p>
    </div>
  </div>

  <!-- Filter chips -->
  <div class="flex gap-2 mb-6 flex-wrap">
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

  <!-- Transport Cards List -->
  {#if filtered.length === 0}
    <div class="card p-10 text-center">
      <div class="text-4xl mb-2">✈️</div>
      <h4 class="text-forest mb-1">No transportation options for this filter</h4>
      <p class="text-gray text-xs">Switch to "All Modes" to see available flights and cabs.</p>
    </div>
  {:else}
    <div class="flex-col gap-4">
      {#each filtered as transport (transport.id)}
        <TransportCard {transport} />
      {/each}
    </div>
  {/if}
</div>
