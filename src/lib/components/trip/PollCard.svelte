<script lang="ts">
  import type { Poll } from '$lib/types';

  interface Props {
    poll: Poll;
    currentUserId?: string;
    onvote?: (pollId: string, optionId: string) => void;
  }

  let { poll, currentUserId = '', onvote }: Props = $props();

  const totalVotes = $derived(
    poll.options.reduce((sum, opt) => sum + opt.votes.length, 0)
  );

  const hasVoted = $derived(
    poll.votedBy.includes(currentUserId)
  );

  function getPercentage(votesCount: number) {
    if (totalVotes === 0) return 0;
    return Math.round((votesCount / totalVotes) * 100);
  }
</script>

<div class="poll-card card">
  <div class="card-body">
    <div class="flex items-center justify-between mb-2">
      <span class="badge {poll.status === 'active' ? 'badge-forest' : 'badge-gray'} text-xs">
        {poll.status === 'active' ? '● Active Poll' : 'Closed'}
      </span>
      <span class="text-xs text-gray">{totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}</span>
    </div>

    <h4 class="poll-question">{poll.question}</h4>
    <p class="poll-meta text-xs text-gray mb-4">Created by {poll.createdByName}</p>

    <div class="poll-options">
      {#each poll.options as option}
        {@const userVotedForThis = option.votes.includes(currentUserId)}
        {@const pct = getPercentage(option.votes.length)}
        
        <button
          class="poll-option-btn"
          class:selected={userVotedForThis}
          class:disabled={hasVoted || poll.status === 'closed'}
          disabled={hasVoted || poll.status === 'closed'}
          onclick={() => onvote?.(poll.id, option.id)}
        >
          <div class="poll-fill" style="width: {hasVoted || poll.status === 'closed' ? pct : 0}%"></div>
          <div class="poll-option-content">
            <span class="option-text">
              {#if userVotedForThis}✓ {/if}
              {option.text}
            </span>
            {#if hasVoted || poll.status === 'closed'}
              <span class="option-pct">{pct}% ({option.votes.length})</span>
            {/if}
          </div>
        </button>
      {/each}
    </div>

    {#if !hasVoted && poll.status === 'active'}
      <p class="text-xs text-center text-gray mt-3">Select an option to cast your vote</p>
    {/if}
  </div>
</div>

<style>
  .poll-card {
    border-left: 4px solid var(--terracotta);
  }

  .poll-question {
    font-size: 1.0625rem;
    font-weight: 700;
    color: var(--forest);
    margin-bottom: 2px;
  }

  .poll-options {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
  }

  .poll-option-btn {
    position: relative;
    width: 100%;
    text-align: left;
    background: var(--cream);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-md);
    padding: var(--sp-3) var(--sp-4);
    cursor: pointer;
    overflow: hidden;
    transition: all var(--transition-fast);
    font-family: inherit;
  }

  .poll-option-btn:not(.disabled):hover {
    border-color: var(--forest);
    background: var(--cream-dark);
  }

  .poll-option-btn.selected {
    border-color: var(--terracotta);
  }

  .poll-fill {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    background: rgba(217, 119, 69, 0.18);
    transition: width 0.5s ease;
    z-index: 1;
  }

  .poll-option-content {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--forest);
  }

  .option-pct {
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--terracotta);
  }
</style>
