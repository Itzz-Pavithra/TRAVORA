<script>
  import { page } from '$app/stores';

  let { trip } = $props();

  const navItems = [
    { href: '', label: 'Overview', icon: '📌' },
    { href: '/itinerary', label: 'Itinerary', icon: '📅' },
    { href: '/map', label: 'Itinerary Map', icon: '🗺️' },
    { href: '/transport', label: 'Transport', icon: '✈️' },
    { href: '/stay', label: 'Stay & Hotels', icon: '🏨' },
    { href: '/activities', label: 'Activities', icon: '🎟️' },
    { href: '/expenses', label: 'Expenses (Split)', icon: '💸' },
    { href: '/friends', label: 'Trip Friends', icon: '👥' },
    { href: '/chat', label: 'Group Chat', icon: '💬' },
    { href: '/polls', label: 'Group Polls', icon: '📊' },
    { href: '/fun', label: 'Travel Fun', icon: '🎮' },
    { href: '/memories', label: 'Memories', icon: '📸' }
  ];

  function isActive(subPath) {
    const basePath = `/trips/${trip.id}`;
    const target = subPath === '' ? basePath : `${basePath}${subPath}`;
    return $page.url.pathname === target;
  }
</script>

<aside class="sidebar card">
  <div class="sidebar-header p-5 border-b">
    <span class="badge badge-forest text-xs mb-1">{trip.type === 'solo' ? '🧍 Solo' : '👥 Group'} Trip</span>
    <h3 class="font-bold text-forest text-lg truncate">{trip.name}</h3>
    <p class="text-xs text-gray">📍 {trip.destination}</p>
  </div>

  <nav class="sidebar-nav p-3 flex-col gap-1">
    {#each navItems as item}
      {@const fullHref = item.href === '' ? `/trips/${trip.id}` : `/trips/${trip.id}${item.href}`}
      <a 
        href={fullHref} 
        class="sidebar-link" 
        class:active={isActive(item.href)}
      >
        <span class="sidebar-icon">{item.icon}</span>
        <span>{item.label}</span>
      </a>
    {/each}
  </nav>
</aside>

<style>
  .sidebar {
    width: 240px;
    flex-shrink: 0;
    background: var(--white);
    border-radius: 0;
    border-right: 1px solid var(--border);
    border-top: none;
    border-bottom: none;
  }

  .border-b { border-bottom: 1px solid var(--border); }
  .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .sidebar-link {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    padding: var(--sp-2) var(--sp-3);
    border-radius: var(--radius-md);
    color: var(--gray);
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    transition: all var(--transition-fast);
  }

  .sidebar-link:hover {
    background: var(--cream);
    color: var(--forest);
  }

  .sidebar-link.active {
    background: var(--forest);
    color: var(--white);
  }

  @media (max-width: 900px) {
    .sidebar { display: none; }
  }
</style>
