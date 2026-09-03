<script>
  import { page } from '$app/stores';
  import { tripService } from '$lib/services/tripService.js';
  import { currentUser, notifications } from '$lib/stores/index.js';
  import PollCard from '$lib/components/trip/PollCard.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';

  const tripId = $derived($page.params.id);

  let polls = $state([]);
  let showCreateModal = $state(false);

  let question = $state('');
  let optionsText = $state('Baga Beach Shack\nFort Aguada Sunset\nSpice Plantation');

  $effect(() => {
    if (tripId) {
      const unsub = tripService.subscribeToPolls(tripId, data => polls = data);
      return () => unsub();
    }
  });

  async function handleCreatePoll() {
    if (!question.trim()) return;
    const opts = optionsText
      .split('\n')
      .map(o => o.trim())
      .filter(Boolean)
      .map((text, idx) => ({ id: `opt_${idx}`, text, votes: [] }));

    if (opts.length < 2) {
      notifications.show('Provide at least 2 options for the poll.', 'error');
      return;
    }

    try {
      await tripService.createPoll(tripId, {
        question: question.trim(),
        options: opts,
        createdBy: $currentUser?.id || 'demo_user',
        createdByName: $currentUser?.name || 'Traveler'
      });

      notifications.show('Poll created! 📊');
      showCreateModal = false;
      question = '';
    } catch (err) {
      notifications.show(`Failed to create poll: ${err.message}`, 'error');
    }
  }

  async function handleVote(pollId, optionId) {
    if (!$currentUser) return;
    await tripService.votePoll(tripId, pollId, optionId, $currentUser.id);
    notifications.show('Vote recorded!');
  }
</script>

<svelte:head>
  <title>Group Polls — Travora</title>
</svelte:head>

<div class="polls-tab">
  <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
    <div>
      <h2 class="section-title">📊 Group Voting & Decisions</h2>
      <p class="text-xs text-gray">Resolve group destination choices, dining spots, and stay preferences easily.</p>
    </div>

    <button class="btn btn-primary" onclick={() => showCreateModal = true}>
      + Create New Poll
    </button>
  </div>

  {#if polls.length === 0}
    <div class="card p-10 text-center">
      <div class="text-4xl mb-2">📊</div>
      <h4 class="text-forest mb-1">No group polls active</h4>
      <p class="text-gray text-xs mb-4">Create a poll to decide itinerary activities or dinner choices together.</p>
      <button class="btn btn-primary btn-sm" onclick={() => showCreateModal = true}>
        + Create First Poll
      </button>
    </div>
  {:else}
    <div class="grid-2 gap-6">
      {#each polls as poll (poll.id)}
        <PollCard 
          {poll} 
          currentUserId={$currentUser?.id || ''}
          onvote={(optId) => handleVote(poll.id, optId)}
        />
      {/each}
    </div>
  {/if}

  {#if showCreateModal}
    <Modal title="Create Group Poll" onclose={() => showCreateModal = false}>
      <form class="flex-col gap-4" onsubmit={(e) => { e.preventDefault(); handleCreatePoll(); }}>
        <div class="input-group">
          <label for="pollQuestion">Poll Question</label>
          <input 
            id="pollQuestion"
            type="text" 
            class="input" 
            bind:value={question} 
            placeholder="e.g. Which beach shack for Friday dinner?" 
            required 
          />
        </div>

        <div class="input-group">
          <label for="pollOpts">Poll Options (One option per line)</label>
          <textarea 
            id="pollOpts"
            class="input" 
            rows="4" 
            bind:value={optionsText}
            required
          ></textarea>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button type="button" class="btn btn-cream" onclick={() => showCreateModal = false}>Cancel</button>
          <button type="submit" class="btn btn-primary">Launch Poll</button>
        </div>
      </form>
    </Modal>
  {/if}
</div>
