<script>
  let { expense, currentUserId = '', ondelete } = $props();

  const iconMap = {
    food: '🍲',
    stay: '🏨',
    transport: '🚕',
    activity: '🎟️',
    shopping: '🛍️',
    other: '📦'
  };
</script>

<div class="expense-card card p-4 flex items-center justify-between">
  <div class="flex items-center gap-3">
    <span class="text-2xl">{iconMap[expense.category] || '💸'}</span>
    <div>
      <h4 class="text-forest font-bold text-base">{expense.title}</h4>
      <p class="text-xs text-gray">
        Paid by <strong>{expense.paidByName}</strong> • Split among {expense.participants?.length || 1} members
      </p>
    </div>
  </div>

  <div class="flex items-center gap-4">
    <strong class="text-terracotta text-lg">₹{expense.amount?.toLocaleString('en-IN')}</strong>
    {#if ondelete}
      <button class="btn-icon text-gray" onclick={() => ondelete?.(expense.id)} title="Delete expense">
        ✕
      </button>
    {/if}
  </div>
</div>

<style>
  .expense-card {
    background: var(--white);
  }
</style>
