<script>
  let { poll, currentUserId = '', onvote } = $props();

  const totalVotes = $derived(
    poll.options.reduce((sum, opt) => sum + (opt.votes?.length || 0), 0)
  );

  const hasVoted = $derived(
    poll.votedBy?.includes(currentUserId)
  );
</script>

<div class="poll-card card p-6">
  <div class="flex items-center justify-between mb-2">
    <span class="badge badge-forest text-xs">POLL</span>
    <span class="text-xs text-gray">{totalVotes} Total Votes</span>
  </div>

  <h3 class="poll-question text-forest font-bold text-lg mb-4">{poll.question}</h3>

  <div class="poll-options flex-col gap-3">
    {#each poll.options as opt (opt.id)}
      {@const votesCount = opt.votes?.length || 0}
      {@const percentage = totalVotes > 0 ? Math.round((votesCount / totalVotes) * 100) : 0}
      {@const isMyVote = opt.votes?.includes(currentUserId)}

      <button 
        class="poll-option-btn" 
        class:voted={isMyVote}
        disabled={hasVoted || poll.status === 'closed'}
        onclick={() => onvote?.(opt.id)}
      >
        <div class="poll-option-fill" style="width: {percentage}%"></div>
        <div class="poll-option-content flex items-center justify-between">
          <span class="option-text font-semibold">{opt.text} {isMyVote ? '✓' : ''}</span>
          <span class="option-stats text-xs">{votesCount} votes ({percentage}%)</span>
        </div>
      </button>
    {/each}
  </div>

  <div class="poll-footer mt-4 pt-3 border-t text-xs text-gray flex justify-between">
    <span>Created by {poll.createdByName || 'Member'}</span>
    <span>{hasVoted ? 'You have voted' : 'Tap option to vote'}</span>
  </div>
</div>

<style>
  .poll-option-btn {
    position: relative;
    width: 100%;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--white);
    padding: var(--sp-3) var(--sp-4);
    cursor: pointer;
    overflow: hidden;
    text-align: left;
    transition: border-color var(--transition-fast);
  }

  .poll-option-btn:hover:not(:disabled) {
    border-color: var(--forest);
  }

  .poll-option-btn.voted {
    border-color: var(--forest);
  }

  .poll-option-fill {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    background: var(--forest-10);
    transition: width 0.4s ease;
  }

  .poll-option-content {
    position: relative;
    z-index: 1;
  }

  .border-t { border-top: 1px solid var(--border); }
</style>
