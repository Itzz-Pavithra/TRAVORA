<script lang="ts">
  interface Props {
    budget: number;
    spent: number;
    currency?: string;
  }

  let { budget, spent, currency = 'INR' }: Props = $props();

  const percentage = $derived(
    budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0
  );

  const remaining = $derived(Math.max(budget - spent, 0));
</script>

<div class="budget-card card">
  <div class="card-body">
    <div class="flex items-center justify-between mb-3">
      <div>
        <span class="text-xs text-gray uppercase tracking-wider font-semibold">Trip Budget</span>
        <h3 class="budget-main font-serif">₹{budget.toLocaleString('en-IN')}</h3>
      </div>
      <div class="budget-pct-badge badge {percentage > 90 ? 'badge-terracotta' : 'badge-forest'}">
        {percentage}% Spent
      </div>
    </div>

    <div class="progress-bar mb-4">
      <div class="progress-fill" style="width: {percentage}%"></div>
    </div>

    <div class="grid-2 gap-4">
      <div class="stat-mini">
        <span class="text-xs text-gray">Spent</span>
        <span class="font-bold text-forest text-sm">₹{spent.toLocaleString('en-IN')}</span>
      </div>
      <div class="stat-mini text-right">
        <span class="text-xs text-gray">Remaining</span>
        <span class="font-bold text-terracotta text-sm">₹{remaining.toLocaleString('en-IN')}</span>
      </div>
    </div>
  </div>
</div>

<style>
  .budget-main {
    font-size: 1.5rem;
    color: var(--forest);
    font-weight: 700;
  }

  .budget-pct-badge {
    font-size: 0.8125rem;
    padding: 4px 10px;
  }

  .stat-mini {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
</style>
