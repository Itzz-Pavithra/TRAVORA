<script lang="ts">
  import { page } from '$app/stores';
  import { tripService } from '$lib/services/tripService';
  import { notifications } from '$lib/stores';
  import ItineraryItemCard from '$lib/components/trip/ItineraryItemCard.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import type { ItineraryDay, ItineraryItem } from '$lib/types';

  const tripId = $derived($page.params.id);
  
  let days = $state<ItineraryDay[]>([]);
  let selectedDayId = $state<string>('');

  // Modal State for Adding/Editing Item
  let showModal = $state(false);
  let editItemId = $state<string | null>(null);
  let itemTitle = $state('');
  let itemTime = $state('10:00');
  let itemType = $state<ItineraryItem['type']>('activity');
  let itemLocation = $state('');
  let itemDuration = $state('1h');
  let itemNotes = $state('');
  let itemCost = $state(0);

  $effect(() => {
    if (tripId) {
      days = tripService.getItinerary(tripId);
      if (days.length > 0 && !selectedDayId) {
        selectedDayId = days[0].id;
      }
    }
  });

  const currentDay = $derived(
    days.find(d => d.id === selectedDayId) || days[0]
  );

  function openAddModal() {
    editItemId = null;
    itemTitle = '';
    itemTime = '10:00';
    itemType = 'activity';
    itemLocation = '';
    itemDuration = '1h';
    itemNotes = '';
    itemCost = 0;
    showModal = true;
  }

  function openEditModal(item: ItineraryItem) {
    editItemId = item.id;
    itemTitle = item.title;
    itemTime = item.time;
    itemType = item.type;
    itemLocation = item.location || '';
    itemDuration = item.duration || '';
    itemNotes = item.notes || '';
    itemCost = item.cost || 0;
    showModal = true;
  }

  function handleSaveItem() {
    if (!itemTitle.trim() || !selectedDayId) return;

    if (editItemId) {
      tripService.updateItem(selectedDayId, editItemId, {
        title: itemTitle,
        time: itemTime,
        type: itemType,
        location: itemLocation,
        duration: itemDuration,
        notes: itemNotes,
        cost: itemCost
      });
      notifications.show('Activity updated successfully!');
    } else {
      tripService.addItem(selectedDayId, tripId, {
        title: itemTitle,
        time: itemTime,
        type: itemType,
        location: itemLocation,
        duration: itemDuration,
        notes: itemNotes,
        cost: itemCost,
        order: currentDay ? currentDay.items.length + 1 : 1
      });
      notifications.show('Added new activity to itinerary!');
    }

    days = tripService.getItinerary(tripId);
    showModal = false;
  }

  function handleDeleteItem(itemId: string) {
    if (!selectedDayId) return;
    tripService.deleteItem(selectedDayId, itemId);
    days = tripService.getItinerary(tripId);
    notifications.show('Activity removed from itinerary.');
  }

  function handleAddDay() {
    const nextDayNum = days.length + 1;
    const lastDay = days[days.length - 1];
    let nextDate = new Date().toISOString().split('T')[0];

    if (lastDay) {
      const d = new Date(lastDay.date);
      d.setDate(d.getDate() + 1);
      nextDate = d.toISOString().split('T')[0];
    }

    const newDay = tripService.createDay({
      tripId,
      date: nextDate,
      dayNumber: nextDayNum,
      title: `Day ${nextDayNum} Exploration`,
      items: []
    });

    days = tripService.getItinerary(tripId);
    selectedDayId = newDay.id;
    notifications.show(`Created Day ${nextDayNum}!`);
  }
</script>

<svelte:head>
  <title>Trip Itinerary — Travora</title>
</svelte:head>

<div class="itinerary-tab">
  <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
    <div>
      <h2 class="section-title">Day-by-Day Itinerary</h2>
      <p class="text-xs text-gray">Organize daily activities, sights, travel, and meals.</p>
    </div>

    <div class="flex items-center gap-3">
      <button class="btn btn-cream btn-sm" onclick={handleAddDay}>
        + Add New Day
      </button>
      <button class="btn btn-primary btn-sm" onclick={openAddModal}>
        + Add Activity
      </button>
    </div>
  </div>

  <!-- Day Selector Pills -->
  <div class="day-pills-wrap mb-8">
    {#each days as day}
      <button 
        class="day-pill-btn" 
        class:active={day.id === selectedDayId}
        onclick={() => selectedDayId = day.id}
      >
        <span class="day-number">DAY {day.dayNumber}</span>
        <span class="day-date">{new Date(day.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
      </button>
    {/each}
  </div>

  <!-- Selected Day Timeline -->
  {#if currentDay}
    <div class="current-day-container">
      <div class="current-day-header card p-4 mb-6 flex items-center justify-between">
        <div>
          <h3 class="text-forest font-bold">{currentDay.title}</h3>
          <span class="text-xs text-gray">
            {new Date(currentDay.date).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <span class="badge badge-forest text-xs">{currentDay.items.length} Activities</span>
      </div>

      {#if currentDay.items.length === 0}
        <div class="card p-10 text-center">
          <div class="text-4xl mb-2">🏖️</div>
          <h4 class="text-forest mb-1">No activities for Day {currentDay.dayNumber}</h4>
          <p class="text-gray text-xs mb-4">Start organizing your schedule by adding meals, visits, or stays.</p>
          <button class="btn btn-primary btn-sm" onclick={openAddModal}>
            + Add First Activity
          </button>
        </div>
      {:else}
        <div class="itinerary-timeline">
          {#each currentDay.items.sort((a, b) => a.time.localeCompare(b.time)) as item (item.id)}
            <ItineraryItemCard 
              {item} 
              onedit={openEditModal}
              ondelete={handleDeleteItem}
            />
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  <!-- Add/Edit Item Modal -->
  {#if showModal}
    <Modal 
      title={editItemId ? 'Edit Activity' : 'Add Activity'} 
      onclose={() => showModal = false}
    >
      <form class="flex-col gap-4" onsubmit={(e) => { e.preventDefault(); handleSaveItem(); }}>
        <div class="input-group">
          <label for="itemTitle">Activity Title</label>
          <input 
            id="itemTitle"
            type="text" 
            class="input" 
            bind:value={itemTitle} 
            placeholder="e.g. Visit Baga Beach & Water Sports" 
            required 
          />
        </div>

        <div class="grid-2 gap-3">
          <div class="input-group">
            <label for="itemTime">Time</label>
            <input id="itemTime" type="time" class="input" bind:value={itemTime} required />
          </div>

          <div class="input-group">
            <label for="itemType">Category</label>
            <select id="itemType" class="input" bind:value={itemType}>
              <option value="activity">Beach / Activity</option>
              <option value="sightseeing">Sightseeing / Fort</option>
              <option value="food">Restaurant / Food</option>
              <option value="transport">Transport / Flight</option>
              <option value="accommodation">Hotel / Check-in</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div class="input-group">
          <label for="itemLocation">Location (Optional)</label>
          <input 
            id="itemLocation"
            type="text" 
            class="input" 
            bind:value={itemLocation} 
            placeholder="e.g. Baga Beach, North Goa" 
          />
        </div>

        <div class="grid-2 gap-3">
          <div class="input-group">
            <label for="itemDuration">Duration</label>
            <input 
              id="itemDuration"
              type="text" 
              class="input" 
              bind:value={itemDuration} 
              placeholder="e.g. 2h or 30 mins" 
            />
          </div>

          <div class="input-group">
            <label for="itemCost">Estimated Cost (₹)</label>
            <input 
              id="itemCost"
              type="number" 
              class="input" 
              bind:value={itemCost} 
              placeholder="0" 
            />
          </div>
        </div>

        <div class="input-group">
          <label for="itemNotes">Notes & Tips (Optional)</label>
          <textarea 
            id="itemNotes"
            class="input" 
            bind:value={itemNotes} 
            placeholder="e.g. Bring sunscreen, cash required for parking"
          ></textarea>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button type="button" class="btn btn-cream" onclick={() => showModal = false}>
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            {editItemId ? 'Save Changes' : 'Add to Schedule'}
          </button>
        </div>
      </form>
    </Modal>
  {/if}
</div>

<style>
  .day-pills-wrap {
    display: flex;
    gap: var(--sp-3);
    overflow-x: auto;
    padding-bottom: var(--sp-2);
    scrollbar-width: none;
  }
  .day-pills-wrap::-webkit-scrollbar { display: none; }

  .day-pill-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--sp-3) var(--sp-5);
    border-radius: var(--radius-md);
    background: var(--white);
    border: 1.5px solid var(--border);
    cursor: pointer;
    transition: all var(--transition-fast);
    font-family: inherit;
    min-width: 100px;
  }

  .day-pill-btn:hover {
    border-color: var(--forest);
    background: var(--cream);
  }

  .day-pill-btn.active {
    background: var(--forest);
    border-color: var(--forest);
    color: var(--white);
  }

  .day-number {
    font-size: 0.875rem;
    font-weight: 700;
  }

  .day-date {
    font-size: 0.75rem;
    color: var(--gray);
  }

  .day-pill-btn.active .day-date {
    color: rgba(255, 255, 255, 0.8);
  }

  .itinerary-timeline {
    display: flex;
    flex-direction: column;
  }
</style>
