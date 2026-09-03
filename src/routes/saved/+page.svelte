<script>
  import { onMount } from 'svelte';
  import { currentUser, savedPlaces, notifications } from '$lib/stores/index.js';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';

  onMount(() => {
    if ($currentUser) {
      savedPlaces.load($currentUser.id);
    }
  });

  async function handleRemove(place) {
    await savedPlaces.toggle(place);
    notifications.show(`Removed ${place.name} from saved items.`);
  }
</script>

<svelte:head>
  <title>Saved Places — Travora</title>
</svelte:head>

<div class="page-with-nav saved-page">
  <div class="container py-8">
    <div class="saved-header mb-8">
      <p class="section-label">Your Bookmarks</p>
      <h1 class="section-title">Saved Places & Stays</h1>
      <p class="section-desc">Quick reference list for destinations, hotels, and activities you bookmarked.</p>
    </div>

    {#if $savedPlaces.length === 0}
      <EmptyState 
        icon="🔖"
        title="No saved places yet"
        description="Explore destinations and hotels across Travora to bookmark your favorites."
        actionLabel="Discover Destinations"
        onaction={() => window.location.href = '/discover'}
      />
    {:else}
      <div class="grid-3">
        {#each $savedPlaces as place (place.id)}
          <div class="card saved-item-card p-5">
            <div class="flex items-center justify-between mb-2">
              <span class="badge badge-forest text-xs">{place.type?.toUpperCase() || 'PLACE'}</span>
              <button class="btn-icon text-terracotta" onclick={() => handleRemove(place)} title="Remove bookmark">
                🔖
              </button>
            </div>
            <h3 class="text-forest font-bold mb-1">{place.name}</h3>
            <p class="text-xs text-gray mb-3">📍 {place.location}</p>
            <span class="text-xs text-gray block">Saved {new Date(place.savedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .saved-item-card {
    background: var(--white);
  }
  .block { display: block; }
</style>
