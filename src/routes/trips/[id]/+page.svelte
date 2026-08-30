<script lang="ts">
  import { page } from '$app/stores';
  import { tripService } from '$lib/services/tripService';
  import { currentUser } from '$lib/stores';
  import MemberAvatar from '$lib/components/trip/MemberAvatar.svelte';
  import BudgetCard from '$lib/components/trip/BudgetCard.svelte';
  import type { Trip, TripMember, ItineraryDay, Expense, Message } from '$lib/types';

  const tripId = $derived($page.params.id);
  
  let trip = $state<Trip | null>(null);
  let members = $state<TripMember[]>([]);
  let itinerary = $state<ItineraryDay[]>([]);
  let expenses = $state<Expense[]>([]);
  let messages = $state<Message[]>([]);

  $effect(() => {
    if (tripId) {
      trip = tripService.getById(tripId);
      members = tripService.getMembers(tripId);
      itinerary = tripService.getItinerary(tripId);
      expenses = tripService.getExpenses(tripId);
      messages = tripService.getMessages(tripId);
    }
  });

  const totalSpent = $derived(
    expenses.reduce((sum, e) => sum + e.amount, 0)
  );

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
</script>

<svelte:head>
  <title>{trip?.name || 'Trip Overview'} — Travora</title>
</svelte:head>

{#if trip}
  <div class="trip-overview">
    <!-- Trip Banner -->
    <div class="overview-banner card mb-6">
      <div class="banner-overlay"></div>
      <div class="banner-content">
        <span class="badge badge-cream text-xs mb-2">{trip.status.toUpperCase()}</span>
        <h1 class="banner-title display-serif">{trip.name}</h1>
        <p class="banner-meta">
          📍 {trip.destination}, {trip.country} • 📅 {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
        </p>
      </div>
    </div>

    <!-- Quick Stats Grid -->
    <div class="grid-4 mb-6">
      <div class="stat-card">
        <div class="stat-icon forest-bg">👥</div>
        <div>
          <span class="text-xs text-gray uppercase tracking-wider font-semibold">Travelers</span>
          <h4 class="text-forest font-bold">{trip.travelers} Members</h4>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon terra-bg">📅</div>
        <div>
          <span class="text-xs text-gray uppercase tracking-wider font-semibold">Days Planned</span>
          <h4 class="text-forest font-bold">{itinerary.length} Days</h4>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon forest-bg">💸</div>
        <div>
          <span class="text-xs text-gray uppercase tracking-wider font-semibold">Expenses</span>
          <h4 class="text-forest font-bold">{expenses.length} Records</h4>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon cream-bg">💬</div>
        <div>
          <span class="text-xs text-gray uppercase tracking-wider font-semibold">Messages</span>
          <h4 class="text-forest font-bold">{messages.length} Chats</h4>
        </div>
      </div>
    </div>

    <div class="grid-2 gap-6">
      <!-- Left Column: Budget & Itinerary Snapshot -->
      <div class="flex-col gap-6">
        <BudgetCard budget={trip.budget} spent={totalSpent} />

        <div class="card p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-forest">Itinerary Snapshot</h3>
            <a href="/trips/{trip.id}/itinerary" class="btn btn-ghost btn-sm">Full Itinerary →</a>
          </div>

          {#if itinerary.length === 0}
            <p class="text-xs text-gray">No itinerary days created yet.</p>
          {:else}
            <div class="itinerary-snippet-list">
              {#each itinerary.slice(0, 3) as day}
                <div class="day-snippet-row">
                  <span class="badge badge-forest text-xs">Day {day.dayNumber}</span>
                  <div class="flex-1">
                    <strong class="text-sm text-forest">{day.title}</strong>
                    <span class="text-xs text-gray block">{day.items.length} scheduled items</span>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>

      <!-- Right Column: Members & Quick Actions -->
      <div class="flex-col gap-6">
        <!-- Members Card -->
        <div class="card p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-forest">Trip Members ({members.length})</h3>
            <a href="/trips/{trip.id}/friends" class="btn btn-ghost btn-sm">+ Invite →</a>
          </div>

          <div class="members-avatar-list">
            {#each members as member}
              <div class="member-chip-item">
                <MemberAvatar 
                  name={member.name} 
                  avatarColor={member.avatarColor} 
                  size="sm" 
                  showName={true} 
                  subtitle={member.role === 'owner' ? 'Trip Owner' : 'Member'}
                />
              </div>
            {/each}
          </div>
        </div>

        <!-- Quick Links Hub -->
        <div class="card p-6">
          <h3 class="font-bold text-forest mb-4">Explore Workspace Tools</h3>
          <div class="grid-2 gap-3">
            <a href="/trips/{trip.id}/expenses" class="tool-shortcut card p-3">
              <span>💸</span>
              <div>
                <strong>Split Expenses</strong>
                <p class="text-xs text-gray">Who owes what</p>
              </div>
            </a>

            <a href="/trips/{trip.id}/chat" class="tool-shortcut card p-3">
              <span>💬</span>
              <div>
                <strong>Trip Chat</strong>
                <p class="text-xs text-gray">Real-time messaging</p>
              </div>
            </a>

            <a href="/trips/{trip.id}/polls" class="tool-shortcut card p-3">
              <span>📊</span>
              <div>
                <strong>Group Polls</strong>
                <p class="text-xs text-gray">Vote together</p>
              </div>
            </a>

            <a href="/trips/{trip.id}/memories" class="tool-shortcut card p-3">
              <span>📸</span>
              <div>
                <strong>Trip Memories</strong>
                <p class="text-xs text-gray">Shared gallery</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .overview-banner {
    background: linear-gradient(135deg, var(--forest) 0%, var(--forest-light) 100%);
    padding: var(--sp-8);
    position: relative;
    overflow: hidden;
    color: var(--white);
  }

  .banner-title {
    font-size: 2rem;
    color: var(--white);
    margin-bottom: var(--sp-1);
  }

  .banner-meta {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9375rem;
  }

  .itinerary-snippet-list {
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }

  .day-snippet-row {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    padding: var(--sp-3);
    background: var(--cream);
    border-radius: var(--radius-md);
  }

  .members-avatar-list {
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }

  .member-chip-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--sp-2) 0;
    border-bottom: 1px solid var(--border);
  }

  .tool-shortcut {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    background: var(--cream);
    text-decoration: none;
    transition: all var(--transition-fast);
  }

  .tool-shortcut:hover {
    background: var(--cream-dark);
    transform: translateY(-2px);
  }

  .tool-shortcut span {
    font-size: 1.5rem;
  }

  .tool-shortcut strong {
    font-size: 0.875rem;
    color: var(--forest);
    display: block;
  }
</style>
