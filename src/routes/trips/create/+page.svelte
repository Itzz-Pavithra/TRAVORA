<script>
  import { goto } from '$app/navigation';
  import { currentUser, trips, notifications } from '$lib/stores/index.js';
  import { tripService } from '$lib/services/tripService.js';

  let step = $state(1);
  let loading = $state(false);

  // Form State
  let name = $state('');
  let destination = $state('');
  let country = $state('India');
  let startDate = $state('2026-12-15');
  let endDate = $state('2026-12-20');
  let travelers = $state(4);
  let type = $state('group');
  let budget = $state(25000);
  let interests = $state(['beaches', 'food', 'photography']);

  const allInterests = [
    { id: 'nature', label: '🌿 Nature' },
    { id: 'food', label: '🍲 Food & Culinary' },
    { id: 'adventure', label: '🏄 Adventure' },
    { id: 'beaches', label: '🏖️ Beaches' },
    { id: 'culture', label: '🏛️ Culture & Heritage' },
    { id: 'shopping', label: '🛍️ Shopping' },
    { id: 'nightlife', label: '🌃 Nightlife' },
    { id: 'relaxation', label: '🧘 Relaxation' },
    { id: 'photography', label: '📸 Photography' }
  ];

  function toggleInterest(id) {
    if (interests.includes(id)) {
      interests = interests.filter(i => i !== id);
    } else {
      interests = [...interests, id];
    }
  }

  async function handleCreateTrip() {
    if (!destination.trim()) {
      notifications.show('Please specify a destination.', 'error');
      return;
    }

    loading = true;
    try {
      const tripName = name.trim() || `${destination} Escape`;
      const ownerId = $currentUser?.id || 'guest_user';
      const ownerName = $currentUser?.name || 'Traveler';
      const ownerEmail = $currentUser?.email || '';

      const newTrip = await tripService.create({
        name: tripName,
        destination,
        country,
        startDate,
        endDate,
        travelers: type === 'solo' ? 1 : travelers,
        type,
        budget,
        currency: 'INR',
        budgetSpent: 0,
        interests,
        status: 'upcoming',
        ownerId,
        memberIds: [ownerId]
      });

      await tripService.addMember(newTrip.id, {
        userId: ownerId,
        name: ownerName,
        email: ownerEmail,
        avatarColor: $currentUser?.avatarColor || '#D97745',
        role: 'owner',
        joinedAt: new Date().toISOString(),
        status: 'active'
      });

      if ($currentUser) {
        trips.load($currentUser.id);
      }

      notifications.show(`Trip "${tripName}" created successfully! 🎉`);
      goto(`/trips/${newTrip.id}`);
    } catch (err) {
      notifications.show(`Failed to create trip: ${err.message}`, 'error');
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Create Trip — Travora</title>
</svelte:head>

<div class="page-with-nav create-trip-page">
  <div class="container container-sm py-10">
    <div class="card p-8">
      <!-- Step Indicator -->
      <div class="step-indicator mb-8">
        {#each [1, 2, 3, 4, 5, 6] as s}
          <div class="step-dot" class:active={step === s} class:done={step > s}>
            {#if step > s}✓{:else}{s}{/if}
          </div>
          {#if s < 6}
            <div class="step-line" class:done={step > s}></div>
          {/if}
        {/each}
      </div>

      <!-- Step 1: Destination -->
      {#if step === 1}
        <div class="step-pane">
          <p class="section-label">Step 1 of 6</p>
          <h2 class="step-title">Where are you going?</h2>
          <p class="step-desc">Enter the city, region, or country for your upcoming journey.</p>

          <div class="input-group mt-6">
            <label for="destination">Destination Name</label>
            <input 
              id="destination"
              type="text" 
              class="input input-lg" 
              bind:value={destination} 
              placeholder="e.g. Goa, Manali, Bali, Singapore" 
            />
          </div>

          <div class="input-group mt-4">
            <label for="tripName">Trip Title (Optional)</label>
            <input 
              id="tripName"
              type="text" 
              class="input" 
              bind:value={name} 
              placeholder="e.g. Goa Beach Escape" 
            />
          </div>
        </div>
      {/if}

      <!-- Step 2: Dates -->
      {#if step === 2}
        <div class="step-pane">
          <p class="section-label">Step 2 of 6</p>
          <h2 class="step-title">When are you traveling?</h2>
          <p class="step-desc">Select your start and departure dates.</p>

          <div class="grid-2 gap-4 mt-6">
            <div class="input-group">
              <label for="startDate">Start Date</label>
              <input id="startDate" type="date" class="input" bind:value={startDate} />
            </div>
            <div class="input-group">
              <label for="endDate">End Date</label>
              <input id="endDate" type="date" class="input" bind:value={endDate} />
            </div>
          </div>
        </div>
      {/if}

      <!-- Step 3: Trip Type -->
      {#if step === 3}
        <div class="step-pane">
          <p class="section-label">Step 3 of 6</p>
          <h2 class="step-title">Who is traveling?</h2>
          <p class="step-desc">Decide if this is an independent exploration or group trip.</p>

          <div class="grid-2 gap-4 mt-6">
            <button 
              type="button"
              class="type-box card p-6 text-center" 
              class:selected={type === 'solo'}
              onclick={() => type = 'solo'}
            >
              <span class="text-4xl mb-2 block">🧍</span>
              <h4 class="text-forest font-bold mb-1">Solo Trip</h4>
              <p class="text-xs text-gray">Just for yourself</p>
            </button>

            <button 
              type="button"
              class="type-box card p-6 text-center" 
              class:selected={type === 'group'}
              onclick={() => type = 'group'}
            >
              <span class="text-4xl mb-2 block">👥</span>
              <h4 class="text-forest font-bold mb-1">Group Trip</h4>
              <p class="text-xs text-gray">With friends or family</p>
            </button>
          </div>

          {#if type === 'group'}
            <div class="input-group mt-6">
              <label for="travelers">Total Number of Travelers: <strong>{travelers}</strong></label>
              <input 
                id="travelers"
                type="range" 
                min="2" 
                max="20" 
                class="range-slider" 
                bind:value={travelers} 
              />
            </div>
          {/if}
        </div>
      {/if}

      <!-- Step 4: Budget -->
      {#if step === 4}
        <div class="step-pane">
          <p class="section-label">Step 4 of 6</p>
          <h2 class="step-title">Estimated Budget</h2>
          <p class="step-desc">Set an estimated overall budget for this trip in INR (₹).</p>

          <div class="budget-input-wrap mt-6">
            <span class="currency-symbol">₹</span>
            <input 
              type="number" 
              step="1000" 
              min="1000" 
              class="input budget-input" 
              bind:value={budget} 
            />
          </div>

          <div class="budget-preset-chips mt-4 flex gap-2 flex-wrap">
            {#each [15000, 25000, 50000, 100000] as preset}
              <button 
                class="chip" 
                class:active={budget === preset}
                onclick={() => budget = preset}
              >
                ₹{(preset / 1000).toFixed(0)}K
              </button>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Step 5: Interests -->
      {#if step === 5}
        <div class="step-pane">
          <p class="section-label">Step 5 of 6</p>
          <h2 class="step-title">What are you excited about?</h2>
          <p class="step-desc">Select the trip activities and vibe that matter most to you.</p>

          <div class="interests-grid mt-6">
            {#each allInterests as item}
              <button 
                class="chip chip-lg" 
                class:active={interests.includes(item.id)}
                onclick={() => toggleInterest(item.id)}
              >
                {item.label}
              </button>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Step 6: Confirmation Review -->
      {#if step === 6}
        <div class="step-pane">
          <p class="section-label">Final Step</p>
          <h2 class="step-title">Review & Create Trip</h2>
          <p class="step-desc">Check your trip details before launching your workspace.</p>

          <div class="review-box card p-5 mt-6">
            <div class="review-row">
              <span class="text-gray">Destination:</span>
              <strong class="text-forest">{destination}</strong>
            </div>
            <div class="review-row">
              <span class="text-gray">Dates:</span>
              <strong class="text-forest">{startDate} to {endDate}</strong>
            </div>
            <div class="review-row">
              <span class="text-gray">Travelers:</span>
              <strong class="text-forest">{type === 'solo' ? 'Solo (1 person)' : `Group (${travelers} travelers)`}</strong>
            </div>
            <div class="review-row">
              <span class="text-gray">Budget:</span>
              <strong class="text-terracotta">₹{budget.toLocaleString('en-IN')}</strong>
            </div>
            <div class="review-row">
              <span class="text-gray">Interests:</span>
              <strong class="text-forest">{interests.length} selected</strong>
            </div>
          </div>
        </div>
      {/if}

      <!-- Navigation Buttons -->
      <div class="flex items-center justify-between mt-8 pt-4 border-t">
        {#if step > 1}
          <button class="btn btn-cream" onclick={() => step--} disabled={loading}>
            ← Back
          </button>
        {:else}
          <div></div>
        {/if}

        {#if step < 6}
          <button 
            class="btn btn-primary" 
            disabled={step === 1 && !destination.trim()}
            onclick={() => step++}
          >
            Next Step →
          </button>
        {:else}
          <button class="btn btn-accent btn-lg" onclick={handleCreateTrip} disabled={loading}>
            {#if loading}
              Creating Trip...
            {:else}
              Create Trip Workspace ✦
            {/if}
          </button>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .step-title {
    font-size: 1.5rem;
    color: var(--forest);
    font-weight: 700;
  }

  .step-desc {
    color: var(--gray);
    font-size: 0.9rem;
  }

  .type-box {
    border: 2px solid var(--border);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .type-box:hover, .type-box.selected {
    border-color: var(--forest);
    background: var(--forest-10);
  }

  .range-slider {
    width: 100%;
    accent-color: var(--forest);
    margin-top: var(--sp-2);
  }

  .budget-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .currency-symbol {
    position: absolute;
    left: var(--sp-4);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--forest);
  }

  .budget-input {
    padding-left: 2.75rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--forest);
  }

  .interests-grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-2);
  }

  .chip-lg {
    padding: 0.5rem 1rem;
    font-size: 0.9375rem;
  }

  .review-box {
    background: var(--cream);
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }

  .review-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.9375rem;
  }

  .border-t {
    border-top: 1px solid var(--border);
  }

  .block { display: block; }
</style>
