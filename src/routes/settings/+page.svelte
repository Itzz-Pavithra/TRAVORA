<script>
  import { goto } from '$app/navigation';
  import { currentUser, notifications } from '$lib/stores/index.js';
  import { userService } from '$lib/services/userService.js';

  let name = $state($currentUser?.name || '');
  let email = $state($currentUser?.email || '');
  let preference = $state($currentUser?.travelPreference || 'group');
  let currency = $state($currentUser?.currency || 'INR');
  let language = $state($currentUser?.language || 'en');
  let profileVisibility = $state($currentUser?.profileVisibility || 'public');
  let saving = $state(false);

  $effect(() => {
    if ($currentUser) {
      name = $currentUser.name || '';
      email = $currentUser.email || '';
      preference = $currentUser.travelPreference || 'group';
      currency = $currentUser.currency || 'INR';
      language = $currentUser.language || 'en';
      profileVisibility = $currentUser.profileVisibility || 'public';
    }
  });

  async function handleSaveProfile() {
    if (!$currentUser) return;
    saving = true;
    try {
      const updated = await userService.updateUser($currentUser.id, {
        name: name.trim(),
        email: email.trim(),
        travelPreference: preference,
        currency,
        language,
        profileVisibility
      });
      if (updated) {
        currentUser.set(updated);
      }
      notifications.show('Settings updated in Cloud Firestore!');
    } catch (err) {
      notifications.show(`Failed to save settings: ${err.message}`, 'error');
    } finally {
      saving = false;
    }
  }

  async function handleLogout() {
    await currentUser.logout();
    notifications.show('Logged out from Travora.');
    goto('/');
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
      <p class="section-desc">Manage profile details, trip defaults, privacy controls, and Firebase storage.</p>
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
        <button type="submit" class="btn btn-primary btn-lg" disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>

        <button type="button" class="btn btn-outline" onclick={handleLogout}>
          Log Out
        </button>
      </div>
    </form>
  </div>
</div>

<style>
  .max-w-sm { max-width: 24rem; }
</style>
