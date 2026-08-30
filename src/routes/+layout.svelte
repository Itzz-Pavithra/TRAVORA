<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { currentUser, trips } from '$lib/stores';
  import { seedIfNeeded } from '$lib/data/mockData';
  import Navbar from '$lib/components/layout/Navbar.svelte';
  import BottomNav from '$lib/components/layout/BottomNav.svelte';
  import ToastContainer from '$lib/components/ui/ToastContainer.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  // Routes that don't need authentication
  const publicRoutes = ['/', '/login', '/signup', '/onboarding'];

  // Routes that should hide the main navbar (use trip nav instead)
  const noNavRoutes = ['/', '/login', '/signup', '/onboarding'];

  const isPublicRoute = $derived(publicRoutes.some(r => $page.url.pathname === r));
  const showNav = $derived(!noNavRoutes.some(r => $page.url.pathname === r));

  onMount(() => {
    // Seed mock data on first launch
    seedIfNeeded();

    // Initialize user store
    currentUser.init();

    // Auth guard — redirect to login if not authenticated
    const user = currentUser;
    if (!isPublicRoute && !$currentUser) {
      goto('/');
    }

    // Load trips if user is authenticated
    if ($currentUser) {
      trips.load($currentUser.id);
    }
  });
</script>

{#if showNav}
  <Navbar />
{/if}

<main>
  {@render children()}
</main>

{#if showNav}
  <BottomNav />
{/if}

<ToastContainer />

<style>
  main {
    min-height: 100vh;
  }
</style>
