<script lang="ts">
  import { goto } from '$app/navigation';
  import { userService } from '$lib/services/userService';
  import { currentUser, notifications } from '$lib/stores';

  let selected = $state<'solo' | 'group'>('group');

  function handleContinue() {
    userService.setTravelPreference(selected);
    currentUser.refresh();
    notifications.show('Preference saved! Enjoy your Travora journey.');
    goto('/home');
  }
</script>

<svelte:head>
  <title>Onboarding — Travora</title>
</svelte:head>

<div class="onboarding-page">
  <div class="container container-sm">
    <div class="onboarding-card card">
      <div class="logo-center">
        <span class="logo-leaf">✦</span>
        <span class="logo-text">Travora</span>
      </div>

      <div class="text-center mb-8">
        <p class="section-label">Personalize Your Experience</p>
        <h1 class="onboarding-title">How do you like to travel?</h1>
        <p class="onboarding-desc">
          Choose your primary travel vibe. You can plan both solo journeys and group adventures at any time.
        </p>
      </div>

      <div class="choice-grid">
        <!-- Solo Option -->
        <button 
          type="button"
          class="choice-card text-left" 
          class:active={selected === 'solo'}
          onclick={() => selected = 'solo'}
        >
          <div class="choice-icon">🧍</div>
          <div class="choice-info">
            <h3>Solo Travel</h3>
            <p>For independent explorers creating personal itineraries, self-discovery trips, and curated memories.</p>
          </div>
          <div class="radio-indicator">
            {#if selected === 'solo'}
              <div class="radio-dot"></div>
            {/if}
          </div>
        </button>

        <!-- Group Option -->
        <button 
          type="button"
          class="choice-card text-left" 
          class:active={selected === 'group'}
          onclick={() => selected = 'group'}
        >
          <div class="choice-icon">👥</div>
          <div class="choice-info">
            <h3>Group Travel</h3>
            <p>For adventures with friends & family. Collaborative planning, group chat, instant polls & expense splitting.</p>
          </div>
          <div class="radio-indicator">
            {#if selected === 'group'}
              <div class="radio-dot"></div>
            {/if}
          </div>
        </button>
      </div>

      <div class="mt-8 flex justify-center">
        <button class="btn btn-primary btn-lg w-full" onclick={handleContinue}>
          Continue to Discover
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .onboarding-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--cream);
    padding: var(--sp-8) var(--sp-4);
  }

  .onboarding-card {
    padding: var(--sp-10) var(--sp-8);
  }

  .logo-center {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--sp-2);
    margin-bottom: var(--sp-6);
  }

  .logo-leaf { color: var(--terracotta); font-size: 1.25rem; }
  .logo-text { font-family: var(--font-serif); font-size: 1.75rem; font-weight: 700; color: var(--forest); }

  .onboarding-title {
    font-size: 1.75rem;
    color: var(--forest);
    margin-bottom: var(--sp-2);
  }

  .onboarding-desc {
    color: var(--gray);
    font-size: 0.95rem;
  }

  .choice-grid {
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
  }

  .choice-card {
    display: flex;
    align-items: center;
    gap: var(--sp-4);
    padding: var(--sp-5);
    border-radius: var(--radius-lg);
    border: 2px solid var(--border-strong);
    background: var(--white);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .choice-card:hover {
    border-color: var(--forest);
    transform: translateY(-2px);
  }

  .choice-card.active {
    border-color: var(--forest);
    background: var(--forest-10);
  }

  .choice-icon {
    font-size: 2.25rem;
    flex-shrink: 0;
  }

  .choice-info {
    flex: 1;
  }

  .choice-info h3 {
    font-size: 1.125rem;
    color: var(--forest);
    margin-bottom: var(--sp-1);
  }

  .choice-info p {
    font-size: 0.85rem;
    color: var(--gray);
    line-height: 1.45;
  }

  .radio-indicator {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid var(--border-strong);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .choice-card.active .radio-indicator {
    border-color: var(--forest);
  }

  .radio-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--forest);
  }

  .w-full { width: 100%; }
</style>
