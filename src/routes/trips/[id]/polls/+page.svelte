<script lang="ts">
  import { page } from '$app/stores';
  import { tripService } from '$lib/services/tripService';
  import { currentUser, notifications } from '$lib/stores';
  import PollCard from '$lib/components/trip/PollCard.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import type { Poll } from '$lib/types';

  const tripId = $derived($page.params.id);
  
  let polls = $state<Poll[]>([]);
  let showCreateModal = $state(false);

  let question = $state('');
  let options = $state<string[]>(['', '']);

  function loadPolls() {
    if (tripId) {
      polls = tripService.getPolls(tripId);
    }
  }

  $effect(() => {
    loadPolls();
  });

  function handleVote(pollId: string, optionId: string) {
    const uid = $currentUser?.id || 'user_demo';
    tripService.vote(pollId, optionId, uid);
    notifications.show('Vote recorded!');
    loadPolls();
  }

  function addOption() {
    if (options.length < 6) {
      options = [...options, ''];
    }
  }

  function handleCreatePoll() {
    const validOptions = options.filter(o => o.trim().length > 0);
    if (!question.trim() || validOptions.length < 2) {
      notifications.show('Please provide a question and at least 2 options.', 'error');
      return;
    }

    tripService.createPoll({
      tripId,
      question: question.trim(),
      options: validOptions.map(text => ({
        id: 'opt_' + Math.random().toString(36).slice(2, 8),
        text: text.trim(),
        votes: []
      })),
      createdBy: $currentUser?.id || 'user_demo',
      createdByName: $currentUser?.name || 'Pavithra',
      createdAt: new Date().toISOString(),
      status: 'active',
      votedBy: []
    });

    notifications.show('Poll created!');
    question = '';
    options = ['', ''];
    showCreateModal = false;
    loadPolls();
  }
</script>

<svelte:head>
  <title>Group Polls — Travora</title>
</svelte:head>

<div class="polls-tab">
  <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
    <div>
      <h2 class="section-title">📊 Group Polls & Decision Hub</h2>
      <p class="text-xs text-gray">Create quick polls to decide restaurants, activities, and schedules democratically.</p>
    </div>

    <button class="btn btn-primary" onclick={() => showCreateModal = true}>
      + Create Poll
    </button>
  </div>

  {#if polls.length === 0}
    <div class="card p-12 text-center">
      <div class="text-4xl mb-2">🗳️</div>
      <h4 class="text-forest mb-1">No polls created yet</h4>
      <p class="text-gray text-xs mb-4">Start a poll to let your travel group vote on dining, activities, or meet times.</p>
      <button class="btn btn-primary btn-sm" onclick={() => showCreateModal = true}>
        + Create First Poll
      </button>
    </div>
  {:else}
    <div class="grid-2 gap-6">
      {#each polls as poll (poll.id)}
        <PollCard 
          {poll} 
          currentUserId={$currentUser?.id || 'user_demo'}
          onvote={handleVote}
        />
      {/each}
    </div>
  {/if}

  <!-- Create Poll Modal -->
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
            placeholder="e.g. Where should we have dinner tonight?" 
            required 
          />
        </div>

        <div class="input-group">
          <label for="option1">Poll Options</label>
          <div class="flex-col gap-2">
            {#each options as opt, i}
              <input 
                id={i === 0 ? "option1" : undefined}
                type="text" 
                class="input" 
                bind:value={options[i]} 
                placeholder="Option {i + 1}" 
                required 
              />
            {/each}
          </div>

          {#if options.length < 6}
            <button type="button" class="btn btn-ghost btn-sm text-forest self-start mt-2" onclick={addOption}>
              + Add Another Option
            </button>
          {/if}
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button type="button" class="btn btn-cream" onclick={() => showCreateModal = false}>
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            Publish Poll
          </button>
        </div>
      </form>
    </Modal>
  {/if}
</div>

<style>
  .self-start {
    align-self: flex-start;
  }
</style>
