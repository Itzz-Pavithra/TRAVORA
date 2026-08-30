<script lang="ts">
  import type { Expense } from '$lib/types';

  interface Props {
    expense: Expense;
    ondelete?: (id: string) => void;
  }

  let { expense, ondelete }: Props = $props();

  const categoryIcons: Record<string, string> = {
    petrol: '⛽',
    food: '🍽️',
    hotel: '🏨',
    transport: '🚕',
    activities: '🎟️',
    shopping: '🛍️',
    tickets: '🎫',
    other: '💳'
  };

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }
</script>

<div class="expense-card card">
  <div class="card-body flex items-center justify-between gap-4">
    <div class="flex items-center gap-4">
      <div class="cat-icon-wrap">
        <span class="cat-icon">{categoryIcons[expense.category] || '💳'}</span>
      </div>
      <div>
        <h4 class="expense-title">{expense.title}</h4>
        <div class="expense-meta">
          <span class="paid-by">Paid by <strong>{expense.paidByName}</strong></span>
          <span class="dot-sep">•</span>
          <span>{formatDate(expense.date)}</span>
          <span class="dot-sep">•</span>
          <span class="badge badge-cream text-xs">{expense.participants.length} split</span>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div class="text-right">
        <div class="expense-amount">₹{expense.amount.toLocaleString('en-IN')}</div>
        <div class="text-xs text-gray">₹{(expense.amount / expense.participants.length).toFixed(0)}/person</div>
      </div>
      {#if ondelete}
        <button 
          class="btn-icon text-gray" 
          onclick={() => ondelete?.(expense.id)}
          title="Delete expense"
          aria-label="Delete expense"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      {/if}
    </div>
  </div>
</div>

<style>
  .expense-card {
    transition: transform var(--transition-fast);
  }

  .expense-card:hover {
    transform: translateY(-1px);
  }

  .cat-icon-wrap {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-md);
    background: var(--cream);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.35rem;
    flex-shrink: 0;
  }

  .expense-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--forest);
    margin-bottom: 2px;
  }

  .expense-meta {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    font-size: 0.8125rem;
    color: var(--gray);
    flex-wrap: wrap;
  }

  .paid-by strong {
    color: var(--forest);
  }

  .dot-sep {
    color: var(--gray-light);
  }

  .expense-amount {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--forest);
  }
</style>
