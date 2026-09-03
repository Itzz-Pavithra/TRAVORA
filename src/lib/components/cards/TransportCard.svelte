<script>
  let { transport } = $props();

  const iconMap = {
    flight: '✈️',
    train: '🚆',
    cab: '🚕',
    bus: '🚌',
    car: '🚗'
  };
</script>

<div class="transport-card card p-5 flex items-center justify-between">
  <div class="flex items-center gap-4">
    <span class="text-3xl">{iconMap[transport.type] || '✈️'}</span>
    <div>
      <div class="flex items-center gap-2 mb-1">
        <strong class="text-forest text-base">{transport.provider}</strong>
        {#if transport.isRecommended}
          <span class="badge badge-forest text-xs">Recommended</span>
        {/if}
      </div>
      <p class="text-xs text-gray">
        {transport.from} → {transport.to} • {transport.departureTime} ({transport.duration})
      </p>
    </div>
  </div>

  <div class="text-right">
    <strong class="text-terracotta text-lg block">₹{transport.price?.toLocaleString('en-IN')}</strong>
    <span class="text-xs text-gray block">per seat</span>
  </div>
</div>

<style>
  .transport-card {
    background: var(--white);
  }
  .block { display: block; }
</style>
