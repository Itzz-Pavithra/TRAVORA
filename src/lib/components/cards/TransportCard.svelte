<script lang="ts">
  import type { Transportation } from '$lib/types';

  interface Props {
    transport: Transportation;
  }

  let { transport }: Props = $props();

  const typeIcons: Record<string, string> = {
    flight: '✈️',
    train: '🚆',
    bus: '🚌',
    car: '🚗',
    cab: '🚕',
    road: '🚙'
  };

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  }
</script>

<div class="transport-card card" class:recommended={transport.isRecommended}>
  {#if transport.isRecommended}
    <div class="recommended-tag">
      ★ Recommended Option
    </div>
  {/if}

  <div class="card-body">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <span class="transport-type-icon">{typeIcons[transport.type] || '✈️'}</span>
        <div>
          <h4 class="provider-name">{transport.provider}</h4>
          {#if transport.class}
            <span class="text-xs text-gray">{transport.class}</span>
          {/if}
        </div>
      </div>
      <div class="text-right">
        <div class="transport-price">₹{transport.price.toLocaleString('en-IN')}</div>
        <span class="text-xs text-gray">per traveler</span>
      </div>
    </div>

    <div class="route-timeline">
      <div class="route-point">
        <span class="time">{formatTime(transport.departureTime)}</span>
        <span class="location">{transport.from}</span>
      </div>

      <div class="route-line-wrap">
        <span class="duration text-xs text-gray">{transport.duration}</span>
        <div class="route-line">
          <div class="route-dot start"></div>
          <div class="route-path"></div>
          <div class="route-dot end"></div>
        </div>
      </div>

      <div class="route-point text-right">
        <span class="time">{formatTime(transport.arrivalTime)}</span>
        <span class="location">{transport.to}</span>
      </div>
    </div>
  </div>
</div>

<style>
  .transport-card {
    position: relative;
    border: 1.5px solid var(--border);
  }

  .transport-card.recommended {
    border-color: var(--forest);
  }

  .recommended-tag {
    background: var(--forest);
    color: var(--white);
    font-size: 0.75rem;
    font-weight: 700;
    padding: 3px 12px;
    border-radius: 0 0 var(--radius-sm) var(--radius-sm);
    position: absolute;
    top: 0;
    left: var(--sp-4);
    letter-spacing: 0.04em;
  }

  .transport-type-icon {
    font-size: 1.5rem;
    background: var(--cream);
    width: 40px;
    height: 40px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .provider-name {
    font-size: 1rem;
    font-weight: 600;
    color: var(--forest);
  }

  .transport-price {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--terracotta);
  }

  .route-timeline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--cream);
    padding: var(--sp-3) var(--sp-4);
    border-radius: var(--radius-md);
  }

  .route-point {
    display: flex;
    flex-direction: column;
    min-width: 80px;
  }

  .route-point .time {
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--forest);
  }

  .route-point .location {
    font-size: 0.75rem;
    color: var(--gray);
  }

  .route-line-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 var(--sp-4);
  }

  .route-line {
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 4px;
  }

  .route-path {
    flex: 1;
    height: 2px;
    background: var(--border-strong);
  }

  .route-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--forest);
  }
</style>
