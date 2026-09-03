<script>
  let { destination, saved = false, onsave } = $props();
</script>

<div class="destination-card card">
  <div class="dest-media-wrap">
    <img src={destination.image} alt={destination.name} class="dest-img" />
    <button class="dest-save-btn" onclick={() => onsave?.(destination)} aria-label="Bookmark destination">
      {saved ? '🔖' : '🏷️'}
    </button>
    <div class="dest-overlay">
      <span class="badge badge-cream text-xs">{destination.bestTime}</span>
    </div>
  </div>

  <div class="p-5">
    <div class="flex items-center justify-between mb-1">
      <h3 class="text-forest font-bold text-lg">{destination.name}</h3>
      <span class="text-xs text-gray">⭐ {destination.rating}</span>
    </div>
    <p class="text-xs text-gray mb-3">📍 {destination.country} • {destination.region}</p>
    <p class="dest-desc text-xs text-forest mb-4">{destination.description}</p>

    <div class="flex items-center justify-between pt-3 border-t">
      <div>
        <span class="text-xs text-gray block">Est. Budget</span>
        <strong class="text-terracotta text-sm">₹{destination.estimatedBudget?.toLocaleString('en-IN')}</strong>
      </div>
      <a href="/discover/{destination.id}" class="btn btn-outline btn-sm">Explore Spot →</a>
    </div>
  </div>
</div>

<style>
  .destination-card {
    background: var(--white);
    overflow: hidden;
  }

  .dest-media-wrap {
    position: relative;
    width: 100%;
    height: 190px;
  }

  .dest-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .dest-save-btn {
    position: absolute;
    top: var(--sp-3);
    right: var(--sp-3);
    background: rgba(255, 255, 255, 0.85);
    border: none;
    border-radius: var(--radius-full);
    padding: 6px;
    cursor: pointer;
    backdrop-filter: blur(4px);
  }

  .dest-overlay {
    position: absolute;
    bottom: var(--sp-3);
    left: var(--sp-3);
  }

  .dest-desc {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .border-t { border-top: 1px solid var(--border); }
  .block { display: block; }
</style>
