<script lang="ts">
  interface Props {
    name: string;
    avatarColor?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showName?: boolean;
    subtitle?: string;
  }

  let { name, avatarColor = '#173F35', size = 'md', showName = false, subtitle }: Props = $props();

  const initials = $derived(
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  );
</script>

<div class="member-avatar-wrap" class:with-name={showName}>
  <div class="avatar avatar-{size}" style="background:{avatarColor}; color:white">
    {initials}
  </div>
  {#if showName}
    <div class="member-info">
      <span class="member-name">{name}</span>
      {#if subtitle}
        <span class="member-sub">{subtitle}</span>
      {/if}
    </div>
  {/if}
</div>

<style>
  .member-avatar-wrap {
    display: inline-flex;
    align-items: center;
  }

  .member-avatar-wrap.with-name {
    gap: var(--sp-3);
  }

  .member-info {
    display: flex;
    flex-direction: column;
  }

  .member-name {
    font-weight: 600;
    font-size: 0.9375rem;
    color: var(--forest);
  }

  .member-sub {
    font-size: 0.75rem;
    color: var(--gray);
  }
</style>
