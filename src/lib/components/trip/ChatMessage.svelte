<script>
  let { msg, currentUserId = '' } = $props();

  const isMe = $derived(msg.senderId === currentUserId);
</script>

<div class="chat-msg-row flex gap-3" class:is-me={isMe}>
  {#if !isMe}
    <div class="avatar avatar-sm flex-shrink-0" style="background: {msg.senderAvatarColor || '#173F35'}; color: white;">
      {msg.senderName ? msg.senderName[0].toUpperCase() : 'U'}
    </div>
  {/if}

  <div class="msg-bubble-wrap" class:align-end={isMe}>
    {#if !isMe}
      <span class="text-xs text-gray font-semibold mb-1 block">{msg.senderName}</span>
    {/if}
    <div class="msg-bubble" class:me-bubble={isMe}>
      <p class="msg-text">{msg.text}</p>
      <span class="msg-time">{new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
  </div>
</div>

<style>
  .chat-msg-row {
    margin-bottom: var(--sp-2);
  }

  .chat-msg-row.is-me {
    justify-content: flex-end;
  }

  .msg-bubble-wrap {
    max-width: 70%;
  }

  .msg-bubble-wrap.align-end {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .msg-bubble {
    background: var(--white);
    border: 1px solid var(--border);
    padding: var(--sp-3) var(--sp-4);
    border-radius: var(--radius-md);
    position: relative;
  }

  .me-bubble {
    background: var(--forest);
    color: var(--white);
    border: none;
  }

  .msg-text {
    font-size: 0.875rem;
    line-height: 1.4;
    margin: 0;
  }

  .msg-time {
    font-size: 0.6875rem;
    opacity: 0.7;
    display: block;
    text-align: right;
    margin-top: 4px;
  }

  .block { display: block; }
  .flex-shrink-0 { flex-shrink: 0; }
</style>
