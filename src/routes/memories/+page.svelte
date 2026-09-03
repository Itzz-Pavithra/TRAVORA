<script>
  import { memoryService } from '$lib/services/memoryService.js';
  import { currentUser, trips } from '$lib/stores/index.js';
  import MemoryCard from '$lib/components/cards/MemoryCard.svelte';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';

  let memories = $state([]);

  $effect(() => {
    if ($currentUser && $trips.length > 0) {
      Promise.all($trips.map(t => memoryService.getAll(t.id))).then(results => {
        memories = results.flat().sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
      });
    }
  });

  async function handleLike(memId) {
    const mem = memories.find(m => m.id === memId);
    if (mem && $currentUser) {
      await memoryService.toggleLike(mem.tripId, memId, $currentUser.id);
    }
  }

  async function handleDelete(mem) {
    await memoryService.delete(mem.tripId, mem);
    memories = memories.filter(m => m.id !== mem.id);
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
            currentUserId={$currentUser?.id || ''}
            onlike={() => handleLike(memory.id)}
            ondelete={() => handleDelete(memory)}
          />
        {/each}
      </div>
    {/if}
  </div>
</div>
