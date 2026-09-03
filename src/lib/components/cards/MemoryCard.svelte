<script>
  let { memory, currentUserId = '', onlike, ondelete } = $props();

  const mediaSrc = $derived(memory.mediaKey || '');
  const isLiked = $derived(memory.likes?.includes(currentUserId));
  const isOwner = $derived(memory.uploadedBy === currentUserId);
</script>

<div class="memory-card card">
  <div class="memory-media-container">
    {#if mediaSrc}
      {#if memory.mediaType === 'video'}
        <video src={mediaSrc} controls class="memory-media">
          <track kind="captions" />
        </video>
      {:else}
        <img src={mediaSrc} alt={memory.caption || 'Travel memory'} class="memory-media" />
      {/if}
    {:else}
      <div class="memory-placeholder">
        <span>📸</span>
      </div>
    {/if}

    {#if memory.location}
      <div class="location-badge">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        {memory.location}
      </div>
    {/if}
  </div>

  <div class="card-body">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <div class="avatar avatar-sm" style="background:{memory.avatarColor || '#173F35'}; color:white">
          {memory.uploadedByName ? memory.uploadedByName[0].toUpperCase() : 'U'}
        </div>
        <span class="text-sm font-semibold text-forest">{memory.uploadedByName}</span>
      </div>
      <span class="text-xs text-gray">{new Date(memory.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
    </div>

    {#if memory.caption}
      <p class="memory-caption">{memory.caption}</p>
    {/if}

    <div class="memory-footer flex items-center justify-between mt-3 pt-3 border-t">
      <button 
        class="like-btn" 
        class:liked={isLiked}
        onclick={() => onlike?.(memory.id)}
        aria-label="Like memory"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        <span>{memory.likes?.length || 0}</span>
      </button>

      {#if isOwner && ondelete}
        <button 
          class="btn-icon text-gray" 
          onclick={() => ondelete?.(memory)} 
          title="Delete memory"
          aria-label="Delete memory"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      {/if}
    </div>
  </div>
</div>

<style>
  .memory-card {
    overflow: hidden;
  }

  .memory-media-container {
    position: relative;
    width: 100%;
    aspect-ratio: 4/3;
    background: var(--cream);
    overflow: hidden;
  }

  .memory-media {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .memory-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    background: linear-gradient(135deg, var(--forest-10) 0%, var(--terracotta-10) 100%);
  }

  .location-badge {
    position: absolute;
    bottom: var(--sp-2);
    left: var(--sp-2);
    background: rgba(23, 63, 53, 0.8);
    color: var(--white);
    padding: 3px 8px;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
    backdrop-filter: blur(4px);
  }

  .memory-caption {
    font-size: 0.875rem;
    color: var(--forest);
    line-height: 1.45;
    margin-top: var(--sp-1);
  }

  .border-t {
    border-top: 1px solid var(--border);
  }

  .like-btn {
    background: none;
    border: none;
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--gray);
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    padding: 4px 6px;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
  }

  .like-btn:hover, .like-btn.liked {
    color: var(--terracotta);
    background: var(--terracotta-10);
  }
</style>
