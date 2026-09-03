<script>
  import { goto } from '$app/navigation';
  import { currentUser, notifications } from '$lib/stores/index.js';
  import { userService } from '$lib/services/userService.js';

  let selectedPref = $state('group');
  let selectedCurrency = $state('INR');
  let loading = $state(false);

  async function handleComplete() {
    if (!$currentUser) return;
    loading = true;
    try {
      await userService.updateUser($currentUser.id, {
        travelPreference: selectedPref,
        currency: selectedCurrency
      });
      notifications.show('Preferences saved! Let\'s plan your first trip.');
      goto('/home');
    } catch (err) {
      notifications.show(`Error: ${err.message}`, 'error');
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Welcome to Travora</title>
</svelte:head>

<div class="page-with-nav onboarding-page">
  <div class="container container-sm py-12">
    <div class="card p-8 text-center">
      <span class="badge badge-forest text-xs mb-2">Welcome Aboard</span>
      <h1 class="text-3xl font-bold text-forest mb-2">Customize Your Journey</h1>
      <p class="text-gray text-sm mb-8">How do you usually like to travel?</p>

      <div class="grid-2 gap-4 mb-8">
        <button 
          class="card p-6 text-center pref-box" 
          class:selected={selectedPref === 'group'}
          onclick={() => selectedPref = 'group'}
        >
          <span class="text-4xl mb-2 block">👥</span>
          <h4 class="text-forest font-bold mb-1">Group Travel</h4>
          <p class="text-xs text-gray">With friends, family, or travel crews</p>
        </button>

        <button 
          class="card p-6 text-center pref-box" 
          class:selected={selectedPref === 'solo'}
          onclick={() => selectedPref = 'solo'}
        >
          <span class="text-4xl mb-2 block">🧍</span>
          <h4 class="text-forest font-bold mb-1">Solo Travel</h4>
          <p class="text-xs text-gray">Independent backpacker & explorer</p>
        </button>
      </div>

      <div class="input-group max-w-xs mx-auto mb-8">
        <label for="prefCurr">Display Currency</label>
        <select id="prefCurr" class="input" bind:value={selectedCurrency}>
          <option value="INR">₹ INR (Indian Rupee)</option>
          <option value="USD">$ USD (US Dollar)</option>
          <option value="EUR">€ EUR (Euro)</option>
        </select>
      </div>

      <button class="btn btn-accent btn-lg w-full" onclick={handleComplete} disabled={loading}>
        Continue to Workspace →
      </button>
    </div>
  </div>
</div>

<style>
  .pref-box {
    border: 2px solid var(--border);
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  .pref-box:hover, .pref-box.selected {
    border-color: var(--forest);
    background: var(--forest-10);
  }
  .max-w-xs { max-width: 20rem; }
  .mx-auto { margin-left: auto; margin-right: auto; }
  .w-full { width: 100%; }
  .block { display: block; }
</style>
