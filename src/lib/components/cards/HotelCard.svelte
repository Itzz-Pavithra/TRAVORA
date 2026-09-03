<script>
  let { hotel, saved = false, onsave } = $props();
</script>

<div class="hotel-card card">
  {#if hotel.image}
    <img src={hotel.image} alt={hotel.name} class="hotel-img" />
  {:else}
    <div class="hotel-img-placeholder">🏨</div>
  {/if}

  <div class="p-5">
    <div class="flex items-center justify-between mb-1">
      <span class="badge badge-forest text-xs">{hotel.type?.toUpperCase() || 'STAY'}</span>
      <button class="btn-icon" onclick={() => onsave?.(hotel)}>
        {saved ? '🔖' : '🏷️'}
      </button>
    </div>

    <h3 class="text-forest font-bold text-lg mb-1">{hotel.name}</h3>
    <p class="text-xs text-gray mb-3">📍 {hotel.location}</p>

    <div class="flex items-center justify-between pt-3 border-t">
      <span class="text-xs text-gray">⭐ {hotel.rating || 4.8} ({hotel.reviewCount || 12} reviews)</span>
      <strong class="text-terracotta text-base">₹{hotel.pricePerNight?.toLocaleString('en-IN')}<span class="text-xs text-gray font-normal"> /night</span></strong>
    </div>
  </div>
</div>

<style>
  .hotel-card {
    background: var(--white);
    overflow: hidden;
  }

  .hotel-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }

  .hotel-img-placeholder {
    width: 100%;
    height: 180px;
    background: var(--cream);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
  }

  .border-t { border-top: 1px solid var(--border); }
</style>
