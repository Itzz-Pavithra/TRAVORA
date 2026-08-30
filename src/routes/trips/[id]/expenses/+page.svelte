<script lang="ts">
  import { page } from '$app/stores';
  import { tripService } from '$lib/services/tripService';
  import { notifications } from '$lib/stores';
  import ExpenseCard from '$lib/components/cards/ExpenseCard.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import type { Expense, Settlement, TripMember } from '$lib/types';

  const tripId = $derived($page.params.id);
  
  let expenses = $state<Expense[]>([]);
  let members = $state<TripMember[]>([]);
  let settlements = $state<Settlement[]>([]);

  // Add Expense Modal
  let showModal = $state(false);
  let title = $state('');
  let amount = $state(0);
  let category = $state<Expense['category']>('food');
  let paidBy = $state('');
  let selectedParticipants = $state<string[]>([]);
  let expenseDate = $state(new Date().toISOString().split('T')[0]);
  let notes = $state('');

  function loadData() {
    if (tripId) {
      expenses = tripService.getExpenses(tripId);
      members = tripService.getMembers(tripId);
      settlements = tripService.calculateSettlement(tripId);
      
      if (members.length > 0 && !paidBy) {
        paidBy = members[0].userId;
        selectedParticipants = members.map(m => m.userId);
      }
    }
  }

  $effect(() => {
    loadData();
  });

  const totalSpent = $derived(
    expenses.reduce((sum, e) => sum + e.amount, 0)
  );

  // Breakdown by member
  const memberSpending = $derived(
    members.map(m => {
      const paidTotal = expenses
        .filter(e => e.paidBy === m.userId)
        .reduce((sum, e) => sum + e.amount, 0);
      
      const shareTotal = expenses
        .filter(e => e.participants.includes(m.userId))
        .reduce((sum, e) => sum + (e.amount / e.participants.length), 0);

      const net = paidTotal - shareTotal;
      return {
        ...m,
        paidTotal,
        shareTotal: Math.round(shareTotal),
        net: Math.round(net)
      };
    })
  );

  function openAddModal() {
    title = '';
    amount = 500;
    category = 'food';
    expenseDate = new Date().toISOString().split('T')[0];
    notes = '';
    if (members.length > 0) {
      paidBy = members[0].userId;
      selectedParticipants = members.map(m => m.userId);
    }
    showModal = true;
  }

  function handleSaveExpense() {
    if (!title.trim() || amount <= 0 || !paidBy || selectedParticipants.length === 0) {
      notifications.show('Please fill in all required fields.', 'error');
      return;
    }

    const payer = members.find(m => m.userId === paidBy);

    tripService.addExpense({
      tripId,
      title: title.trim(),
      amount,
      currency: 'INR',
      category,
      paidBy,
      paidByName: payer?.name || 'Member',
      participants: selectedParticipants,
      date: expenseDate,
      notes: notes.trim()
    });

    notifications.show('Expense recorded successfully!');
    showModal = false;
    loadData();
  }

  function handleDeleteExpense(id: string) {
    tripService.deleteExpense(id);
    notifications.show('Expense deleted.');
    loadData();
  }

  function toggleParticipant(uid: string) {
    if (selectedParticipants.includes(uid)) {
      if (selectedParticipants.length > 1) {
        selectedParticipants = selectedParticipants.filter(id => id !== uid);
      }
    } else {
      selectedParticipants = [...selectedParticipants, uid];
    }
  }
</script>

<svelte:head>
  <title>Travora Split — Expenses & Settlement</title>
</svelte:head>

<div class="expenses-tab">
  <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
    <div>
      <h2 class="section-title">💸 Travora Split & Expenses</h2>
      <p class="text-xs text-gray">Track individual spending, verify equal or custom splits, and view simplified debt settlements.</p>
    </div>

    <button class="btn btn-accent" onclick={openAddModal}>
      + Record Expense
    </button>
  </div>

  <!-- Summary Cards -->
  <div class="grid-3 mb-8">
    <div class="stat-card">
      <div class="stat-icon forest-bg">💰</div>
      <div>
        <span class="text-xs text-gray uppercase tracking-wider font-semibold">Total Trip Spending</span>
        <h3 class="text-forest font-bold font-serif text-2xl">₹{totalSpent.toLocaleString('en-IN')}</h3>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon terra-bg">👥</div>
      <div>
        <span class="text-xs text-gray uppercase tracking-wider font-semibold">Average Per Person</span>
        <h3 class="text-forest font-bold font-serif text-2xl">
          ₹{members.length > 0 ? (totalSpent / members.length).toFixed(0) : '0'}
        </h3>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon cream-bg">⚖️</div>
      <div>
        <span class="text-xs text-gray uppercase tracking-wider font-semibold">Settlements Pending</span>
        <h3 class="text-forest font-bold font-serif text-2xl">{settlements.length} Transfers</h3>
      </div>
    </div>
  </div>

  <div class="grid-3 gap-6">
    <!-- Transactions List (2 columns) -->
    <div class="transactions-col col-span-2">
      <h3 class="font-bold text-forest mb-4">Transaction History ({expenses.length})</h3>

      {#if expenses.length === 0}
        <div class="card p-10 text-center">
          <div class="text-4xl mb-2">💸</div>
          <h4 class="text-forest mb-1">No expenses recorded yet</h4>
          <p class="text-gray text-xs mb-4">Add petrol, food, hotel, or activity receipts to calculate splits automatically.</p>
          <button class="btn btn-primary btn-sm" onclick={openAddModal}>
            + Record First Expense
          </button>
        </div>
      {:else}
        <div class="flex-col gap-3">
          {#each expenses as expense (expense.id)}
            <ExpenseCard {expense} ondelete={handleDeleteExpense} />
          {/each}
        </div>
      {/if}
    </div>

    <!-- Settlement & Member Balances (1 column) -->
    <div class="settlements-col flex-col gap-6">
      <!-- Settlement Box -->
      <div class="card p-5">
        <h4 class="font-bold text-forest mb-3 flex items-center gap-2">
          <span>🤝</span> Simplified Settlement
        </h4>

        {#if settlements.length === 0}
          <p class="text-xs text-gray">All balances are settled! No payments needed.</p>
        {:else}
          <div class="settlement-list flex-col gap-2">
            {#each settlements as s}
              <div class="settlement-item card p-3">
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="text-gray font-semibold">{s.fromName}</span>
                  <span class="text-terracotta">owes</span>
                  <span class="text-forest font-bold">{s.toName}</span>
                </div>
                <div class="settlement-amount text-center">
                  ₹{s.amount.toLocaleString('en-IN')}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Member Balances -->
      <div class="card p-5">
        <h4 class="font-bold text-forest mb-3">Individual Contributions</h4>
        <div class="member-balances flex-col gap-3">
          {#each memberSpending as m}
            <div class="balance-row">
              <div class="flex items-center justify-between text-xs">
                <span class="font-semibold text-forest">{m.name}</span>
                <span class="badge {m.net >= 0 ? 'badge-forest' : 'badge-terracotta'}">
                  {m.net >= 0 ? `+₹${m.net}` : `-₹${Math.abs(m.net)}`}
                </span>
              </div>
              <div class="flex items-center justify-between text-xs text-gray mt-1">
                <span>Paid: ₹{m.paidTotal.toLocaleString('en-IN')}</span>
                <span>Share: ₹{m.shareTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <!-- Record Expense Modal -->
  {#if showModal}
    <Modal title="Record Group Expense" onclose={() => showModal = false}>
      <form class="flex-col gap-4" onsubmit={(e) => { e.preventDefault(); handleSaveExpense(); }}>
        <div class="input-group">
          <label for="expenseTitle">Expense Description</label>
          <input 
            id="expenseTitle"
            type="text" 
            class="input" 
            bind:value={title} 
            placeholder="e.g. Seafood Dinner at Britto's, Petrol, Hotel" 
            required 
          />
        </div>

        <div class="grid-2 gap-3">
          <div class="input-group">
            <label for="expenseAmount">Amount (₹)</label>
            <input 
              id="expenseAmount"
              type="number" 
              class="input" 
              bind:value={amount} 
              min="1" 
              required 
            />
          </div>

          <div class="input-group">
            <label for="expenseCategory">Category</label>
            <select id="expenseCategory" class="input" bind:value={category}>
              <option value="food">🍽️ Food & Dining</option>
              <option value="petrol">⛽ Petrol & Fuel</option>
              <option value="hotel">🏨 Hotel / Stay</option>
              <option value="transport">🚕 Cabs / Transport</option>
              <option value="activities">🎟️ Activities / Sports</option>
              <option value="tickets">🎫 Entry Tickets</option>
              <option value="shopping">🛍️ Shopping</option>
              <option value="other">💳 Other</option>
            </select>
          </div>
        </div>

        <div class="grid-2 gap-3">
          <div class="input-group">
            <label for="paidBy">Who Paid?</label>
            <select id="paidBy" class="input" bind:value={paidBy}>
              {#each members as m}
                <option value={m.userId}>{m.name}</option>
              {/each}
            </select>
          </div>

          <div class="input-group">
            <label for="expenseDate">Date</label>
            <input id="expenseDate" type="date" class="input" bind:value={expenseDate} required />
          </div>
        </div>

        <div class="input-group">
          <label for="splitMembers">Split Between (Select Participants)</label>
          <div id="splitMembers" class="flex gap-2 flex-wrap mt-1">
            {#each members as m}
              <button 
                type="button" 
                class="chip"
                class:active={selectedParticipants.includes(m.userId)}
                onclick={() => toggleParticipant(m.userId)}
              >
                {m.name}
              </button>
            {/each}
          </div>
          <span class="text-xs text-gray mt-1">
            ₹{amount > 0 && selectedParticipants.length > 0 ? (amount / selectedParticipants.length).toFixed(0) : 0} per person ({selectedParticipants.length} people)
          </span>
        </div>

        <div class="input-group">
          <label for="expenseNotes">Optional Note</label>
          <input 
            id="expenseNotes"
            type="text" 
            class="input" 
            bind:value={notes} 
            placeholder="e.g. Paid via UPI" 
          />
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button type="button" class="btn btn-cream" onclick={() => showModal = false}>
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            Record Expense
          </button>
        </div>
      </form>
    </Modal>
  {/if}
</div>

<style>
  .col-span-2 {
    grid-column: span 2;
  }

  .settlement-item {
    background: var(--cream);
    border: 1px solid var(--border);
  }

  .settlement-amount {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--terracotta);
  }

  .balance-row {
    padding: var(--sp-2) 0;
    border-bottom: 1px solid var(--border);
  }

  @media (max-width: 900px) {
    .col-span-2 { grid-column: span 1; }
    .grid-3 { grid-template-columns: 1fr; }
  }
</style>
