<script>
  let { trip } = $props();

  function formatDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }
</script>

<div class="trip-card card">
  <div class="trip-card-header p-5">
    <div class="flex items-center justify-between mb-2">
      <span class="badge" class:badge-forest={trip.status === 'upcoming' || trip.status === 'active'} class:badge-cream={trip.status === 'past'}>
        {trip.status?.toUpperCase() || 'UPCOMING'}
      </span>
      <span class="text-xs text-gray">{trip.type === 'solo' ? '🧍 Solo' : '👥 Group'}</span>
    </div>

    <h3 class="text-forest font-bold text-lg mb-1">{trip.name}</h3>
    <p class="text-xs text-gray">📍 {trip.destination}, {trip.country}</p>
  </div>

  <div class="trip-card-body p-5 pt-0">
    <div class="flex items-center justify-between text-xs text-gray mb-4 pt-3 border-t">
      <span>📅 {formatDate(trip.startDate)} – {formatDate(trip.endDate)}</span>
      <span class="font-semibold text-terracotta">₹{(trip.budget || 0).toLocaleString('en-IN')}</span>
    </div>

    <a href="/trips/{trip.id}" class="btn btn-primary btn-sm w-full text-center">
      Open Workspace →
    </a>
  </div>
</div>

<style>
  .trip-card {
    background: var(--white);
    transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  }

  .trip-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
  }

  .border-t { border-top: 1px solid var(--border); }
  .w-full { width: 100%; display: block; }
</style>
