<script>
  import { page } from '$app/stores';
  import { getActivities } from '$lib/data/mockData.js';
  import { tripService } from '$lib/services/tripService.js';
  import { notifications } from '$lib/stores/index.js';
  import ActivityCard from '$lib/components/cards/ActivityCard.svelte';

  const tripId = $derived($page.params.id);
  
  let activities = $state([]);

  $effect(() => {
    if (tripId) {
      tripService.getActivities(tripId).then(data => {
        if (data.length > 0) {
          activities = data;
        } else {
          activities = getActivities(tripId);
        }
      });
    }
  });

  async function handleAddToItinerary(act) {
    const days = await tripService.getItinerary(tripId);
    if (days.length === 0) {
      notifications.show('Please create an itinerary day first.', 'error');
      return;
    }

    const firstDay = days[0];
    try {
      await tripService.addItem(tripId, firstDay.id, {
        title: act.name,
        time: '14:00',
        type: 'activity',
        location: act.location,
        duration: act.duration,
        notes: act.description,
        cost: act.estimatedCost,
        order: (firstDay.items?.length || 0) + 1
      });

      notifications.show(`Added "${act.name}" to Day 1 itinerary! 🎟️`);
    } catch (err) {
      notifications.show(`Failed to add activity: ${err.message}`, 'error');
    }
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
