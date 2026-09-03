<script>
  import { page } from '$app/stores';
  import { tripService } from '$lib/services/tripService.js';
  import { currentUser, notifications } from '$lib/stores/index.js';
  import MemberAvatar from '$lib/components/trip/MemberAvatar.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';

  const tripId = $derived($page.params.id);

  let members = $state([]);
  let showInviteModal = $state(false);

  let inviteName = $state('');
  let inviteEmail = $state('');
  let inviteRole = $state('member');

  $effect(() => {
    if (tripId) {
      const unsub = tripService.subscribeToMembers(tripId, data => members = data);
      return () => unsub();
    }
  });

  async function handleInvite() {
    if (!inviteName.trim()) return;

    try {
      await tripService.addMember(tripId, {
        name: inviteName.trim(),
        email: inviteEmail.trim(),
        role: inviteRole,
        avatarColor: '#D97745',
        joinedAt: new Date().toISOString(),
        status: 'active'
      });

      notifications.show(`Invited ${inviteName} to trip! 👥`);
      showInviteModal = false;
      inviteName = '';
      inviteEmail = '';
    } catch (err) {
      notifications.show(`Failed to invite: ${err.message}`, 'error');
    }
  }

  async function handleRemove(member) {
    await tripService.removeMember(tripId, member.id, member.userId);
    notifications.show(`Removed ${member.name} from trip.`);
  }
</script>

<svelte:head>
  <title>Trip Members — Travora</title>
</svelte:head>

<div class="friends-tab">
  <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
    <div>
      <h2 class="section-title">👥 Trip Friends & Collaboration</h2>
      <p class="text-xs text-gray">Manage members, assign permissions, and share trip access.</p>
    </div>

    <button class="btn btn-primary" onclick={() => showInviteModal = true}>
      + Invite Friend
    </button>
  </div>

  <div class="grid-2 gap-4">
    {#each members as member (member.id)}
      <div class="member-card card p-5 flex items-center justify-between">
        <MemberAvatar 
          name={member.name} 
          avatarColor={member.avatarColor || '#173F35'} 
          size="lg" 
          showName={true} 
          subtitle={member.email || (member.role === 'owner' ? 'Trip Owner' : 'Collaborator')}
        />

        <div class="flex items-center gap-3">
          <span class="badge" class:badge-forest={member.role === 'owner'} class:badge-cream={member.role !== 'owner'}>
            {member.role === 'owner' ? 'Owner 👑' : 'Member'}
          </span>

          {#if member.role !== 'owner' && $currentUser?.id !== member.userId}
            <button 
              class="btn-icon text-gray" 
              onclick={() => handleRemove(member)} 
              title="Remove member"
              aria-label="Remove member"
            >
              ✕
            </button>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  {#if showInviteModal}
    <Modal title="Invite Friend to Trip" onclose={() => showInviteModal = false}>
      <form class="flex-col gap-4" onsubmit={(e) => { e.preventDefault(); handleInvite(); }}>
        <div class="input-group">
          <label for="invName">Friend's Name</label>
          <input id="invName" type="text" class="input" bind:value={inviteName} placeholder="e.g. Arun Kumar" required />
        </div>

        <div class="input-group">
          <label for="invEmail">Email Address (Optional)</label>
          <input id="invEmail" type="email" class="input" bind:value={inviteEmail} placeholder="arun@example.com" />
        </div>

        <div class="input-group">
          <label for="invRole">Role</label>
          <select id="invRole" class="input" bind:value={inviteRole}>
            <option value="member">Collaborator (Can add expenses, chat, vote)</option>
            <option value="viewer">Viewer Only</option>
          </select>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button type="button" class="btn btn-cream" onclick={() => showInviteModal = false}>Cancel</button>
          <button type="submit" class="btn btn-primary">Send Invitation</button>
        </div>
      </form>
    </Modal>
  {/if}
</div>
