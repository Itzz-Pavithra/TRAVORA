<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { currentUser } from '$lib/stores/index.js';
  import Navbar from '$lib/components/layout/Navbar.svelte';
  import BottomNav from '$lib/components/layout/BottomNav.svelte';
  import ToastContainer from '$lib/components/ui/ToastContainer.svelte';

  let { children } = $props();

  const publicRoutes = ['/', '/login', '/signup', '/onboarding'];
  const noNavRoutes = ['/', '/login', '/signup', '/onboarding'];

  const isPublicRoute = $derived(publicRoutes.some(r => $page.url.pathname === r));
  const showNav = $derived(!noNavRoutes.some(r => $page.url.pathname === r));

  onMount(() => {
    currentUser.init();
  });

  $effect(() => {
    if (typeof window !== 'undefined') {
      if (!isPublicRoute && $currentUser === null) {
        goto('/login');
      }
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
