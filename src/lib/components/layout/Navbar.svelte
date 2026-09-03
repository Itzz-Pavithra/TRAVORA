<script>
  import { page } from '$app/stores';
  import { currentUser } from '$lib/stores/index.js';

  const navLinks = [
    { href: '/home', label: 'Dashboard' },
    { href: '/trips', label: 'My Trips' },
    { href: '/discover', label: 'Discover' },
    { href: '/memories', label: 'Memories' },
    { href: '/saved', label: 'Saved' }
  ];

  function isActive(href) {
    return $page.url.pathname === href;
  }
</script>

<header class="navbar">
  <div class="container flex items-center justify-between h-full">
    <a href="/home" class="navbar-logo">
      <span style="color:var(--terracotta)">✦</span>
      <span class="logo-text">Travora</span>
    </a>

    <nav class="navbar-links">
      {#each navLinks as link}
        <a 
          href={link.href} 
          class="nav-item" 
          class:active={isActive(link.href)}
        >
          {link.label}
        </a>
      {/each}
    </nav>

    <div class="navbar-actions flex items-center gap-3">
      {#if $currentUser}
        <a href="/trips/create" class="btn btn-accent btn-sm">+ New Trip</a>
        <a href="/profile" class="user-avatar-btn" title={$currentUser.name}>
          <div class="avatar avatar-sm" style="background: {$currentUser.avatarColor || '#D97745'}; color: white;">
            {$currentUser.name ? $currentUser.name[0].toUpperCase() : 'U'}
          </div>
        </a>
      {:else}
        <a href="/login" class="btn btn-outline btn-sm">Log In</a>
        <a href="/signup" class="btn btn-primary btn-sm">Sign Up</a>
      {/if}
    </div>
  </div>
</header>

<style>
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--navbar-height);
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--border);
    z-index: 900;
  }

  .h-full { height: 100%; }

  .navbar-logo {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    text-decoration: none;
    font-size: 1.25rem;
  }

  .logo-text {
    font-family: var(--font-serif);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--forest);
  }

  .navbar-links {
    display: flex;
    align-items: center;
    gap: var(--sp-6);
  }

  .nav-item {
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--gray);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  .nav-item:hover, .nav-item.active {
    color: var(--forest);
    font-weight: 600;
  }

  .user-avatar-btn {
    text-decoration: none;
  }

  @media (max-width: 768px) {
    .navbar-links { display: none; }
  }
</style>
