<script lang="ts">
  import { onMount } from 'svelte';
  import { memoryService } from '$lib/services/memoryService';
  import { currentUser, notifications } from '$lib/stores';
  import MemoryCard from '$lib/components/cards/MemoryCard.svelte';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';
  import type { Memory } from '$lib/types';

  let memories = $state<Memory[]>([]);

  function loadMemories() {
    memories = memoryService.getAll();
  }

  onMount(() => {
    loadMemories();
  });

  function handleLike(id: string) {
    const uid = $currentUser?.id || 'user_demo';
    memoryService.toggleLike(id, uid);
    loadMemories();
  }

  async function handleDelete(mem: Memory) {
    await memoryService.delete(mem);
    notifications.show('Memory removed.');
    loadMemories();
  }
</script>

<svelte:head>
  <title>Travel Memories — Travora</title>
</svelte:head>

<div class="page-with-nav global-memories-page">
  <div class="container py-8">
    <div class="flex items-center justify-between mb-8 flex-wrap gap-4">
      <div>
        <p class="section-label">Your Travel Story</p>
        <h1 class="section-title">All Travel Memories</h1>
        <p class="section-desc">A unified mosaic of all photos, videos, and captured moments across your journeys.</p>
      </div>
    </div>

    <!-- Memory Map / Location Strip -->
    <div class="memory-locations-banner card p-6 mb-8">
      <h3 class="font-bold text-forest mb-3">📍 Memory Map Locations</h3>
      <div class="grid-3 gap-4">
        <div class="loc-summary-card card p-3">
          <strong>Baga Beach, Goa</strong>
          <span class="text-xs text-gray">18 Photos • Dec 2026</span>
        </div>
        <div class="loc-summary-card card p-3">
          <strong>Fort Aguada, Goa</strong>
          <span class="text-xs text-gray">11 Photos • Dec 2026</span>
        </div>
        <div class="loc-summary-card card p-3">
          <strong>Alleppey Backwaters, Kerala</strong>
          <span class="text-xs text-gray">23 Photos • Mar 2026</span>
        </div>
      </div>
    </div>

    {#if memories.length === 0}
      <EmptyState 
        icon="📸"
        title="No memories preserved yet"
        description="Head over to any active or past trip to upload photos and build your collaborative travel albums."
        actionLabel="Go to My Trips"
        onaction={() => window.location.href = '/trips'}
      />
    {:else}
      <div class="grid-3">
        {#each memories as memory (memory.id)}
          <MemoryCard 
            {memory} 
            currentUserId={$currentUser?.id || 'user_demo'}
            onlike={handleLike}
            ondelete={handleDelete}
          />
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .memory-locations-banner {
    background: linear-gradient(135deg, var(--forest-10) 0%, var(--cream) 100%);
    border: 1.5px solid var(--border);
  }

  .loc-summary-card {
    background: var(--white);
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .loc-summary-card strong {
    font-size: 0.9375rem;
    color: var(--forest);
  }
</style>
