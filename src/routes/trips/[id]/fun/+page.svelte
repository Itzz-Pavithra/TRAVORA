<script>
  import { page } from '$app/stores';
  import { tripService } from '$lib/services/tripService.js';
  import { currentUser, notifications } from '$lib/stores/index.js';

  const tripId = $derived($page.params.id);

  let challenges = $state([]);
  let activeTab = $state('challenges');

  const defaultQuests = [
    { id: 'q1', text: '📸 Take a group photo during sunset' },
    { id: 'q2', text: '🍲 Try an authentic local specialty dish' },
    { id: 'q3', text: '🏖️ Collect a unique sea shell or souvenir' },
    { id: 'q4', text: '💃 Dance at a beach shack or local lounge' },
    { id: 'q5', text: '🌊 Go in the ocean/water before noon' }
  ];

  $effect(() => {
    if (tripId) {
      tripService.getChallenges(tripId).then(data => challenges = data);
    }
  });

  function isCompleted(questId) {
    const ch = challenges.find(c => c.id === questId);
    return ch && $currentUser ? ch.completedBy?.includes($currentUser.id) : false;
  }

  async function handleToggle(questId, text) {
    if (!$currentUser) return;
    await tripService.toggleChallenge(tripId, questId, text, $currentUser.id);
    challenges = await tripService.getChallenges(tripId);
    notifications.show('Challenge updated! 🎮');
  }
</script>

<svelte:head>
  <title>Travel Fun & Challenges — Travora</title>
</svelte:head>

<div class="fun-tab">
  <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
    <div>
      <h2 class="section-title">🎮 Travel Fun & Group Quests</h2>
      <p class="text-xs text-gray">Interactive mini-challenges, photo scavenger hunts, and destination trivia.</p>
    </div>
  </div>

  <div class="tab-nav mb-6">
    <button 
      class="tab-item" 
      class:active={activeTab === 'challenges'}
      onclick={() => activeTab = 'challenges'}
    >
      🏆 Trip Quests ({defaultQuests.length})
    </button>
    <button 
      class="tab-item" 
      class:active={activeTab === 'quiz'}
      onclick={() => activeTab = 'quiz'}
    >
      🧩 Destination Quiz
    </button>
  </div>

  {#if activeTab === 'challenges'}
    <div class="card p-6">
      <h3 class="font-bold text-forest mb-4">Goa Beach Group Quests</h3>
      <div class="flex-col gap-3">
        {#each defaultQuests as q}
          <div class="quest-row card p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <input 
                type="checkbox" 
                class="quest-checkbox" 
                checked={isCompleted(q.id)} 
                onchange={() => handleToggle(q.id, q.text)}
              />
              <span class="text-sm font-semibold text-forest" class:done={isCompleted(q.id)}>{q.text}</span>
            </div>

            <span class="badge" class:badge-forest={isCompleted(q.id)} class:badge-cream={!isCompleted(q.id)}>
              {isCompleted(q.id) ? 'Completed ✨' : 'Pending'}
            </span>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if activeTab === 'quiz'}
    <div class="card p-8 text-center max-w-xl mx-auto">
      <div class="text-4xl mb-3">🌴</div>
      <h3 class="font-bold text-forest mb-2">Destination Trivia: Goa</h3>
      <p class="text-gray text-sm mb-4">What was the primary European power that ruled Goa for over 450 years?</p>

      <div class="grid-2 gap-3 max-w-md mx-auto">
        <button class="btn btn-cream" onclick={() => notifications.show('Incorrect! Try again.', 'error')}>
          British Empire
        </button>
        <button class="btn btn-primary" onclick={() => notifications.show('Correct! Portugal ruled Goa until 1961. 🎉')}>
          Portuguese Empire
        </button>
        <button class="btn btn-cream" onclick={() => notifications.show('Incorrect! Try again.', 'error')}>
          Dutch East India
        </button>
        <button class="btn btn-cream" onclick={() => notifications.show('Incorrect! Try again.', 'error')}>
          French Republic
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .quest-checkbox {
    width: 20px;
    height: 20px;
    accent-color: var(--forest);
    cursor: pointer;
  }
  .done {
    text-decoration: line-through;
    opacity: 0.6;
  }
  .quest-row {
    background: var(--cream);
    border: 1px solid var(--border);
  }
  .max-w-xl { max-width: 36rem; }
  .max-w-md { max-width: 28rem; }
  .mx-auto { margin-left: auto; margin-right: auto; }
</style>
