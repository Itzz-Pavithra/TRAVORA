<script lang="ts">
  import type { Activity } from '$lib/types';

  interface Props {
    activity: Activity;
    onadd?: (activity: Activity) => void;
  }

  let { activity, onadd }: Props = $props();
</script>

<div class="activity-card card">
  <div class="activity-cover">
    <div class="activity-bg-placeholder">
      <span class="activity-emoji">🎟️</span>
    </div>
    <div class="category-badge badge badge-forest">{activity.category}</div>
    <div class="rating-badge">★ {activity.rating}</div>
  </div>

  <div class="card-body">
    <h4 class="activity-name">{activity.name}</h4>
    <p class="activity-location text-xs text-gray mb-2 flex items-center gap-1">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      {activity.location}
    </p>

    <p class="activity-desc text-xs text-gray line-clamp-2 mb-3">{activity.description}</p>

    <div class="flex items-center gap-3 text-xs text-gray mb-4">
      <span class="flex items-center gap-1">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        {activity.duration}
      </span>
      <span>•</span>
      <span class="font-semibold text-forest">₹{activity.estimatedCost.toLocaleString('en-IN')}</span>
    </div>

    {#if onadd}
      <button class="btn btn-outline btn-sm w-full" onclick={() => onadd?.(activity)}>
        + Add to Itinerary
      </button>
    {/if}
  </div>
</div>

<style>
  .activity-card {
    overflow: hidden;
  }

  .activity-cover {
    position: relative;
    height: 140px;
  }

  .activity-bg-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--forest-10) 0%, var(--terracotta-10) 100%);
  }

  .activity-emoji {
    font-size: 2.25rem;
  }

  .category-badge {
    position: absolute;
    top: var(--sp-2);
    left: var(--sp-2);
  }

  .rating-badge {
    position: absolute;
    top: var(--sp-2);
    right: var(--sp-2);
    background: var(--white);
    padding: 2px 8px;
    border-radius: var(--radius-full);
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--forest);
    box-shadow: var(--shadow-sm);
  }

  .activity-name {
    font-size: 1rem;
    font-weight: 700;
    color: var(--forest);
    margin-bottom: 2px;
  }

  .w-full { width: 100%; }
</style>
