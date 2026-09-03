<script>
  import { page } from '$app/stores';
  import { tripService } from '$lib/services/tripService.js';
  import { currentUser } from '$lib/stores/index.js';
  import ChatMessage from '$lib/components/trip/ChatMessage.svelte';

  const tripId = $derived($page.params.id);

  let messages = $state([]);
  let inputMessage = $state('');

  $effect(() => {
    if (tripId) {
      const unsub = tripService.subscribeToMessages(tripId, data => messages = data);
      return () => unsub();
    }
  });

  async function handleSend() {
    if (!inputMessage.trim()) return;
    const text = inputMessage.trim();
    inputMessage = '';

    await tripService.sendMessage(tripId, {
      senderId: $currentUser?.id || 'user_demo',
      senderName: $currentUser?.name || 'Traveler',
      senderAvatarColor: $currentUser?.avatarColor || '#173F35',
      text
    });
  }
</script>

<svelte:head>
  <title>Group Chat — Travora</title>
</svelte:head>

<div class="chat-tab flex-col h-full">
  <div class="mb-4">
    <h2 class="section-title">💬 Real-Time Group Chat</h2>
    <p class="text-xs text-gray">Discuss plans, share links, and coordinate with all trip members.</p>
  </div>

  <div class="chat-messages-box card p-4 flex-1 mb-4">
    {#if messages.length === 0}
      <div class="p-8 text-center text-gray">
        No messages sent yet. Break the ice and start the group chat! 💬
      </div>
    {:else}
      <div class="flex-col gap-3">
        {#each messages as msg (msg.id)}
          <ChatMessage {msg} currentUserId={$currentUser?.id || ''} />
        {/each}
      </div>
    {/if}
  </div>

  <form class="chat-input-bar card p-3 flex gap-2" onsubmit={(e) => { e.preventDefault(); handleSend(); }}>
    <input 
      type="text" 
      class="input flex-1" 
      bind:value={inputMessage} 
      placeholder="Type a message to trip members..." 
    />
    <button type="submit" class="btn btn-primary" disabled={!inputMessage.trim()}>
      Send
    </button>
  </form>
</div>

<style>
  .chat-tab {
    display: flex;
    flex-direction: column;
    height: 70vh;
  }

  .chat-messages-box {
    overflow-y: auto;
    background: var(--cream);
    border: 1.5px solid var(--border);
  }
</style>
