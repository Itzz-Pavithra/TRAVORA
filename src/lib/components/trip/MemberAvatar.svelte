<script>
  let { name = 'User', avatarColor = '#173F35', size = 'md', showName = false, subtitle = '' } = $props();

  const initial = $derived(name ? name[0].toUpperCase() : 'U');
</script>

<div class="member-avatar-wrap flex items-center gap-2">
  <div class="avatar avatar-{size}" style="background: {avatarColor}; color: white;">
    {initial}
  </div>
  {#if showName}
    <div>
      <span class="text-sm font-semibold text-forest block">{name}</span>
      {#if subtitle}
        <span class="text-xs text-gray block">{subtitle}</span>
      {/if}
    </div>
  {/if}
</div>

<style>
  .block { display: block; }
</style>
