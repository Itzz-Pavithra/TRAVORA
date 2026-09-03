<script>
  let { activity, onadd } = $props();
</script>

<div class="activity-card card">
  <img src={activity.image} alt={activity.name} class="act-img" />

  <div class="p-5">
    <div class="flex items-center justify-between mb-1">
      <span class="badge badge-forest text-xs">{activity.category?.toUpperCase() || 'ACTIVITY'}</span>
      <span class="text-xs text-gray">⭐ {activity.rating || 4.7}</span>
    </div>

    <h3 class="text-forest font-bold text-base mb-1">{activity.name}</h3>
    <p class="text-xs text-gray mb-2">📍 {activity.location} • ⏳ {activity.duration}</p>
    <p class="act-desc text-xs text-forest mb-4">{activity.description}</p>

    <div class="flex items-center justify-between pt-3 border-t">
      <strong class="text-terracotta text-base">₹{activity.estimatedCost?.toLocaleString('en-IN')}</strong>
      <button class="btn btn-primary btn-sm" onclick={() => onadd?.(activity)}>
        + Add to Trip
      </button>
    </div>
  </div>
</div>

<style>
  .activity-card {
    background: var(--white);
    overflow: hidden;
  }

  .act-img {
    width: 100%;
    height: 160px;
    object-fit: cover;
  }

  .act-desc {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .border-t { border-top: 1px solid var(--border); }
</style>
