<script lang="ts">
  import { goto } from '$app/navigation';
  import { currentUser, notifications } from '$lib/stores';
  import { userService } from '$lib/services/userService';
  import { storage } from '$lib/services/storage';

  let name = $state($currentUser?.name || 'Pavithra');
  let email = $state($currentUser?.email || 'pavithra@travora.app');
  let preference = $state<'solo' | 'group'>($currentUser?.travelPreference || 'group');
  let currency = $state('INR');
  let language = $state('en');
  let profileVisibility = $state<'public' | 'friends' | 'private'>('public');

  function handleSaveProfile() {
    userService.updateCurrentUser({
      name: name.trim(),
      email: email.trim(),
      travelPreference: preference,
      currency,
      language,
      profileVisibility
    });
    currentUser.refresh();
    notifications.show('Settings updated successfully!');
  }

  function handleLogout() {
    currentUser.logout();
    notifications.show('Logged out from Travora.');
    goto('/');
  }

  function handleResetDemoData() {
    storage.clearAll();
    window.location.href = '/';
  }
</script>

<svelte:head>
  <title>Settings — Travora</title>
</svelte:head>

<div class="page-with-nav settings-page">
  <div class="container container-md py-8">
    <div class="settings-header mb-8">
      <p class="section-label">Account & Preferences</p>
      <h1 class="section-title">Settings</h1>
      <p class="section-desc">Manage profile details, trip defaults, privacy controls, and local storage.</p>
    </div>

    <form class="flex-col gap-6" onsubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
      <!-- Account Info Section -->
      <div class="card p-6">
        <h3 class="font-bold text-forest mb-4">Account Information</h3>
        
        <div class="grid-2 gap-4 mb-4">
          <div class="input-group">
            <label for="profileName">Full Name</label>
            <input id="profileName" type="text" class="input" bind:value={name} required />
          </div>

          <div class="input-group">
            <label for="profileEmail">Email Address</label>
            <input id="profileEmail" type="email" class="input" bind:value={email} required />
          </div>
        </div>
      </div>

      <!-- Travel Preferences Section -->
      <div class="card p-6">
        <h3 class="font-bold text-forest mb-4">Travel Preferences</h3>

        <div class="grid-3 gap-4 mb-4">
          <div class="input-group">
            <label for="prefType">Default Trip Mode</label>
            <select id="prefType" class="input" bind:value={preference}>
              <option value="group">👥 Group Travel</option>
              <option value="solo">🧍 Solo Travel</option>
            </select>
          </div>

          <div class="input-group">
            <label for="prefCurrency">Display Currency</label>
            <select id="prefCurrency" class="input" bind:value={currency}>
              <option value="INR">₹ INR (Indian Rupee)</option>
              <option value="USD">$ USD (US Dollar)</option>
              <option value="EUR">€ EUR (Euro)</option>
              <option value="GBP">£ GBP (British Pound)</option>
            </select>
          </div>

          <div class="input-group">
            <label for="prefLanguage">Language</label>
            <select id="prefLanguage" class="input" bind:value={language}>
              <option value="en">English (US/UK)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Privacy & Permissions -->
      <div class="card p-6">
        <h3 class="font-bold text-forest mb-4">Privacy & Permissions</h3>
        
        <div class="input-group max-w-sm">
          <label for="prefVisibility">Profile & Memory Visibility</label>
          <select id="prefVisibility" class="input" bind:value={profileVisibility}>
            <option value="public">Public (Visible to all Travora users)</option>
            <option value="friends">Trip Friends Only</option>
            <option value="private">Private (Only Me)</option>
          </select>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-between pt-2">
        <button type="submit" class="btn btn-primary btn-lg">
          Save Settings
        </button>

        <button type="button" class="btn btn-outline" onclick={handleLogout}>
          Log Out
        </button>
      </div>
    </form>

    <!-- Data Management & Reset -->
    <div class="card p-6 mt-10 border border-red">
      <h3 class="font-bold text-forest mb-2">Storage & Demo Data</h3>
      <p class="text-xs text-gray mb-4">
        Travora stores all state locally in your browser (localStorage & IndexedDB). You can reset to fresh seed data at any time.
      </p>

      <button class="btn btn-cream btn-sm" onclick={handleResetDemoData}>
        ⚠️ Reset Local Demo Data & Re-seed
      </button>
    </div>
  </div>
</div>

<style>
  .max-w-sm { max-width: 24rem; }
</style>
