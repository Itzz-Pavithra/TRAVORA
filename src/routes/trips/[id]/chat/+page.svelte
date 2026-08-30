<script lang="ts">
  import { page } from '$app/stores';
  import { onMount, tick } from 'svelte';
  import { tripService } from '$lib/services/tripService';
  import { currentUser } from '$lib/stores';
  import ChatMessage from '$lib/components/trip/ChatMessage.svelte';
  import type { Message } from '$lib/types';

  const tripId = $derived($page.params.id);
  
  let messages = $state<Message[]>([]);
  let messageInput = $state('');
  let chatScrollContainer: HTMLDivElement | undefined = $state();

  function loadMessages() {
    if (tripId) {
      messages = tripService.getMessages(tripId);
      scrollToBottom();
    }
  }

  $effect(() => {
    loadMessages();
  });

  async function scrollToBottom() {
    await tick();
    if (chatScrollContainer) {
      chatScrollContainer.scrollTop = chatScrollContainer.scrollHeight;
    }
  }

  function handleSend() {
    if (!messageInput.trim()) return;

    tripService.sendMessage({
      tripId,
      userId: $currentUser?.id || 'user_demo',
      userName: $currentUser?.name || 'Pavithra',
      avatarColor: $currentUser?.avatarColor || '#D97745',
      content: messageInput.trim(),
      timestamp: new Date().toISOString(),
      type: 'text'
    });

    messageInput = '';
    loadMessages();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }
</script>

<svelte:head>
  <title>Trip Chat — Travora</title>
</svelte:head>

<div class="chat-tab">
  <div class="flex items-center justify-between mb-4">
    <div>
      <h2 class="section-title">💬 Trip Group Chat</h2>
      <p class="text-xs text-gray">Private discussion space for trip members.</p>
    </div>
  </div>

  <div class="chat-wrapper card">
    <!-- Chat Messages Scroll Area -->
    <div class="chat-messages-scroll" bind:this={chatScrollContainer}>
      <div class="chat-start-badge">
        <span>🔒 This is the start of your private group conversation</span>
      </div>

      {#each messages as msg (msg.id)}
        <ChatMessage 
          message={msg} 
          isOwn={msg.userId === ($currentUser?.id || 'user_demo')} 
        />
      {/each}
    </div>

    <!-- Message Input Bar -->
    <form class="chat-input-bar" onsubmit={(e) => { e.preventDefault(); handleSend(); }}>
      <input 
        type="text" 
        class="input chat-input" 
        bind:value={messageInput}
        onkeydown={handleKeydown}
        placeholder="Type a message to your travel group..." 
      />
      <button type="submit" class="btn btn-primary btn-icon" disabled={!messageInput.trim()} aria-label="Send message">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </form>
  </div>
</div>

<style>
  .chat-wrapper {
    height: 580px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .chat-messages-scroll {
    flex: 1;
    overflow-y: auto;
    padding: var(--sp-6);
    background: var(--cream);
    display: flex;
    flex-direction: column;
  }

  .chat-start-badge {
    text-align: center;
    font-size: 0.75rem;
    color: var(--gray);
    margin-bottom: var(--sp-6);
    background: rgba(102, 115, 111, 0.1);
    padding: var(--sp-2) var(--sp-4);
    border-radius: var(--radius-full);
    align-self: center;
  }

  .chat-input-bar {
    display: flex;
    gap: var(--sp-2);
    padding: var(--sp-4);
    background: var(--white);
    border-top: 1px solid var(--border);
  }

  .chat-input {
    flex: 1;
  }
</style>
