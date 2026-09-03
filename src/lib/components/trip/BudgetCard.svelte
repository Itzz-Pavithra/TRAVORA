<script>
  let { budget = 0, spent = 0, currency = 'INR' } = $props();

  const remaining = $derived(budget - spent);
  const percentage = $derived(budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0);
</script>

<div class="budget-card card p-6">
  <div class="flex items-center justify-between mb-2">
    <h3 class="font-bold text-forest">Trip Budget Tracker</h3>
    <span class="badge" class:badge-forest={remaining >= 0} class:badge-terracotta={remaining < 0}>
      {percentage}% Used
    </span>
  </div>

  <div class="grid-3 gap-3 my-4">
    <div>
      <span class="text-xs text-gray uppercase block font-semibold">Total Budget</span>
      <strong class="text-forest text-lg">₹{budget.toLocaleString('en-IN')}</strong>
    </div>

    <div>
      <span class="text-xs text-gray uppercase block font-semibold">Spent</span>
      <strong class="text-terracotta text-lg">₹{spent.toLocaleString('en-IN')}</strong>
    </div>

    <div>
      <span class="text-xs text-gray uppercase block font-semibold">Remaining</span>
      <strong class="text-forest text-lg" class:text-terracotta={remaining < 0}>₹{remaining.toLocaleString('en-IN')}</strong>
    </div>
  </div>

  <div class="progress-bar-wrap">
    <div class="progress-bar-fill" style="width: {percentage}%" class:over-budget={remaining < 0}></div>
  </div>
</div>

<style>
  .budget-card {
    background: var(--white);
  }

  .progress-bar-wrap {
    height: 8px;
    background: var(--cream);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    background: var(--forest);
    transition: width 0.4s ease;
  }

  .progress-bar-fill.over-budget {
    background: var(--terracotta);
  }

  .block { display: block; }
</style>
