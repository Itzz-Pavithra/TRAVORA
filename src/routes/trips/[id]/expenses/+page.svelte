<script>
  import { page } from '$app/stores';
  import { tripService } from '$lib/services/tripService.js';
  import { currentUser, notifications } from '$lib/stores/index.js';
  import ExpenseCard from '$lib/components/cards/ExpenseCard.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';

  const tripId = $derived($page.params.id);

  let expenses = $state([]);
  let members = $state([]);
  let activeTab = $state('list');
  let showAddModal = $state(false);
  let loading = $state(false);

  // Form State
  let title = $state('');
  let amount = $state(1500);
  let category = $state('food');
  let paidBy = $state('');
  let participants = $state([]);

  $effect(() => {
    if (tripId) {
      const unsubExp = tripService.subscribeToExpenses(tripId, data => expenses = data);
      const unsubMem = tripService.subscribeToMembers(tripId, data => {
        members = data;
        if (members.length > 0 && !paidBy) {
          paidBy = members[0].userId;
          participants = members.map(m => m.userId);
        }
      });

      return () => {
        unsubExp();
        unsubMem();
      };
    }
  });

  const totalExpenses = $derived(
    expenses.reduce((sum, e) => sum + e.amount, 0)
  );

  const settlements = $derived(
    tripService.calculateSettlement(expenses, members)
  );

  function toggleParticipant(userId) {
    if (participants.includes(userId)) {
      participants = participants.filter(id => id !== userId);
    } else {
      participants = [...participants, userId];
    }
  }

  async function handleAddExpense() {
    if (!title.trim() || !amount || !paidBy) {
      notifications.show('Please fill in title, amount, and payer.', 'error');
      return;
    }
    if (participants.length === 0) {
      notifications.show('Select at least one participant to split.', 'error');
      return;
    }

    loading = true;
    const paidByMember = members.find(m => m.userId === paidBy);

    try {
      await tripService.addExpense(tripId, {
        title: title.trim(),
        amount,
        currency: 'INR',
        category,
        paidBy,
        paidByName: paidByMember?.name || 'Member',
        participants,
        date: new Date().toISOString().split('T')[0]
      });

      notifications.show(`Added expense "${title}"! 💸`);
      showAddModal = false;
      title = '';
      amount = 1500;
    } catch (err) {
      notifications.show(`Failed to add expense: ${err.message}`, 'error');
    } finally {
      loading = false;
    }
  }

  async function handleDelete(expId) {
    await tripService.deleteExpense(tripId, expId);
    notifications.show('Expense deleted.');
  }
</script>

<svelte:head>
  <title>Expenses & Travora Split — Travora</title>
</svelte:head>

<div class="expenses-tab">
  <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
    <div>
      <h2 class="section-title">💸 Expenses & Travora Split</h2>
      <p class="text-xs text-gray">Track trip spending and automate bilateral debt settlements.</p>
    </div>

    <button class="btn btn-accent" onclick={() => showAddModal = true}>
      + Record Expense
    </button>
  </div>

  <div class="grid-3 mb-6">
    <div class="stat-card">
      <div class="stat-icon forest-bg">💸</div>
      <div>
        <span class="text-xs text-gray uppercase font-semibold">Total Trip Spent</span>
        <h3 class="text-forest font-bold">₹{totalExpenses.toLocaleString('en-IN')}</h3>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon terra-bg">📊</div>
      <div>
        <span class="text-xs text-gray uppercase font-semibold">Active Expenses</span>
        <h3 class="text-forest font-bold">{expenses.length} Records</h3>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon cream-bg">🤝</div>
      <div>
        <span class="text-xs text-gray uppercase font-semibold">Settlements Needed</span>
        <h3 class="text-forest font-bold">{settlements.length} Transfers</h3>
      </div>
    </div>
  </div>

  <!-- View Switcher -->
  <div class="tab-nav mb-6">
    <button 
      class="tab-item" 
      class:active={activeTab === 'list'}
      onclick={() => activeTab = 'list'}
    >
      <span class="tab-icon">📋</span>
      Expense Log ({expenses.length})
    </button>

    <button 
      class="tab-item" 
      class:active={activeTab === 'settlement'}
      onclick={() => activeTab = 'settlement'}
    >
      <span class="tab-icon">🤝</span>
      Settlement Recommendations ({settlements.length})
    </button>
  </div>

  {#if activeTab === 'list'}
    {#if expenses.length === 0}
      <div class="card p-10 text-center">
        <div class="text-4xl mb-2">🧾</div>
        <h4 class="text-forest mb-1">No expenses recorded yet</h4>
        <p class="text-gray text-xs mb-4">Add your meals, stays, rides, or ticket costs to start splitting.</p>
        <button class="btn btn-primary btn-sm" onclick={() => showAddModal = true}>
          + Record First Expense
        </button>
      </div>
    {:else}
      <div class="flex-col gap-4">
        {#each expenses as exp (exp.id)}
          <ExpenseCard 
            expense={exp} 
            currentUserId={$currentUser?.id || ''}
            ondelete={() => handleDelete(exp.id)}
          />
        {/each}
      </div>
    {/if}
  {/if}

  {#if activeTab === 'settlement'}
    <div class="settlements-container card p-6">
      <h3 class="font-bold text-forest mb-2">Optimal Travora Split Transfers</h3>
      <p class="text-xs text-gray mb-6">Mathematically calculated minimal payments required to balance everyone's debt.</p>

      {#if settlements.length === 0}
        <div class="text-center p-8">
          <span class="text-3xl mb-2 block">🎉</span>
          <p class="text-forest font-bold">All settled up!</p>
          <p class="text-xs text-gray">Nobody owes anything right now.</p>
        </div>
      {:else}
        <div class="settlement-list flex-col gap-4">
          {#each settlements as s}
            <div class="settlement-card card p-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="avatar avatar-md forest-bg text-white">
                  {s.fromName[0].toUpperCase()}
                </div>
                <div>
                  <strong class="text-forest text-sm">{s.fromName}</strong>
                  <span class="text-xs text-gray block">owes {s.toName}</span>
                </div>
              </div>

              <div class="text-right">
                <span class="text-lg font-bold text-terracotta">₹{s.amount.toLocaleString('en-IN')}</span>
                <span class="badge badge-forest text-xs block mt-1">Settle Up</span>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  {#if showAddModal}
    <Modal title="Record Expense" onclose={() => showAddModal = false}>
      <form class="flex-col gap-4" onsubmit={(e) => { e.preventDefault(); handleAddExpense(); }}>
        <div class="input-group">
          <label for="expTitle">Expense Description</label>
          <input 
            id="expTitle"
            type="text" 
            class="input" 
            bind:value={title} 
            placeholder="e.g. Dinner at Shack, Airport Taxi, Villa Booking" 
            required 
          />
        </div>

        <div class="grid-2 gap-3">
          <div class="input-group">
            <label for="expAmount">Amount (₹)</label>
            <input id="expAmount" type="number" class="input" bind:value={amount} min="1" required />
          </div>

          <div class="input-group">
            <label for="expCategory">Category</label>
            <select id="expCategory" class="input" bind:value={category}>
              <option value="food">🍲 Food & Dining</option>
              <option value="stay">🏨 Accommodation</option>
              <option value="transport">🚕 Transport</option>
              <option value="activity">🎟️ Activity & Tickets</option>
              <option value="shopping">🛍️ Shopping</option>
              <option value="other">📦 Other</option>
            </select>
          </div>
        </div>

        <div class="input-group">
          <label for="expPayer">Paid By</label>
          <select id="expPayer" class="input" bind:value={paidBy}>
            {#each members as m}
              <option value={m.userId}>{m.name} {m.userId === $currentUser?.id ? '(You)' : ''}</option>
            {/each}
          </select>
        </div>

        <div class="input-group">
          <label for="expParticipants">Split Equally Among</label>
          <div class="participants-list flex gap-2 flex-wrap mt-1">
            {#each members as m}
              <button 
                type="button"
                class="chip" 
                class:active={participants.includes(m.userId)}
                onclick={() => toggleParticipant(m.userId)}
              >
                {m.name}
              </button>
            {/each}
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button type="button" class="btn btn-cream" onclick={() => showAddModal = false} disabled={loading}>
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" disabled={loading}>
            Save Expense
          </button>
        </div>
      </form>
    </Modal>
  {/if}
</div>

<style>
  .settlement-card {
    background: var(--cream);
    border: 1px solid var(--border);
  }
  .block { display: block; }
</style>
