<script lang="ts">
  interface Props {
    icon?: string;
    title: string;
    description?: string;
    actionLabel?: string;
    onaction?: () => void;
  }
  let { icon = '🗺️', title, description, actionLabel, onaction }: Props = $props();
</script>

<div class="empty-state">
  <div class="empty-state-icon">{icon}</div>
  <h3>{title}</h3>
  {#if description}
    <p>{description}</p>
  {/if}
  {#if actionLabel && onaction}
    <button class="btn btn-primary mt-4" onclick={onaction}>{actionLabel}</button>
  {/if}
</div>
