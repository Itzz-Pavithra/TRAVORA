<script>
  import { page } from '$app/stores';
  import { tripService } from '$lib/services/tripService.js';
  import { notifications } from '$lib/stores/index.js';
  import ItineraryItemCard from '$lib/components/trip/ItineraryItemCard.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';

  const tripId = $derived($page.params.id);
  
  let days = $state([]);
  let selectedDayId = $state('');
  let loading = $state(false);

  // Modal State
  let showModal = $state(false);
  let editItemId = $state(null);
  let itemTitle = $state('');
  let itemTime = $state('10:00');
  let itemType = $state('activity');
  let itemLocation = $state('');
  let itemDuration = $state('1h');
  let itemNotes = $state('');
  let itemCost = $state(0);

  $effect(() => {
    if (tripId) {
      const unsub = tripService.subscribeToItinerary(tripId, (data) => {
        days = data;
        if (days.length > 0 && !selectedDayId) {
          selectedDayId = days[0].id;
        }
      });
      return () => unsub();
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

  function openEditModal(item) {
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

  async function handleSaveItem() {
    if (!itemTitle.trim() || !selectedDayId) return;

    loading = true;
    try {
      if (editItemId) {
        await tripService.updateItem(tripId, selectedDayId, editItemId, {
          title: itemTitle,
          time: itemTime,
          type: itemType,
          location: itemLocation,
          duration: itemDuration,
          notes: itemNotes,
          cost: itemCost
        });
        notifications.show('Activity updated!');
      } else {
        await tripService.addItem(tripId, selectedDayId, {
          title: itemTitle,
          time: itemTime,
          type: itemType,
          location: itemLocation,
          duration: itemDuration,
          notes: itemNotes,
          cost: itemCost,
          order: currentDay ? (currentDay.items?.length || 0) + 1 : 1
        });
        notifications.show('Added new activity to itinerary!');
      }
      showModal = false;
    } catch (err) {
      notifications.show(`Error: ${err.message}`, 'error');
    } finally {
      loading = false;
    }
  }

  async function handleDeleteItem(itemId) {
    if (!selectedDayId) return;
    try {
      await tripService.deleteItem(tripId, selectedDayId, itemId);
      notifications.show('Activity removed.');
    } catch (err) {
      notifications.show(`Failed to delete: ${err.message}`, 'error');
    }
  }

  async function handleAddDay() {
    const nextDayNum = days.length + 1;
    const lastDay = days[days.length - 1];
    let nextDate = new Date().toISOString().split('T')[0];

    if (lastDay) {
      const d = new Date(lastDay.date);
      d.setDate(d.getDate() + 1);
      nextDate = d.toISOString().split('T')[0];
    }

    try {
      const newDay = await tripService.createDay(tripId, {
        date: nextDate,
        dayNumber: nextDayNum,
        title: `Day ${nextDayNum} Exploration`,
        items: []
      });
      selectedDayId = newDay.id;
      notifications.show(`Created Day ${nextDayNum}!`);
    } catch (err) {
      notifications.show(`Failed to create day: ${err.message}`, 'error');
    }
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

  {#if currentDay}
    <div class="current-day-container">
      <div class="current-day-header card p-4 mb-6 flex items-center justify-between">
        <div>
          <h3 class="text-forest font-bold">{currentDay.title}</h3>
          <span class="text-xs text-gray">
            {new Date(currentDay.date).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <span class="badge badge-forest text-xs">{currentDay.items?.length || 0} Activities</span>
      </div>

      {#if !currentDay.items || currentDay.items.length === 0}
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
          {#each currentDay.items.slice().sort((a, b) => a.time.localeCompare(b.time)) as item (item.id)}
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
          <button type="button" class="btn btn-cream" onclick={() => showModal = false} disabled={loading}>
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" disabled={loading}>
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
