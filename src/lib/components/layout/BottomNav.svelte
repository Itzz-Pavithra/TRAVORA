<script>
  import { page } from '$app/stores';

  const bottomNavItems = [
    { href: '/home', label: 'Home', icon: '🏠' },
    { href: '/trips', label: 'Trips', icon: '✈️' },
    { href: '/discover', label: 'Discover', icon: '🗺️' },
    { href: '/memories', label: 'Memories', icon: '📸' },
    { href: '/profile', label: 'Profile', icon: '👤' }
  ];

  function isActive(href) {
    return $page.url.pathname === href;
  }
</script>

<nav class="bottom-nav">
  {#each bottomNavItems as item}
    <a href={item.href} class="bottom-nav-item" class:active={isActive(item.href)}>
      <span class="bottom-nav-icon">{item.icon}</span>
      <span class="bottom-nav-label">{item.label}</span>
    </a>
  {/each}
</nav>

<style>
  .bottom-nav {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--bottom-nav-height);
    background: var(--white);
    border-top: 1px solid var(--border);
    z-index: 900;
    align-items: center;
    justify-content: space-around;
  }

  .bottom-nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    color: var(--gray);
    text-decoration: none;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .bottom-nav-icon {
    font-size: 1.2rem;
  }

  .bottom-nav-item.active {
    color: var(--forest);
    font-weight: 700;
  }

  @media (max-width: 768px) {
    .bottom-nav { display: flex; }
  }
</style>
