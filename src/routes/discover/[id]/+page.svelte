<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { getDestinationById, getActivities, getAccommodations, getTransportation } from '$lib/data/mockData';
  import { currentUser, savedPlaces, notifications } from '$lib/stores';
  import type { Destination, Activity, Accommodation, Transportation, SavedPlace } from '$lib/types';

  const destId = $derived($page.params.id);
  let destination = $state<Destination | null>(null);
  let activities = $state<Activity[]>([]);
  let stays = $state<Accommodation[]>([]);
  let transports = $state<Transportation[]>([]);

  $effect(() => {
    if (destId) {
      destination = getDestinationById(destId);
      activities = getActivities().slice(0, 4);
      stays = getAccommodations().slice(0, 3);
      transports = getTransportation().slice(0, 3);
    }
  });

  const isSaved = $derived(
    destination && $currentUser ? savedPlaces.isSaved(destination.id, $currentUser.id) : false
  );

  function handleToggleSave() {
    if (!destination || !$currentUser) {
      notifications.show('Please sign in to save destinations.', 'error');
      return;
    }
    const place: SavedPlace = {
      id: '',
      userId: $currentUser.id,
      placeId: destination.id,
      name: destination.name,
      location: destination.country,
      type: 'destination',
      savedAt: new Date().toISOString()
    };
    savedPlaces.toggle(place);
    notifications.show(isSaved ? `Removed ${destination.name} from saved places.` : `Saved ${destination.name} to bookmarks!`);
  }

  function handleStartTrip() {
    if (destination) {
      goto(`/trips/create`);
    }
  }
</script>

<svelte:head>
  <title>{destination?.name || 'Destination Details'} — Travora</title>
</svelte:head>

<div class="page-with-nav destination-detail-page">
  {#if destination}
    <!-- Destination Hero -->
    <div class="dest-hero">
      <div class="dest-hero-bg" style="background: linear-gradient(135deg, var(--forest) 0%, #1f5448 100%)">
        {#if destination.image}
          <img src={destination.image} alt={destination.name} class="img-cover hero-img" onerror={(e) => (e.currentTarget as HTMLImageElement).style.display='none'} />
        {/if}
        <div class="hero-overlay"></div>
      </div>

      <div class="container hero-container">
        <a href="/discover" class="btn btn-cream btn-sm back-btn mb-6">
          ← Back to Discover
        </a>

        <div class="flex items-end justify-between flex-wrap gap-6">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="badge badge-terracotta">📍 {destination.country}</span>
              <span class="badge badge-cream">⭐ {destination.rating} ({destination.reviewCount.toLocaleString()} reviews)</span>
            </div>
            <h1 class="dest-title display-serif">{destination.name}</h1>
            <p class="dest-sub text-white opacity-90">Best Time: {destination.bestTime}</p>
          </div>

          <div class="hero-actions flex gap-3">
            <button 
              class="btn btn-cream" 
              onclick={handleToggleSave}
            >
              {isSaved ? '❤️ Saved' : '🤍 Save Place'}
            </button>

            <button class="btn btn-accent btn-lg" onclick={handleStartTrip}>
              Plan Trip Here ✦
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container py-10">
      <div class="grid-3 gap-8">
        <!-- Main Info Column (2 cols) -->
        <div class="col-span-2 flex-col gap-8">
          <!-- Overview Card -->
          <div class="card p-6">
            <h3 class="font-bold text-forest text-xl mb-3">About {destination.name}</h3>
            <p class="text-gray leading-relaxed mb-6">{destination.description}</p>

            <h4 class="font-bold text-forest text-md mb-3">Signature Highlights</h4>
            <div class="flex gap-2 flex-wrap mb-6">
              {#each destination.highlights as highlight}
                <span class="chip chip-lg">✨ {highlight}</span>
              {/each}
            </div>

            <h4 class="font-bold text-forest text-md mb-3">Categories</h4>
            <div class="flex gap-2 flex-wrap">
              {#each destination.category as cat}
                <span class="badge badge-forest">{cat}</span>
              {/each}
            </div>
          </div>

          <!-- Top Activities -->
          <div class="card p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-forest text-xl">Top Recommended Activities</h3>
            </div>

            <div class="flex-col gap-4">
              {#each activities as act}
                <div class="activity-row-card card p-4 flex items-center justify-between gap-4">
                  <div>
                    <span class="badge badge-terracotta text-xs mb-1">{act.category}</span>
                    <h4 class="font-bold text-forest">{act.name}</h4>
                    <p class="text-xs text-gray">{act.location} • ⏱️ {act.duration}</p>
                  </div>
                  <div class="text-right flex-shrink-0">
                    <span class="text-forest font-bold text-md block">₹{act.estimatedCost.toLocaleString('en-IN')}</span>
                    <button class="btn btn-ghost btn-sm mt-1" onclick={handleStartTrip}>+ Plan in Trip</button>
                  </div>
                </div>
              {/each}
            </div>
          </div>

          <!-- Stays & Accommodation -->
          <div class="card p-6">
            <h3 class="font-bold text-forest text-xl mb-4">Where to Stay</h3>
            <div class="grid-2 gap-4">
              {#each stays as stay}
                <div class="card p-4 bg-cream">
                  <span class="badge badge-forest text-xs mb-2">{stay.type.toUpperCase()}</span>
                  <h4 class="font-bold text-forest mb-1">{stay.name}</h4>
                  <p class="text-xs text-gray mb-2">📍 {stay.location}</p>
                  <div class="flex items-center justify-between text-xs pt-2 border-t">
                    <span class="text-terracotta font-bold">₹{stay.pricePerNight.toLocaleString('en-IN')} / night</span>
                    <span>⭐ {stay.rating}</span>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>

        <!-- Sidebar Info (1 col) -->
        <div class="flex-col gap-6">
          <!-- Budget Estimation Widget -->
          <div class="card p-6 bg-forest text-white">
            <p class="text-xs text-terracotta-light uppercase tracking-wider font-bold mb-1">Estimated Travel Budget</p>
            <h2 class="text-3xl font-bold font-serif text-white mb-2">
              ₹{(destination.estimatedBudget).toLocaleString('en-IN')}
            </h2>
            <p class="text-xs text-white opacity-80 mb-4">Average cost per traveler for a 4-5 day trip, including stay, food, and activities.</p>

            <button class="btn btn-accent w-full" onclick={handleStartTrip}>
              Create Trip Workspace
            </button>
          </div>

          <!-- Getting There (Transportation) -->
          <div class="card p-6">
            <h3 class="font-bold text-forest text-md mb-3">✈️ Transportation Guide</h3>
            <div class="flex-col gap-3 text-xs text-gray">
              {#each transports as t}
                <div class="p-3 bg-cream rounded-md flex items-center justify-between">
                  <div>
                    <strong class="text-forest block">{t.provider} ({t.type.toUpperCase()})</strong>
                    <span>{t.from} → {t.to}</span>
                  </div>
                  <span class="text-forest font-bold">₹{t.price}</span>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <div class="container py-16 text-center">
      <h3>Destination not found</h3>
      <a href="/discover" class="btn btn-primary mt-4">Back to Discover</a>
    </div>
  {/if}
</div>

<style>
  .dest-hero {
    position: relative;
    padding: var(--sp-12) 0;
    min-height: 380px;
    display: flex;
    align-items: flex-end;
  }

  .dest-hero-bg {
    position: absolute;
    inset: 0;
  }

  .hero-img {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(23,63,53,0.95) 0%, rgba(23,63,53,0.4) 60%);
    z-index: 1;
  }

  .hero-container {
    position: relative;
    z-index: 2;
  }

  .dest-title {
    font-size: clamp(2.25rem, 5vw, 3.5rem);
    color: var(--white);
    line-height: 1.1;
  }

  .col-span-2 { grid-column: span 2; }

  .bg-cream { background: var(--cream); }
  .bg-forest { background: var(--forest); }
  .border-t { border-top: 1px solid var(--border); }
  .w-full { width: 100%; }

  @media (max-width: 900px) {
    .col-span-2 { grid-column: span 1; }
    .grid-3 { grid-template-columns: 1fr; }
  }
</style>
