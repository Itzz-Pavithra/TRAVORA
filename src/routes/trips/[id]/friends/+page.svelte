<script lang="ts">
  import { page } from '$app/stores';
  import { tripService } from '$lib/services/tripService';
  import { notifications } from '$lib/stores';
  import MemberAvatar from '$lib/components/trip/MemberAvatar.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import type { TripMember } from '$lib/types';

  const tripId = $derived($page.params.id);
  
  let members = $state<TripMember[]>([]);
  let showInviteModal = $state(false);
  let inviteName = $state('');
  let inviteEmail = $state('');

  function loadMembers() {
    if (tripId) {
      members = tripService.getMembers(tripId);
    }
  }

  $effect(() => {
    loadMembers();
  });

  function handleInvite() {
    if (!inviteName.trim() || !inviteEmail.trim()) {
      notifications.show('Please provide both name and email.', 'error');
      return;
    }

    const colors = ['#173F35', '#D97745', '#66736F', '#1f5448', '#c4632e'];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];

    tripService.addMember({
      tripId,
      userId: 'user_' + Math.random().toString(36).slice(2, 8),
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      avatarColor,
      role: 'member',
      joinedAt: new Date().toISOString(),
      status: 'active'
    });

    notifications.show(`Invitation sent to ${inviteName}!`);
    inviteName = '';
    inviteEmail = '';
    showInviteModal = false;
    loadMembers();
  }

  function handleRemove(member: TripMember) {
    if (member.role === 'owner') {
      notifications.show('Cannot remove trip owner.', 'error');
      return;
    }
    tripService.removeMember(member.id);
    notifications.show(`Removed ${member.name} from trip.`);
    loadMembers();
  }
</script>

<svelte:head>
  <title>Trip Members & Friends — Travora</title>
</svelte:head>

<div class="friends-tab">
  <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
    <div>
      <h2 class="section-title">👥 Trip Members & Friends</h2>
      <p class="text-xs text-gray">Manage group members, send invitations, and collaborate seamlessly.</p>
    </div>

    <button class="btn btn-primary" onclick={() => showInviteModal = true}>
      + Invite Friends
    </button>
  </div>

  <div class="grid-2 gap-6">
    <div class="card p-6">
      <h3 class="font-bold text-forest mb-4">Current Members ({members.length})</h3>
      
      <div class="members-roster flex-col gap-4">
        {#each members as member (member.id)}
          <div class="member-roster-item card p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <MemberAvatar 
                name={member.name} 
                avatarColor={member.avatarColor} 
                size="md" 
                showName={true} 
                subtitle={member.email}
              />
            </div>

            <div class="flex items-center gap-3">
              <span class="badge {member.role === 'owner' ? 'badge-forest' : 'badge-cream'} text-xs">
                {member.role === 'owner' ? '👑 Owner' : 'Member'}
              </span>

              {#if member.role !== 'owner'}
                <button 
                  class="btn-icon text-gray" 
                  onclick={() => handleRemove(member)}
                  title="Remove from trip"
                  aria-label="Remove member from trip"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="card p-6">
      <h3 class="font-bold text-forest mb-2">Group Collaboration Features</h3>
      <p class="text-xs text-gray mb-6">Every member added to this trip gets instant access to:</p>

      <div class="flex-col gap-4">
        <div class="collab-feature-box">
          <span class="feature-icon">💬</span>
          <div>
            <strong class="text-sm text-forest">Trip Chat</strong>
            <p class="text-xs text-gray">Private messaging space isolated to this group trip.</p>
          </div>
        </div>

        <div class="collab-feature-box">
          <span class="feature-icon">📊</span>
          <div>
            <strong class="text-sm text-forest">Group Polls</strong>
            <p class="text-xs text-gray">Create quick polls to decide meals and sightseeing.</p>
          </div>
        </div>

        <div class="collab-feature-box">
          <span class="feature-icon">💸</span>
          <div>
            <strong class="text-sm text-forest">Travora Split</strong>
            <p class="text-xs text-gray">Automatic tracking of who paid what and debt simplification.</p>
          </div>
        </div>

        <div class="collab-feature-box">
          <span class="feature-icon">📸</span>
          <div>
            <strong class="text-sm text-forest">Shared Memories</strong>
            <p class="text-xs text-gray">Upload and view travel photos in a collaborative gallery.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Invite Modal -->
  {#if showInviteModal}
    <Modal title="Invite a Friend" onclose={() => showInviteModal = false}>
      <form class="flex-col gap-4" onsubmit={(e) => { e.preventDefault(); handleInvite(); }}>
        <div class="input-group">
          <label for="inviteName">Friend's Full Name</label>
          <input 
            id="inviteName"
            type="text" 
            class="input" 
            bind:value={inviteName} 
            placeholder="e.g. Arun Kumar" 
            required 
          />
        </div>

        <div class="input-group">
          <label for="inviteEmail">Email Address</label>
          <input 
            id="inviteEmail"
            type="email" 
            class="input" 
            bind:value={inviteEmail} 
            placeholder="e.g. arun@example.com" 
            required 
          />
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button type="button" class="btn btn-cream" onclick={() => showInviteModal = false}>
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            Send Invitation
          </button>
        </div>
      </form>
    </Modal>
  {/if}
</div>

<style>
  .member-roster-item {
    background: var(--cream);
  }

  .collab-feature-box {
    display: flex;
    align-items: flex-start;
    gap: var(--sp-3);
    padding: var(--sp-3);
    background: var(--cream);
    border-radius: var(--radius-md);
  }

  .feature-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
  }
</style>
