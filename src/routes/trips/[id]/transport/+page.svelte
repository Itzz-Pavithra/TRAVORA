<script>
  import { page } from '$app/stores';
  import { tripService } from '$lib/services/tripService.js';
  import { getTransportation } from '$lib/data/mockData.js';
  import { notifications } from '$lib/stores/index.js';
  import TransportCard from '$lib/components/cards/TransportCard.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';

  const tripId = $derived($page.params.id);
  
  let transportList = $state([]);
  let selectedFilter = $state('all');
  let showAddModal = $state(false);

  let type = $state('flight');
  let provider = $state('IndiGo 6E-204');
  let from = $state('Bangalore (BLR)');
  let to = $state('Goa (GOI)');
  let departureTime = $state('08:30 AM');
  let arrivalTime = $state('09:45 AM');
  let price = $state(4500);

  $effect(() => {
    if (tripId) {
      tripService.getTransportation(tripId).then(data => {
        if (data.length > 0) {
          transportList = data;
        } else {
          transportList = getTransportation(tripId);
        }
      });
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

  async function handleAddTransport() {
    if (!provider.trim() || !from.trim() || !to.trim()) {
      notifications.show('Please provide provider and route details.', 'error');
      return;
    }

    try {
      const newT = await tripService.addTransportation(tripId, {
        type,
        provider: provider.trim(),
        from: from.trim(),
        to: to.trim(),
        departureTime,
        arrivalTime,
        duration: '1h 15m',
        price,
        currency: 'INR'
      });

      transportList = [newT, ...transportList];
      notifications.show(`Added ${provider} to transportation! ✈️`);
      showAddModal = false;
    } catch (err) {
      notifications.show(`Failed to add transport: ${err.message}`, 'error');
    }
  }
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

    <button class="btn btn-primary" onclick={() => showAddModal = true}>
      + Add Transport
    </button>
  </div>

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

  {#if filtered.length === 0}
    <div class="card p-10 text-center">
      <div class="text-4xl mb-2">✈️</div>
      <h4 class="text-forest mb-1">No transportation options for this filter</h4>
      <p class="text-gray text-xs mb-4">Switch to "All Modes" or add custom travel details.</p>
      <button class="btn btn-primary btn-sm" onclick={() => showAddModal = true}>
        + Add Transport Option
      </button>
    </div>
  {:else}
    <div class="flex-col gap-4">
      {#each filtered as transport (transport.id)}
        <TransportCard {transport} />
      {/each}
    </div>
  {/if}

  {#if showAddModal}
    <Modal title="Add Transport Detail" onclose={() => showAddModal = false}>
      <form class="flex-col gap-4" onsubmit={(e) => { e.preventDefault(); handleAddTransport(); }}>
        <div class="grid-2 gap-3">
          <div class="input-group">
            <label for="tType">Mode</label>
            <select id="tType" class="input" bind:value={type}>
              <option value="flight">✈️ Flight</option>
              <option value="train">🚆 Train</option>
              <option value="cab">🚕 Cab / Taxi</option>
              <option value="bus">🚌 Bus</option>
              <option value="car">🚗 Car Rental</option>
            </select>
          </div>

          <div class="input-group">
            <label for="tProvider">Provider / Flight No</label>
            <input id="tProvider" type="text" class="input" bind:value={provider} placeholder="e.g. Air India AI-580" required />
          </div>
        </div>

        <div class="grid-2 gap-3">
          <div class="input-group">
            <label for="tFrom">Departure Location</label>
            <input id="tFrom" type="text" class="input" bind:value={from} placeholder="e.g. Mumbai (BOM)" required />
          </div>

          <div class="input-group">
            <label for="tTo">Arrival Location</label>
            <input id="tTo" type="text" class="input" bind:value={to} placeholder="e.g. Goa (GOI)" required />
          </div>
        </div>

        <div class="grid-3 gap-3">
          <div class="input-group">
            <label for="tDept">Departure Time</label>
            <input id="tDept" type="text" class="input" bind:value={departureTime} placeholder="08:30 AM" />
          </div>

          <div class="input-group">
            <label for="tArr">Arrival Time</label>
            <input id="tArr" type="text" class="input" bind:value={arrivalTime} placeholder="10:00 AM" />
          </div>

          <div class="input-group">
            <label for="tPrice">Price (₹)</label>
            <input id="tPrice" type="number" class="input" bind:value={price} min="0" required />
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button type="button" class="btn btn-cream" onclick={() => showAddModal = false}>Cancel</button>
          <button type="submit" class="btn btn-primary">Save Transport</button>
        </div>
      </form>
    </Modal>
  {/if}
</div>
