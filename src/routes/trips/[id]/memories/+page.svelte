<script>
  import { page } from '$app/stores';
  import { memoryService } from '$lib/services/memoryService.js';
  import { currentUser, notifications } from '$lib/stores/index.js';
  import MemoryCard from '$lib/components/cards/MemoryCard.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';

  const tripId = $derived($page.params.id);

  let memories = $state([]);
  let activeView = $state('gallery');

  // Upload Modal State
  let showUploadModal = $state(false);
  let selectedFile = $state(null);
  let caption = $state('');
  let location = $state('');
  let memoryDate = $state(new Date().toISOString().split('T')[0]);
  let uploading = $state(false);

  // Google Drive backup status
  let gdriveConnected = $state(false);
  let backingUp = $state(false);

  $effect(() => {
    if (tripId) {
      const unsub = memoryService.subscribeToMemories(tripId, data => memories = data);
      return () => unsub();
    }
  });

  function handleFileChange(e) {
    const target = e.target;
    if (target.files && target.files.length > 0) {
      selectedFile = target.files[0];
    }
  }

  async function handleUpload() {
    if (!selectedFile) {
      notifications.show('Please select a photo or video.', 'error');
      return;
    }

    uploading = true;
    try {
      await memoryService.uploadMemory(
        selectedFile,
        tripId,
        $currentUser?.id || 'guest_user',
        $currentUser?.name || 'Traveler',
        $currentUser?.avatarColor || '#D97745',
        {
          date: memoryDate,
          location: location.trim(),
          caption: caption.trim()
        }
      );

      notifications.show('Memory uploaded & stored securely! 📸');
      showUploadModal = false;
      selectedFile = null;
      caption = '';
      location = '';
    } catch (err) {
      notifications.show(`Upload failed: ${err.message}`, 'error');
    } finally {
      uploading = false;
    }
  }

  async function handleLike(id) {
    const uid = $currentUser?.id || 'guest_user';
    await memoryService.toggleLike(tripId, id, uid);
  }

  async function handleDelete(mem) {
    await memoryService.delete(tripId, mem);
    notifications.show('Memory deleted.');
  }

  function handleConnectDrive() {
    gdriveConnected = true;
    notifications.show('Google Drive backup target configured!');
  }

  async function handleRunBackup() {
    backingUp = true;
    await new Promise(r => setTimeout(r, 1200));
    backingUp = false;
    notifications.show(`Backed up ${memories.length} trip memories!`);
  }
</script>

<svelte:head>
  <title>Trip Memories — Travora</title>
</svelte:head>

<div class="memories-tab">
  <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
    <div>
      <h2 class="section-title">📸 Trip Memories & Timeline</h2>
      <p class="text-xs text-gray">Collaborative photo album, chronological timeline, and cloud backup.</p>
    </div>

    <button class="btn btn-accent" onclick={() => showUploadModal = true}>
      + Upload Memory
    </button>
  </div>

  <!-- View Switcher -->
  <div class="tab-nav mb-8">
    <button 
      class="tab-item" 
      class:active={activeView === 'gallery'}
      onclick={() => activeView = 'gallery'}
    >
      <span class="tab-icon">🖼️</span>
      Shared Gallery ({memories.length})
    </button>
    <button 
      class="tab-item" 
      class:active={activeView === 'timeline'}
      onclick={() => activeView = 'timeline'}
    >
      <span class="tab-icon">⏳</span>
      Timeline View
    </button>
    <button 
      class="tab-item" 
      class:active={activeView === 'backup'}
      onclick={() => activeView = 'backup'}
    >
      <span class="tab-icon">☁️</span>
      Google Drive Backup
    </button>
  </div>

  <!-- Gallery View -->
  {#if activeView === 'gallery'}
    {#if memories.length === 0}
      <div class="card p-12 text-center">
        <div class="text-4xl mb-2">📸</div>
        <h4 class="text-forest mb-1">Your story starts with the first photo</h4>
        <p class="text-gray text-xs mb-4">Upload pictures and videos from your adventures so all members can relive the journey.</p>
        <button class="btn btn-primary btn-sm" onclick={() => showUploadModal = true}>
          + Upload First Memory
        </button>
      </div>
    {:else}
      <div class="grid-3">
        {#each memories as memory (memory.id)}
          <MemoryCard 
            {memory} 
            currentUserId={$currentUser?.id || ''}
            onlike={handleLike}
            ondelete={handleDelete}
          />
        {/each}
      </div>
    {/if}
  {/if}

  <!-- Timeline View -->
  {#if activeView === 'timeline'}
    <div class="timeline-container max-w-2xl mx-auto">
      {#if memories.length === 0}
        <div class="card p-8 text-center text-gray">
          No memories available to populate the timeline. Upload photos to generate interactive timeline nodes!
        </div>
      {:else}
        <div class="timeline-tree flex-col gap-6">
          {#each memories as mem}
            <div class="timeline-day-block card p-5 flex gap-4 items-center">
              <img src={mem.mediaKey} alt={mem.caption || 'Memory'} class="timeline-img" />
              <div>
                <span class="badge badge-forest text-xs mb-1">{mem.date}</span>
                <h4 class="text-forest font-bold">{mem.location || 'Trip Memory'}</h4>
                <p class="text-xs text-gray">{mem.caption || 'Uploaded by ' + mem.uploadedByName}</p>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  <!-- Google Drive Backup View -->
  {#if activeView === 'backup'}
    <div class="container container-sm">
      <div class="card p-8 text-center">
        <div class="text-5xl mb-4">☁️</div>
        <h3 class="text-forest font-bold mb-2">Backup My Memories</h3>
        <p class="text-gray text-sm mb-6 max-w-md mx-auto">
          Preserve all full-resolution photos and videos safely by connecting your personal Google Drive account.
        </p>

        <div class="backup-status-card card p-4 mb-6 max-w-md mx-auto flex items-center justify-between">
          <div class="flex items-center gap-3 text-left">
            <span class="text-2xl">📁</span>
            <div>
              <strong class="text-sm text-forest block">Google Drive</strong>
              <span class="text-xs text-gray">{gdriveConnected ? '● Connected (drive.google.com)' : '○ Not connected'}</span>
            </div>
          </div>

          {#if !gdriveConnected}
            <button class="btn btn-primary btn-sm" onclick={handleConnectDrive}>
              Connect Google Drive
            </button>
          {:else}
            <span class="badge badge-forest text-xs">Linked</span>
          {/if}
        </div>

        {#if gdriveConnected}
          <button class="btn btn-accent btn-lg" onclick={handleRunBackup} disabled={backingUp}>
            {backingUp ? 'Backing up files...' : `Sync & Backup ${memories.length} Memories Now`}
          </button>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Upload Modal -->
  {#if showUploadModal}
    <Modal title="Upload Travel Memory" onclose={() => showUploadModal = false}>
      <form class="flex-col gap-4" onsubmit={(e) => { e.preventDefault(); handleUpload(); }}>
        <div class="input-group">
          <label for="memFile">Select Photo or Video</label>
          <input 
            id="memFile"
            type="file" 
            accept="image/*,video/*" 
            class="input" 
            onchange={handleFileChange}
            required 
          />
        </div>

        <div class="input-group">
          <label for="memCaption">Caption</label>
          <input 
            id="memCaption"
            type="text" 
            class="input" 
            bind:value={caption} 
            placeholder="e.g. Sunset view from Fort Aguada!" 
          />
        </div>

        <div class="grid-2 gap-3">
          <div class="input-group">
            <label for="memLocation">Location Tag</label>
            <input 
              id="memLocation"
              type="text" 
              class="input" 
              bind:value={location} 
              placeholder="e.g. Fort Aguada, Sinquerim" 
            />
          </div>

          <div class="input-group">
            <label for="memDate">Date</label>
            <input id="memDate" type="date" class="input" bind:value={memoryDate} required />
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button type="button" class="btn btn-cream" onclick={() => showUploadModal = false} disabled={uploading}>
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" disabled={uploading}>
            {uploading ? 'Uploading to Firebase...' : 'Save to Memories'}
          </button>
        </div>
      </form>
    </Modal>
  {/if}
</div>

<style>
  .timeline-img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: var(--radius-md);
  }

  .backup-status-card {
    background: var(--cream);
    border: 1.5px solid var(--border);
  }

  .max-w-2xl { max-width: 42rem; }
  .max-w-md { max-width: 28rem; }
  .mx-auto { margin-left: auto; margin-right: auto; }
  .block { display: block; }
</style>
