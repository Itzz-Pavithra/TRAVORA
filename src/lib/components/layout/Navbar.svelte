<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { currentUser } from '$lib/stores';

  const navLinks = [
    { href: '/discover', label: 'Discover' },
    { href: '/trips', label: 'Trips' },
    { href: '/memories', label: 'Memories' },
  ];

  let menuOpen = $state(false);

  function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  function isActive(href: string) {
    return $page.url.pathname.startsWith(href);
  }
</script>

<nav class="navbar" class:scrolled={true}>
  <div class="navbar-inner container">
    <a href={$currentUser ? '/home' : '/'} class="logo">
      <span class="logo-leaf">✦</span>
      <span class="logo-text">Travora</span>
    </a>

    <!-- Desktop Nav -->
    <div class="nav-links">
      {#each navLinks as link}
        <a href={link.href} class="nav-link" class:active={isActive(link.href)}>
          {link.label}
        </a>
      {/each}
    </div>

    <!-- Auth Actions -->
    <div class="nav-actions">
      {#if $currentUser}
        <a href="/saved" class="nav-icon-btn" title="Saved Places" aria-label="Saved Places">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </a>
        <a href="/profile" class="avatar-btn" aria-label="Profile">
          <div class="avatar avatar-sm" style="background:{$currentUser.avatarColor}; color:white">
            {getInitials($currentUser.name)}
          </div>
        </a>
      {:else}
        <a href="/login" class="btn btn-ghost btn-sm">Log in</a>
        <a href="/signup" class="btn btn-primary btn-sm">Get Started</a>
      {/if}
    </div>

    <!-- Mobile Menu Toggle -->
    <button class="mobile-menu-btn" onclick={() => menuOpen = !menuOpen} aria-label="Toggle menu">
      {#if menuOpen}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      {:else}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
      {/if}
    </button>
  </div>

  <!-- Mobile Menu -->
  {#if menuOpen}
    <div class="mobile-menu" role="dialog" aria-modal="true">
      {#each navLinks as link}
        <a href={link.href} class="mobile-nav-link" onclick={() => menuOpen = false}>{link.label}</a>
      {/each}
      <div class="mobile-divider"></div>
      {#if $currentUser}
        <a href="/profile" class="mobile-nav-link" onclick={() => menuOpen = false}>Profile</a>
        <a href="/settings" class="mobile-nav-link" onclick={() => menuOpen = false}>Settings</a>
      {:else}
        <a href="/login" class="mobile-nav-link" onclick={() => menuOpen = false}>Log In</a>
        <a href="/signup" class="mobile-nav-link accent" onclick={() => menuOpen = false}>Get Started</a>
      {/if}
    </div>
  {/if}
</nav>

<style>
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--navbar-height);
    background: var(--white);
    border-bottom: 1px solid var(--border);
    z-index: 500;
    transition: box-shadow var(--transition-fast);
  }

  .navbar.scrolled {
    box-shadow: var(--shadow-sm);
  }

  .navbar-inner {
    display: flex;
    align-items: center;
    height: 100%;
    gap: var(--sp-8);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    text-decoration: none;
    flex-shrink: 0;
  }

  .logo-leaf {
    font-size: 1.1rem;
    color: var(--terracotta);
  }

  .logo-text {
    font-family: var(--font-serif);
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--forest);
    letter-spacing: -0.01em;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: var(--sp-1);
    flex: 1;
  }

  .nav-link {
    padding: var(--sp-2) var(--sp-3);
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--gray);
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
    text-decoration: none;
  }

  .nav-link:hover { color: var(--forest); background: var(--forest-10); }
  .nav-link.active { color: var(--forest); font-weight: 600; }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    margin-left: auto;
  }

  .nav-icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: var(--radius-sm);
    color: var(--gray);
    transition: all var(--transition-fast);
    text-decoration: none;
  }
  .nav-icon-btn:hover { background: var(--forest-10); color: var(--forest); }

  .avatar-btn {
    display: flex;
    align-items: center;
    text-decoration: none;
    border-radius: 50%;
    transition: transform var(--transition-fast);
  }
  .avatar-btn:hover { transform: scale(1.05); }

  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--forest);
    padding: var(--sp-2);
    border-radius: var(--radius-sm);
    margin-left: auto;
  }
  .mobile-menu-btn:hover { background: var(--forest-10); }

  .mobile-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--white);
    border-bottom: 1px solid var(--border);
    box-shadow: var(--shadow-lg);
    padding: var(--sp-4) var(--sp-6);
    display: flex;
    flex-direction: column;
    gap: var(--sp-1);
    animation: slideDown var(--transition-normal) ease;
  }

  .mobile-nav-link {
    padding: var(--sp-3) var(--sp-4);
    font-size: 1rem;
    font-weight: 500;
    color: var(--forest);
    border-radius: var(--radius-sm);
    text-decoration: none;
    transition: background var(--transition-fast);
  }
  .mobile-nav-link:hover { background: var(--forest-10); }
  .mobile-nav-link.accent { color: var(--terracotta); font-weight: 600; }

  .mobile-divider {
    height: 1px;
    background: var(--border);
    margin: var(--sp-2) 0;
  }

  @media (max-width: 768px) {
    .nav-links { display: none; }
    .nav-actions { display: none; }
    .mobile-menu-btn { display: flex; }
    .logo { margin-right: 0; }
  }
</style>
