<script lang="ts">
  import { page } from '$app/stores';
  import { getActivities } from '$lib/data/mockData';
  import { tripService } from '$lib/services/tripService';
  import { notifications } from '$lib/stores';
  import ActivityCard from '$lib/components/cards/ActivityCard.svelte';
  import type { Activity } from '$lib/types';

  const tripId = $derived($page.params.id);
  
  let activities = $state<Activity[]>([]);

  $effect(() => {
    if (tripId) {
      activities = getActivities(tripId);
    }
  });

  function handleAddToItinerary(act: Activity) {
    const days = tripService.getItinerary(tripId);
    if (days.length === 0) {
      notifications.show('Please create an itinerary day first.', 'error');
      return;
    }

    const firstDay = days[0];
    tripService.addItem(firstDay.id, tripId, {
      title: act.name,
      time: '14:00',
      type: 'activity',
      location: act.location,
      duration: act.duration,
      notes: act.description,
      cost: act.estimatedCost,
      order: firstDay.items.length + 1
    });

    notifications.show(`Added "${act.name}" to Day 1 itinerary!`);
  }
</script>

<svelte:head>
  <title>Activities & Experiences — Travora</title>
</svelte:head>

<div class="activities-tab">
  <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
    <div>
      <h2 class="section-title">Activities & Experiences</h2>
      <p class="text-xs text-gray">Explore things to do in this destination and add them directly to your schedule.</p>
    </div>
  </div>

  <div class="grid-3">
    {#each activities as activity (activity.id)}
      <ActivityCard 
        {activity} 
        onadd={handleAddToItinerary}
      />
    {/each}
  </div>
</div>
