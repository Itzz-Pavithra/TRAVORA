<script>
  import { goto } from '$app/navigation';
  import { authService } from '$lib/services/authService.js';
  import { notifications } from '$lib/stores/index.js';

  let email = $state('');
  let password = $state('');
  let loading = $state(false);
  let error = $state('');
  let showPassword = $state(false);

  async function handleLogin() {
    if (!email || !password) { error = 'Please fill in all fields.'; return; }
    loading = true;
    error = '';

    try {
      const user = await authService.signIn(email, password);
      notifications.show(`Welcome back, ${user.name.split(' ')[0]}! 👋`);
      goto('/home');
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        error = 'Invalid email or password. You can also click "Use Demo Account" below.';
      } else {
        error = err.message || 'Login failed. Please check your network and credentials.';
      }
    } finally {
      loading = false;
    }
  }

  async function handleDemoLogin() {
    loading = true;
    error = '';
    try {
      const user = await authService.signInDemo();
      notifications.show(`Welcome to Travora, ${user.name.split(' ')[0]}! ✈️`);
      goto('/home');
    } catch (err) {
      error = 'Could not sign in with demo account. ' + err.message;
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Log In — Travora</title>
</svelte:head>

<div class="auth-page">
  <div class="auth-side-visual">
    <div class="auth-visual-content">
      <a href="/" class="logo">
        <span style="color:var(--terracotta)">✦</span>
        <span class="logo-text-white">Travora</span>
      </a>
      <div class="visual-stack">
        <div class="visual-card vc1">
          <span>🏖️</span>
          <div>
            <strong>Goa Escape</strong>
            <p>12 – 16 December</p>
          </div>
        </div>
        <div class="visual-card vc2">
          <span>🌿</span>
          <div>
            <strong>Kerala Explorer</strong>
            <p>March, completed</p>
          </div>
        </div>
        <div class="visual-card vc3">
          <span>🌃</span>
          <div>
            <strong>Singapore Adventure</strong>
            <p>January 2027</p>
          </div>
        </div>
      </div>
      <blockquote class="visual-quote">
        "The journey of a thousand miles begins with a single step."
      </blockquote>
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

      <h1 class="auth-title">Welcome back</h1>
      <p class="auth-sub">Sign in to continue your journey.</p>

      {#if error}
        <div class="auth-error">{error}</div>
      {/if}

      <form class="auth-form" onsubmit={(e) => { e.preventDefault(); handleLogin(); }}>
        <div class="input-group">
          <label for="email">Email address</label>
          <div class="input-icon-wrap">
            <span class="input-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </span>
            <input id="email" type="email" class="input" bind:value={email} placeholder="you@example.com" required autocomplete="email" />
          </div>
        </div>

        <div class="input-group">
          <label for="password">Password</label>
          <div class="input-icon-wrap">
            <span class="input-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
            <input id="password" type={showPassword ? 'text' : 'password'} class="input" bind:value={password} placeholder="••••••••" required autocomplete="current-password" />
          </div>
          <button type="button" class="show-pass-btn" onclick={() => showPassword = !showPassword}>
            {showPassword ? 'Hide' : 'Show'} password
          </button>
        </div>

        <button type="submit" class="btn btn-primary btn-lg w-full" disabled={loading}>
          {#if loading}
            <span class="spinner"></span> Signing in...
          {:else}
            Sign In
          {/if}
        </button>
      </form>

      <div class="auth-divider"><span>or</span></div>

      <button class="btn btn-cream btn-lg w-full" onclick={handleDemoLogin} disabled={loading}>
        ✨ Use Demo Account
      </button>

      <p class="auth-switch">
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  </div>
</div>

<style>
  .auth-page {
    display: grid;
    grid-template-columns: 1fr 1fr;
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
    background: radial-gradient(ellipse at 80% 20%, rgba(217,119,69,0.2) 0%, transparent 50%),
                radial-gradient(ellipse at 20% 80%, rgba(217,119,69,0.1) 0%, transparent 40%);
  }

  .auth-visual-content {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 360px;
  }

  .logo { display: flex; align-items: center; gap: var(--sp-2); text-decoration: none; margin-bottom: var(--sp-12); }
  .logo-text-white { font-family: var(--font-serif); font-size: 1.5rem; font-weight: 700; color: var(--white); }

  .visual-stack {
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
    margin-bottom: var(--sp-8);
  }

  .visual-card {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: var(--radius-md);
    padding: var(--sp-3) var(--sp-4);
    font-size: 1.25rem;
    transition: transform var(--transition-fast);
    animation: slideInRight 0.5s ease both;
  }

  .vc1 { animation-delay: 0.1s; }
  .vc2 { animation-delay: 0.2s; }
  .vc3 { animation-delay: 0.3s; }

  .visual-card:hover { transform: translateX(4px); }
  .visual-card strong { display: block; font-size: 0.9375rem; color: var(--white); }
  .visual-card p { font-size: 0.75rem; color: rgba(255,255,255,0.6); margin: 0; }

  .visual-quote {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 0.9375rem;
    color: rgba(255,255,255,0.55);
    border-left: 3px solid var(--terracotta);
    padding-left: var(--sp-4);
    line-height: 1.55;
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
    max-width: 400px;
  }

  .auth-header { margin-bottom: var(--sp-8); }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    font-size: 0.875rem;
    color: var(--gray);
    text-decoration: none;
    transition: color var(--transition-fast);
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
    font-size: 1rem;
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
    margin-bottom: var(--sp-4);
  }

  .show-pass-btn {
    background: none;
    border: none;
    color: var(--terracotta);
    font-size: 0.8125rem;
    cursor: pointer;
    text-align: right;
    padding: var(--sp-1) 0;
    align-self: flex-end;
    font-weight: 500;
  }

  .w-full { width: 100%; }

  .auth-divider {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    margin: var(--sp-5) 0;
    color: var(--gray-light);
    font-size: 0.875rem;
  }

  .auth-divider::before, .auth-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .auth-switch {
    text-align: center;
    font-size: 0.9rem;
    color: var(--gray);
    margin-top: var(--sp-5);
  }

  .auth-switch a {
    color: var(--terracotta);
    font-weight: 600;
    text-decoration: none;
  }
  .auth-switch a:hover { text-decoration: underline; }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    display: inline-block;
  }

  @media (max-width: 768px) {
    .auth-page { grid-template-columns: 1fr; }
    .auth-side-visual { display: none; }
  }
</style>
