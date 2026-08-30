<script lang="ts">
  import { onMount } from 'svelte';
  import { currentUser, savedPlaces, notifications } from '$lib/stores';
  import { getDestinations } from '$lib/data/mockData';
  import type { Destination, SavedPlace } from '$lib/types';
  import DestinationCard from '$lib/components/cards/DestinationCard.svelte';

  let destinations = $state<Destination[]>([]);
  let searchQuery = $state('');
  let selectedCategory = $state<string>('All');
  let selectedBudget = $state<string>('All');

  const categories = ['All', 'Beaches', 'Nature', 'Culture', 'Adventure', 'Relaxation', 'Food', 'Mountains', 'Shopping', 'Heritage'];
  const budgetRanges = [
    { label: 'All Budgets', value: 'All' },
    { label: 'Under ₹20,000', value: 'under-20' },
    { label: '₹20,000 – ₹50,000', value: '20-50' },
    { label: 'Above ₹50,000', value: 'above-50' }
  ];

  onMount(() => {
    destinations = getDestinations();
    if ($currentUser) {
      savedPlaces.load($currentUser.id);
    }
  });

  const filtered = $derived(
    destinations.filter(d => {
      const matchQuery = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         d.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCat = selectedCategory === 'All' || d.category.includes(selectedCategory);
      
      let matchBudget = true;
      if (selectedBudget === 'under-20') matchBudget = d.estimatedBudget < 20000;
      else if (selectedBudget === '20-50') matchBudget = d.estimatedBudget >= 20000 && d.estimatedBudget <= 50000;
      else if (selectedBudget === 'above-50') matchBudget = d.estimatedBudget > 50000;

      return matchQuery && matchCat && matchBudget;
    })
  );

  function handleSave(dest: Destination) {
    if (!$currentUser) return;
    const place: SavedPlace = {
      id: '',
      userId: $currentUser.id,
      placeId: dest.id,
      name: dest.name,
      location: dest.country,
      type: 'destination',
      savedAt: new Date().toISOString()
    };
    savedPlaces.toggle(place);
    const isNowSaved = savedPlaces.isSaved(dest.id, $currentUser.id);
    notifications.show(isNowSaved ? `Saved ${dest.name} to places!` : `Removed ${dest.name} from saved.`);
  }
</script>

<svelte:head>
  <title>Discover Destinations — Travora</title>
</svelte:head>

<div class="page-with-nav discover-page">
  <div class="container py-8">
    <div class="discover-header mb-8">
      <p class="section-label">Explore the World</p>
      <h1 class="section-title">Discover Your Next Destination</h1>
      <p class="section-desc">Search through curated travel spots, view estimated budgets, best visiting seasons, and signature highlights.</p>
    </div>

    <!-- Filter Bar -->
    <div class="filter-box card mb-8">
      <div class="card-body">
        <div class="grid-3 gap-4 mb-4">
          <div class="input-icon-wrap">
            <span class="input-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input 
              type="text" 
              class="input" 
              bind:value={searchQuery}
              placeholder="Search destination, city, or highlight..." 
            />
          </div>

          <select class="input" bind:value={selectedCategory}>
            {#each categories as cat}
              <option value={cat}>{cat === 'All' ? 'All Experience Types' : cat}</option>
            {/each}
          </select>

          <select class="input" bind:value={selectedBudget}>
            {#each budgetRanges as b}
              <option value={b.value}>{b.label}</option>
            {/each}
          </select>
        </div>

        <div class="flex items-center justify-between text-xs text-gray pt-2 border-t">
          <span>Showing <strong>{filtered.length}</strong> destinations</span>
          {#if searchQuery || selectedCategory !== 'All' || selectedBudget !== 'All'}
            <button 
              class="btn-ghost btn-sm text-terracotta" 
              onclick={() => { searchQuery = ''; selectedCategory = 'All'; selectedBudget = 'All'; }}
            >
              Reset Filters
            </button>
          {/if}
        </div>
      </div>
    </div>

    <!-- Destination Cards Grid -->
    {#if filtered.length === 0}
      <div class="card p-12 text-center">
        <div class="text-4xl mb-3">🗺️</div>
        <h3 class="text-forest mb-2">No Destinations Found</h3>
        <p class="text-gray text-sm mb-4">Try broadening your search or resetting category and budget filters.</p>
        <button 
          class="btn btn-cream btn-sm" 
          onclick={() => { searchQuery = ''; selectedCategory = 'All'; selectedBudget = 'All'; }}
        >
          Reset All Filters
        </button>
      </div>
    {:else}
      <div class="grid-3">
        {#each filtered as dest (dest.id)}
          <DestinationCard 
            destination={dest} 
            saved={$currentUser ? savedPlaces.isSaved(dest.id, $currentUser.id) : false}
            onsave={() => handleSave(dest)}
          />
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .border-t {
    border-top: 1px solid var(--border);
  }
</style>
