<script lang="ts">
  import { page } from '$app/stores';

  const tabs = [
    {
      href: '/home',
      label: 'Home',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
    },
    {
      href: '/discover',
      label: 'Discover',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`
    },
    {
      href: '/trips',
      label: 'Trips',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`
    },
    {
      href: '/memories',
      label: 'Memories',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
    }
  ];

  function isActive(href: string) {
    return $page.url.pathname === href || $page.url.pathname.startsWith(href + '/');
  }
</script>

<nav class="bottom-nav" aria-label="Main navigation">
  {#each tabs as tab}
    <a
      href={tab.href}
      class="bottom-tab"
      class:active={isActive(tab.href)}
      aria-label={tab.label}
      aria-current={isActive(tab.href) ? 'page' : undefined}
    >
      <span class="tab-icon">{@html tab.icon}</span>
      <span class="tab-label">{tab.label}</span>
    </a>
  {/each}
</nav>

<style>
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--bottom-nav-height);
    background: var(--white);
    border-top: 1px solid var(--border);
    display: none;
    align-items: center;
    z-index: 500;
    box-shadow: 0 -4px 16px rgba(23, 63, 53, 0.08);
  }

  .bottom-tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    height: 100%;
    text-decoration: none;
    color: var(--gray);
    transition: color var(--transition-fast);
    padding: var(--sp-2) 0;
    position: relative;
  }

  .bottom-tab::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 24px;
    height: 2px;
    background: var(--terracotta);
    border-radius: 0 0 var(--radius-sm) var(--radius-sm);
    transition: transform var(--transition-fast);
  }

  .bottom-tab.active {
    color: var(--forest);
  }

  .bottom-tab.active::before {
    transform: translateX(-50%) scaleX(1);
  }

  .tab-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: var(--radius-sm);
    transition: background var(--transition-fast);
  }

  .bottom-tab.active .tab-icon {
    background: var(--forest-10);
  }

  .tab-label {
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  @media (max-width: 768px) {
    .bottom-nav {
      display: flex;
    }
  }
</style>
