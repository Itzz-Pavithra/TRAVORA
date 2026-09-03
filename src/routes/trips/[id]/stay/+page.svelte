<script>
  import { page } from '$app/stores';
  import { tripService } from '$lib/services/tripService.js';
  import { currentUser, savedPlaces, notifications } from '$lib/stores/index.js';
  import HotelCard from '$lib/components/cards/HotelCard.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import { getAccommodations } from '$lib/data/mockData.js';

  const tripId = $derived($page.params.id);
  
  let hotels = $state([]);
  let showAddModal = $state(false);

  let name = $state('');
  let location = $state('');
  let type = $state('hotel');
  let pricePerNight = $state(3500);
  let amenitiesInput = $state('Wifi, Swimming Pool, Breakfast');

  $effect(() => {
    if (tripId) {
      tripService.getAccommodations(tripId).then(data => {
        if (data.length > 0) {
          hotels = data;
        } else {
          hotels = getAccommodations(tripId);
        }
      });
    }
  });

  async function handleAddStay() {
    if (!name.trim() || !location.trim()) {
      notifications.show('Please provide hotel name and location.', 'error');
      return;
    }

    try {
      const newAccom = await tripService.addAccommodation(tripId, {
        name: name.trim(),
        location: location.trim(),
        type,
        pricePerNight,
        currency: 'INR',
        rating: 4.8,
        reviewCount: 12,
        amenities: amenitiesInput.split(',').map(a => a.trim()).filter(Boolean)
      });

      hotels = [newAccom, ...hotels];
      notifications.show(`Added ${name} to stays! 🏨`);
      showAddModal = false;
      name = '';
      location = '';
    } catch (err) {
      notifications.show(`Failed to add stay: ${err.message}`, 'error');
    }
  }

  function handleSave(hotel) {
    if (!$currentUser) return;
    const place = {
      id: '',
      userId: $currentUser.id,
      placeId: hotel.id,
      name: hotel.name,
      location: hotel.location,
      type: 'hotel',
      savedAt: new Date().toISOString()
    };
    savedPlaces.toggle(place);
    notifications.show(`Updated bookmark for ${hotel.name}!`);
  }
</script>

<svelte:head>
  <title>Stay & Accommodation — Travora</title>
</svelte:head>

<div class="stay-tab">
  <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
    <div>
      <h2 class="section-title">Stay & Accommodation</h2>
      <p class="text-xs text-gray">Hotels, beachside villas, hostels, and boutique stays for your trip.</p>
    </div>

    <button class="btn btn-primary" onclick={() => showAddModal = true}>
      + Add Custom Stay
    </button>
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

  {#if showAddModal}
    <Modal title="Add Custom Stay" onclose={() => showAddModal = false}>
      <form class="flex-col gap-4" onsubmit={(e) => { e.preventDefault(); handleAddStay(); }}>
        <div class="input-group">
          <label for="stayName">Property / Hotel Name</label>
          <input id="stayName" type="text" class="input" bind:value={name} placeholder="e.g. Taj Holiday Village Resort" required />
        </div>

        <div class="input-group">
          <label for="stayLoc">Location / Address</label>
          <input id="stayLoc" type="text" class="input" bind:value={location} placeholder="e.g. Sinquerim, Candolim, Goa" required />
        </div>

        <div class="grid-2 gap-3">
          <div class="input-group">
            <label for="stayType">Type</label>
            <select id="stayType" class="input" bind:value={type}>
              <option value="hotel">🏨 Hotel</option>
              <option value="resort">🌴 Resort</option>
              <option value="airbnb">🏡 Villa / Airbnb</option>
              <option value="hostel">🎒 Hostel</option>
              <option value="guesthouse">🔑 Guesthouse</option>
            </select>
          </div>

          <div class="input-group">
            <label for="stayPrice">Price per Night (₹)</label>
            <input id="stayPrice" type="number" class="input" bind:value={pricePerNight} min="500" required />
          </div>
        </div>

        <div class="input-group">
          <label for="stayAmenities">Amenities (comma-separated)</label>
          <input id="stayAmenities" type="text" class="input" bind:value={amenitiesInput} placeholder="Wifi, Pool, Breakfast, Parking" />
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button type="button" class="btn btn-cream" onclick={() => showAddModal = false}>Cancel</button>
          <button type="submit" class="btn btn-primary">Save Stay</button>
        </div>
      </form>
    </Modal>
  {/if}
</div>
