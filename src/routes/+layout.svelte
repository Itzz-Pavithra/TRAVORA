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

  const publicRoutes = ['/', '/login', '/signup'];
  const authOnlyRoutes = ['/login', '/signup'];
  const noNavRoutes = ['/', '/login', '/signup', '/onboarding'];

  const isPublicRoute = $derived(publicRoutes.some(r => $page.url.pathname === r));
  const isAuthOnlyRoute = $derived(authOnlyRoutes.some(r => $page.url.pathname === r));
  const showNav = $derived(!noNavRoutes.some(r => $page.url.pathname === r));

  onMount(() => {
    currentUser.init();
  });

  $effect(() => {
    if (typeof window !== 'undefined') {
      const user = $currentUser;
      const pathname = $page.url.pathname;

      // Only perform routing decisions once Firebase auth initialization completes (user !== undefined)
      if (user !== undefined) {
        if (user === null) {
          // Unauthenticated: if on a protected route, redirect to /login
          if (!isPublicRoute) {
            goto('/login');
          }
        } else {
          // Authenticated: if visiting /login or /signup, redirect to /home
          if (isAuthOnlyRoute) {
            goto('/home');
          }
        }
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
