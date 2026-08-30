<script lang="ts">
  import type { Message } from '$lib/types';

  interface Props {
    message: Message;
    isOwn: boolean;
  }

  let { message, isOwn }: Props = $props();

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  }
</script>

<div class="chat-message-row" class:own={isOwn}>
  {#if !isOwn}
    <div class="avatar avatar-sm flex-shrink-0" style="background:{message.avatarColor}; color:white">
      {message.userName ? message.userName[0].toUpperCase() : 'U'}
    </div>
  {/if}

  <div class="message-body">
    {#if !isOwn}
      <span class="sender-name">{message.userName}</span>
    {/if}
    <div class="message-bubble" class:own-bubble={isOwn}>
      <p class="message-text">{message.content}</p>
      <span class="message-time">{formatTime(message.timestamp)}</span>
    </div>
  </div>

  {#if isOwn}
    <div class="avatar avatar-sm flex-shrink-0" style="background:{message.avatarColor}; color:white">
      {message.userName ? message.userName[0].toUpperCase() : 'U'}
    </div>
  {/if}
</div>

<style>
  .chat-message-row {
    display: flex;
    align-items: flex-end;
    gap: var(--sp-2);
    margin-bottom: var(--sp-3);
  }

  .chat-message-row.own {
    justify-content: flex-end;
  }

  .message-body {
    display: flex;
    flex-direction: column;
    max-width: 70%;
  }

  .chat-message-row.own .message-body {
    align-items: flex-end;
  }

  .sender-name {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--gray);
    margin-bottom: 2px;
    margin-left: var(--sp-2);
  }

  .message-bubble {
    background: var(--white);
    padding: var(--sp-3) var(--sp-4);
    border-radius: var(--radius-lg) var(--radius-lg) var(--radius-lg) 2px;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border);
    position: relative;
  }

  .message-bubble.own-bubble {
    background: var(--forest);
    color: var(--white);
    border-radius: var(--radius-lg) var(--radius-lg) 2px var(--radius-lg);
    border-color: var(--forest);
  }

  .message-text {
    font-size: 0.9375rem;
    line-height: 1.45;
    color: inherit;
    margin: 0;
    word-break: break-word;
  }

  .message-time {
    font-size: 0.6875rem;
    color: var(--gray-light);
    display: block;
    text-align: right;
    margin-top: 4px;
  }

  .message-bubble.own-bubble .message-time {
    color: rgba(255, 255, 255, 0.7);
  }
</style>
