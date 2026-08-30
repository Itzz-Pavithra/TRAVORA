<script lang="ts">
  import { goto } from '$app/navigation';
  import { userService } from '$lib/services/userService';
  import { currentUser, notifications } from '$lib/stores';

  let name = $state('');
  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let loading = $state(false);
  let error = $state('');

  async function handleSignUp() {
    if (!name || !email || !password || !confirmPassword) {
      error = 'Please fill in all fields.';
      return;
    }
    if (password !== confirmPassword) {
      error = 'Passwords do not match.';
      return;
    }
    if (password.length < 6) {
      error = 'Password should be at least 6 characters.';
      return;
    }

    loading = true;
    error = '';
    await new Promise(r => setTimeout(r, 400));

    const user = userService.register(name, email, password);
    currentUser.init();
    notifications.show(`Welcome to Travora, ${name}! Let's customize your experience.`);
    goto('/onboarding');
    loading = false;
  }
</script>

<svelte:head>
  <title>Sign Up — Travora</title>
</svelte:head>

<div class="auth-page">
  <div class="auth-side-visual">
    <div class="auth-visual-content">
      <a href="/" class="logo">
        <span style="color:var(--terracotta)">✦</span>
        <span class="logo-text-white">Travora</span>
      </a>
      <h2 class="visual-headline">Begin Your Next Chapter</h2>
      <p class="visual-sub">Create your account to discover destinations, plan trips with friends, split expenses effortlessly, and curate memories forever.</p>
      
      <div class="perks-list">
        <div class="perk-item">
          <span class="perk-icon">✦</span>
          <span>Collaborative group itineraries</span>
        </div>
        <div class="perk-item">
          <span class="perk-icon">✦</span>
          <span>Transparent, automated expense settlements</span>
        </div>
        <div class="perk-item">
          <span class="perk-icon">✦</span>
          <span>Shared photo albums and interactive timelines</span>
        </div>
      </div>
    </div>
  </div>

  <div class="auth-form-panel">
    <div class="auth-form-inner">
      <div class="auth-header">
        <a href="/" class="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to home
        </a>
      </div>

      <h1 class="auth-title">Create Account</h1>
      <p class="auth-sub">Join Travora and make every journey memorable.</p>

      {#if error}
        <div class="auth-error">{error}</div>
      {/if}

      <form class="auth-form" onsubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
        <div class="input-group">
          <label for="name">Full Name</label>
          <input id="name" type="text" class="input" bind:value={name} placeholder="e.g. Pavithra S" required autocomplete="name" />
        </div>

        <div class="input-group">
          <label for="email">Email Address</label>
          <input id="email" type="email" class="input" bind:value={email} placeholder="you@example.com" required autocomplete="email" />
        </div>

        <div class="input-group">
          <label for="password">Password</label>
          <input id="password" type="password" class="input" bind:value={password} placeholder="At least 6 characters" required autocomplete="new-password" />
        </div>

        <div class="input-group">
          <label for="confirmPassword">Confirm Password</label>
          <input id="confirmPassword" type="password" class="input" bind:value={confirmPassword} placeholder="Re-enter password" required autocomplete="new-password" />
        </div>

        <button type="submit" class="btn btn-accent btn-lg w-full mt-2" disabled={loading}>
          {#if loading}
            Creating Account...
          {:else}
            Get Started
          {/if}
        </button>
      </form>

      <p class="auth-switch">
        Already have an account? <a href="/login">Log in</a>
      </p>
    </div>
  </div>
</div>

<style>
  .auth-page {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    min-height: 100vh;
  }

  .auth-side-visual {
    background: var(--forest);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--sp-12);
    position: relative;
    overflow: hidden;
  }

  .auth-side-visual::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top right, rgba(217,119,69,0.25) 0%, transparent 60%);
  }

  .auth-visual-content {
    position: relative;
    z-index: 1;
    max-width: 440px;
  }

  .logo { display: flex; align-items: center; gap: var(--sp-2); text-decoration: none; margin-bottom: var(--sp-10); }
  .logo-text-white { font-family: var(--font-serif); font-size: 1.5rem; font-weight: 700; color: var(--white); }

  .visual-headline {
    font-family: var(--font-serif);
    font-size: 2.25rem;
    color: var(--white);
    line-height: 1.2;
    margin-bottom: var(--sp-4);
  }

  .visual-sub {
    color: rgba(255,255,255,0.8);
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: var(--sp-8);
  }

  .perks-list {
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
  }

  .perk-item {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    color: var(--white);
    font-size: 0.9375rem;
    font-weight: 500;
  }

  .perk-icon {
    color: var(--terracotta);
    font-size: 1.1rem;
  }

  .auth-form-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--sp-8);
    background: var(--cream);
  }

  .auth-form-inner {
    width: 100%;
    max-width: 420px;
  }

  .auth-header { margin-bottom: var(--sp-6); }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    font-size: 0.875rem;
    color: var(--gray);
    text-decoration: none;
  }
  .back-link:hover { color: var(--forest); }

  .auth-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--forest);
    margin-bottom: var(--sp-2);
  }

  .auth-sub {
    color: var(--gray);
    font-size: 0.95rem;
    margin-bottom: var(--sp-6);
  }

  .auth-error {
    background: rgba(185, 74, 58, 0.1);
    border: 1px solid rgba(185, 74, 58, 0.3);
    color: #b94a3a;
    padding: var(--sp-3) var(--sp-4);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    margin-bottom: var(--sp-4);
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
  }

  .auth-switch {
    text-align: center;
    font-size: 0.9rem;
    color: var(--gray);
    margin-top: var(--sp-6);
  }

  .auth-switch a {
    color: var(--terracotta);
    font-weight: 600;
    text-decoration: none;
  }

  @media (max-width: 768px) {
    .auth-page { grid-template-columns: 1fr; }
    .auth-side-visual { display: none; }
  }
</style>
