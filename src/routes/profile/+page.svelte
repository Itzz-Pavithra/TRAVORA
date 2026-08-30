<script lang="ts">
  import { onMount } from 'svelte';
  import { currentUser, trips, savedPlaces } from '$lib/stores';
  import TripCard from '$lib/components/cards/TripCard.svelte';

  onMount(() => {
    if ($currentUser) {
      trips.load($currentUser.id);
      savedPlaces.load($currentUser.id);
    }
  });

  const initials = $derived(
    $currentUser?.name ? $currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'P'
  );
</script>

<svelte:head>
  <title>Profile — Travora</title>
</svelte:head>

<div class="page-with-nav profile-page">
  <div class="container py-8">
    <!-- Profile Header Card -->
    <div class="profile-header-card card p-8 mb-8">
      <div class="flex items-center gap-6 flex-wrap">
        <div class="avatar avatar-xl" style="background: {$currentUser?.avatarColor || '#D97745'}; color: white;">
          {initials}
        </div>

        <div class="flex-1">
          <div class="flex items-center gap-3 mb-1">
            <h1 class="text-2xl font-bold text-forest">{$currentUser?.name || 'Pavithra'}</h1>
            <span class="badge badge-forest text-xs">
              {$currentUser?.travelPreference === 'solo' ? '🧍 Solo Explorer' : '👥 Group Traveler'}
            </span>
          </div>
          <p class="text-xs text-gray mb-3">{$currentUser?.email || 'pavithra@travora.app'}</p>
          <p class="text-sm text-forest max-w-md">
            Passionate travel enthusiast exploring scenic coastlines, cultural heritage sites, and creating shared memories with friends.
          </p>
        </div>

        <div class="profile-actions">
          <a href="/settings" class="btn btn-outline btn-sm">
            ⚙️ Edit Settings
          </a>
        </div>
      </div>

      <!-- Stats Strip -->
      <div class="grid-4 gap-4 mt-8 pt-6 border-t">
        <div class="stat-box text-center">
          <span class="stat-number">{$trips.length}</span>
          <span class="stat-label">Trips Planned</span>
        </div>
        <div class="stat-box text-center">
          <span class="stat-number">{$savedPlaces.length}</span>
          <span class="stat-label">Saved Places</span>
        </div>
        <div class="stat-box text-center">
          <span class="stat-number">47</span>
          <span class="stat-label">Memories Preserved</span>
        </div>
        <div class="stat-box text-center">
          <span class="stat-number">4.9 ★</span>
          <span class="stat-label">Traveler Score</span>
        </div>
      </div>
    </div>

    <!-- User's Trips Showcase -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="section-title">My Travel Journeys</h2>
        <a href="/trips/create" class="btn btn-primary btn-sm">+ Plan New Trip</a>
      </div>

      <div class="grid-3">
        {#each $trips as trip (trip.id)}
          <TripCard {trip} />
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .profile-header-card {
    background: var(--white);
  }

  .border-t {
    border-top: 1px solid var(--border);
  }

  .stat-box {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .stat-number {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--forest);
    font-family: var(--font-serif);
  }

  .stat-label {
    font-size: 0.75rem;
    color: var(--gray);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
</style>
