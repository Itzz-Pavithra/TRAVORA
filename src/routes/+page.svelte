<script>
  import { goto } from '$app/navigation';

  const features = [
    {
      icon: '🔍',
      title: 'Discover',
      desc: 'Find destinations, attractions, restaurants and experiences curated for every type of traveler.'
    },
    {
      icon: '📋',
      title: 'Plan',
      desc: 'Build organized day-by-day itineraries with times, locations, notes and estimated costs.'
    },
    {
      icon: '👥',
      title: 'Travel Together',
      desc: 'Invite friends, plan collaboratively, vote on decisions, and chat — all in one trip space.'
    },
    {
      icon: '💸',
      title: 'Split Expenses',
      desc: 'Track who paid what, calculate fair shares, and settle group spending with a tap.'
    },
    {
      icon: '📸',
      title: 'Remember',
      desc: 'Upload photos and videos, build a shared memory gallery, and relive every moment.'
    },
    {
      icon: '🗺️',
      title: 'Memory Map',
      desc: 'See your memories plotted on a visual map timeline of every place you\'ve been.'
    }
  ];

  const stats = [
    { value: '50K+', label: 'Happy Travelers' },
    { value: '12K+', label: 'Trips Planned' },
    { value: '320K+', label: 'Memories Saved' },
    { value: '4.9★', label: 'App Rating' }
  ];

  const testimonials = [
    {
      text: 'Travora made our Goa trip the most organized trip we\'ve ever had. The expense splitting alone saved us so many arguments!',
      name: 'Aarav Singh',
      role: 'Group traveler',
      color: '#173F35'
    },
    {
      text: 'I love the memory timeline. After our Kerala trip, we had a complete visual story of everything we did — day by day.',
      name: 'Meera Nair',
      role: 'Solo explorer',
      color: '#D97745'
    },
    {
      text: 'The group chat and polls feature is genius. No more endless WhatsApp debates about where to eat!',
      name: 'Rohan Mehta',
      role: 'Frequent traveler',
      color: '#66736F'
    }
  ];

  const destinations = [
    { name: 'Goa', tag: 'Beaches', emoji: '🏖️', bg: 'linear-gradient(135deg, #D97745 0%, #173F35 100%)' },
    { name: 'Kerala', tag: 'Nature', emoji: '🌿', bg: 'linear-gradient(135deg, #173F35 0%, #1f5448 100%)' },
    { name: 'Singapore', tag: 'Urban', emoji: '🌃', bg: 'linear-gradient(135deg, #4a5550 0%, #173F35 100%)' },
    { name: 'Bali', tag: 'Culture', emoji: '🌺', bg: 'linear-gradient(135deg, #c4632e 0%, #D97745 100%)' },
  ];

  let headerScrolled = $state(false);

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      headerScrolled = window.scrollY > 40;
    });
  }
</script>

<svelte:head>
  <title>Travora — Your Journey, Simplified.</title>
</svelte:head>

<!-- ====================== HEADER ====================== -->
<header class="landing-header" class:scrolled={headerScrolled}>
  <div class="container">
    <div class="header-inner">
      <a href="/" class="logo">
        <span class="logo-leaf">✦</span>
        <span class="logo-text">Travora</span>
      </a>

      <nav class="header-nav" aria-label="Landing navigation">
        <a href="#features" class="header-link">Discover</a>
        <a href="/trips" class="header-link">Trips</a>
        <a href="#memories" class="header-link">Memories</a>
        <a href="#about" class="header-link">About</a>
      </nav>

      <div class="header-actions">
        <a href="/login" class="btn btn-ghost btn-sm">Log in</a>
        <a href="/signup" class="btn btn-primary btn-sm">Get Started</a>
      </div>

      <!-- Demo quick login -->
      <div class="demo-hint">
        <span class="text-xs text-gray">Demo:</span>
        <button class="btn btn-sm btn-cream" onclick={() => { goto('/home'); }}>
          ✨ Enter App
        </button>
      </div>
    </div>
  </div>
</header>

<!-- ====================== HERO ====================== -->
<section class="hero">
  <div class="hero-bg">
    <div class="hero-gradient"></div>
    <div class="hero-pattern"></div>
  </div>

  <div class="container hero-content">
    <div class="hero-badge">
      <span class="badge-dot"></span>
      Travel Together. Remember Forever.
    </div>

    <h1 class="hero-headline display-serif">
      Your Journey,<br />
      <em class="hero-accent">Simplified.</em>
    </h1>

    <p class="hero-sub">
      Discover places, plan unforgettable trips, travel together,
      and keep every memory in one beautiful place.
    </p>

    <div class="hero-actions">
      <a href="/signup" class="btn btn-accent btn-lg">
        Start Planning
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
      <a href="/discover" class="btn btn-outline btn-lg hero-outline-btn">
        Explore Destinations
      </a>
    </div>

    <div class="hero-stats">
      {#each stats as stat}
        <div class="hero-stat">
          <span class="hero-stat-val">{stat.value}</span>
          <span class="hero-stat-lbl">{stat.label}</span>
        </div>
      {/each}
    </div>
  </div>

  <!-- Floating destination cards -->
  <div class="hero-cards">
    {#each destinations as dest, i}
      <div class="hero-dest-card" style="--delay:{i * 0.15}s; background:{dest.bg}">
        <span class="hero-dest-emoji">{dest.emoji}</span>
        <div class="hero-dest-info">
          <span class="hero-dest-name">{dest.name}</span>
          <span class="hero-dest-tag">{dest.tag}</span>
        </div>
      </div>
    {/each}
  </div>
</section>

<!-- ====================== FEATURES ====================== -->
<section class="section bg-white" id="features">
  <div class="container">
    <div class="section-header text-center">
      <p class="section-label">Everything You Need</p>
      <h2 class="section-title">Plan. Travel. Remember.</h2>
      <p class="section-desc mx-auto">
        From discovering your next destination to preserving every memory — Travora has you covered.
      </p>
    </div>

    <div class="features-grid">
      {#each features as feat, i}
        <div class="feature-card" style="--i:{i}">
          <div class="feature-icon">{feat.icon}</div>
          <h3 class="feature-title">{feat.title}</h3>
          <p class="feature-desc">{feat.desc}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ====================== DIFFERENTIATORS ====================== -->
<section class="section diff-section" id="about">
  <div class="container">
    <div class="diff-layout">
      <div class="diff-text">
        <p class="section-label">What Makes Travora Different</p>
        <h2 class="section-title">Built for the way you actually travel</h2>
        <p class="section-desc">
          Travora isn't just a trip planner. It's a complete travel companion for you and your group —
          from the first idea to the last memory.
        </p>

        <div class="diff-points">
          <div class="diff-point">
            <div class="diff-point-icon">💬</div>
            <div>
              <strong>Trip Chat</strong>
              <p>Private group chat for every trip. No more scattered WhatsApp threads.</p>
            </div>
          </div>
          <div class="diff-point">
            <div class="diff-point-icon">📊</div>
            <div>
              <strong>Smart Expense Split</strong>
              <p>Track every transaction. Settle who owes what — automatically calculated.</p>
            </div>
          </div>
          <div class="diff-point">
            <div class="diff-point-icon">🗳️</div>
            <div>
              <strong>Group Polls</strong>
              <p>Vote on restaurants, activities and plans together without the endless debate.</p>
            </div>
          </div>
          <div class="diff-point">
            <div class="diff-point-icon">🎯</div>
            <div>
              <strong>Travel Fun</strong>
              <p>Destination quizzes, trip challenges, and fun prompts to keep the energy alive.</p>
            </div>
          </div>
        </div>

        <a href="/signup" class="btn btn-primary btn-lg mt-8">
          Start Your Journey
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>

      <div class="diff-visual">
        <div class="mock-app">
          <div class="mock-header">
            <span class="mock-dot red"></span>
            <span class="mock-dot yellow"></span>
            <span class="mock-dot green"></span>
            <span class="mock-app-name">Goa Escape — Chat</span>
          </div>
          <div class="mock-chat">
            <div class="mock-msg left">
              <div class="mock-avatar forest">A</div>
              <div class="mock-bubble">Guys, should we leave at 8? 🚗</div>
            </div>
            <div class="mock-msg right">
              <div class="mock-bubble accent">Yes! 8 sounds perfect 👍</div>
              <div class="mock-avatar terra">P</div>
            </div>
            <div class="mock-msg left">
              <div class="mock-avatar gray">K</div>
              <div class="mock-bubble">Found a restaurant on the beach! 🍤</div>
            </div>
            <div class="mock-poll-card">
              <p class="mock-poll-q">🗳️ Where should we eat tonight?</p>
              <div class="mock-poll-opt active">Britto's — Beach Shack <span>3 votes</span></div>
              <div class="mock-poll-opt">Tito's Street Food <span>1 vote</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ====================== MEMORIES ====================== -->
<section class="section bg-white" id="memories">
  <div class="container">
    <div class="section-header text-center mb-8">
      <p class="section-label">Memories</p>
      <h2 class="section-title">Your story lives here</h2>
      <p class="section-desc mx-auto">
        Upload photos and videos from every trip. Build a shared gallery with your group.
        Revisit every moment through a beautiful timeline.
      </p>
    </div>

    <div class="memory-showcase">
      <div class="memory-tile tile-large" style="background:linear-gradient(135deg,#D97745,#173F35)">
        <div class="tile-overlay"></div>
        <div class="tile-content">
          <span style="font-size:2.5rem">🏖️</span>
          <strong>Baga Beach</strong>
          <span class="text-xs">18 Photos</span>
        </div>
      </div>
      <div class="memory-tile tile-small" style="background:linear-gradient(135deg,#173F35,#1f5448)">
        <div class="tile-overlay"></div>
        <div class="tile-content">
          <span style="font-size:2rem">🏰</span>
          <strong>Fort Aguada</strong>
          <span class="text-xs">11 Photos</span>
        </div>
      </div>
      <div class="memory-tile tile-small" style="background:linear-gradient(135deg,#c4632e,#D97745)">
        <div class="tile-overlay"></div>
        <div class="tile-content">
          <span style="font-size:2rem">🌆</span>
          <strong>Panjim Market</strong>
          <span class="text-xs">23 Photos</span>
        </div>
      </div>
      <div class="memory-tile tile-medium" style="background:linear-gradient(135deg,#4a5550,#173F35)">
        <div class="tile-overlay"></div>
        <div class="tile-content">
          <span style="font-size:2rem">🌊</span>
          <strong>Sunset Cruise</strong>
          <span class="text-xs">8 Videos</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ====================== TESTIMONIALS ====================== -->
<section class="section testimonials-section">
  <div class="container">
    <div class="section-header text-center mb-8">
      <p class="section-label">What Travelers Say</p>
      <h2 class="section-title">Loved by explorers</h2>
    </div>

    <div class="testimonials-grid">
      {#each testimonials as t}
        <div class="testimonial-card card card-body">
          <div class="stars">★★★★★</div>
          <p class="testimonial-text">"{t.text}"</p>
          <div class="testimonial-author">
            <div class="avatar avatar-md" style="background:{t.color};color:white">
              {t.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <strong class="text-forest">{t.name}</strong>
              <p class="text-xs text-gray">{t.role}</p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ====================== CTA ====================== -->
<section class="cta-section">
  <div class="container">
    <div class="cta-box">
      <div class="cta-content">
        <h2 class="cta-title display-serif">Ready to start your journey?</h2>
        <p class="cta-sub">Join thousands of travelers who plan, travel, and remember together with Travora.</p>
        <div class="cta-actions">
          <a href="/signup" class="btn btn-accent btn-lg">
            Get Started — It's Free
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <button class="btn btn-ghost btn-lg cta-ghost-btn" onclick={() => goto('/home')}>
            Explore the App
          </button>
        </div>
      </div>
      <div class="cta-emoji-stack">
        <span>🌏</span><span>✈️</span><span>📸</span><span>👥</span>
      </div>
    </div>
  </div>
</section>

<!-- ====================== FOOTER ====================== -->
<footer class="landing-footer">
  <div class="container">
    <div class="footer-top">
      <div class="footer-brand">
        <a href="/" class="logo">
          <span class="logo-leaf">✦</span>
          <span class="logo-text">Travora</span>
        </a>
        <p class="footer-tagline">Your Journey, Simplified.</p>
      </div>
      <div class="footer-links">
        <div class="footer-col">
          <h6 class="footer-col-title">Product</h6>
          <a href="/discover">Discover</a>
          <a href="/trips">My Trips</a>
          <a href="/memories">Memories</a>
        </div>
        <div class="footer-col">
          <h6 class="footer-col-title">Account</h6>
          <a href="/login">Log In</a>
          <a href="/signup">Sign Up</a>
          <a href="/profile">Profile</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="text-xs text-gray">© 2026 Travora. Built with ✦ for explorers everywhere.</p>
    </div>
  </div>
</footer>

<style>
  /* ---- HEADER ---- */
  .landing-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 500;
    padding: var(--sp-4) 0;
    transition: all var(--transition-fast);
  }

  .landing-header.scrolled {
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(12px);
    box-shadow: var(--shadow-sm);
  }

  .header-inner {
    display: flex;
    align-items: center;
    gap: var(--sp-8);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    text-decoration: none;
  }

  .logo-leaf { font-size: 1rem; color: var(--terracotta); }
  .logo-text {
    font-family: var(--font-serif);
    font-size: 1.375rem;
    font-weight: 700;
    color: var(--white);
    transition: color var(--transition-fast);
  }
  .landing-header.scrolled .logo-text { color: var(--forest); }

  .header-nav {
    display: flex;
    gap: var(--sp-1);
    flex: 1;
  }

  .header-link {
    padding: var(--sp-2) var(--sp-3);
    font-size: 0.9375rem;
    font-weight: 500;
    color: rgba(255,255,255,0.85);
    border-radius: var(--radius-sm);
    text-decoration: none;
    transition: all var(--transition-fast);
  }
  .header-link:hover { color: var(--white); background: rgba(255,255,255,0.15); }
  .landing-header.scrolled .header-link { color: var(--gray); }
  .landing-header.scrolled .header-link:hover { color: var(--forest); background: var(--forest-10); }

  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    margin-left: auto;
  }

  .demo-hint {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
  }

  /* ---- HERO ---- */
  .hero {
    min-height: 100vh;
    background: var(--forest);
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    padding-top: 80px;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
  }

  .hero-gradient {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 70% 50%, rgba(217,119,69,0.25) 0%, transparent 60%),
                radial-gradient(ellipse at 30% 80%, rgba(31,84,72,0.5) 0%, transparent 50%);
  }

  .hero-pattern {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 32px 32px;
  }

  .hero-content {
    position: relative;
    z-index: 10;
    padding-top: var(--sp-16);
    padding-bottom: var(--sp-16);
    max-width: 680px;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    background: rgba(217,119,69,0.2);
    border: 1px solid rgba(217,119,69,0.4);
    color: var(--terracotta-light);
    padding: var(--sp-2) var(--sp-4);
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    margin-bottom: var(--sp-6);
  }

  .badge-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--terracotta);
    animation: pulse 2s ease infinite;
  }

  .hero-headline {
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 700;
    color: var(--white);
    line-height: 1.1;
    margin-bottom: var(--sp-6);
    letter-spacing: -0.02em;
  }

  .hero-accent {
    color: var(--terracotta);
    font-style: italic;
  }

  .hero-sub {
    font-size: 1.125rem;
    color: rgba(255,255,255,0.75);
    line-height: 1.65;
    max-width: 560px;
    margin-bottom: var(--sp-8);
  }

  .hero-actions {
    display: flex;
    align-items: center;
    gap: var(--sp-4);
    flex-wrap: wrap;
    margin-bottom: var(--sp-12);
  }

  .hero-outline-btn {
    border-color: rgba(255,255,255,0.4);
    color: var(--white);
  }
  .hero-outline-btn:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.7);
  }

  .hero-stats {
    display: flex;
    gap: var(--sp-8);
    flex-wrap: wrap;
  }

  .hero-stat {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .hero-stat-val {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--white);
    font-family: var(--font-serif);
  }

  .hero-stat-lbl {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.6);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .hero-cards {
    position: absolute;
    right: 5%;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
    z-index: 10;
  }

  .hero-dest-card {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    padding: var(--sp-3) var(--sp-4);
    border-radius: var(--radius-lg);
    width: 200px;
    animation: slideInRight 0.6s ease both;
    animation-delay: var(--delay);
    box-shadow: var(--shadow-lg);
    border: 1px solid rgba(255,255,255,0.15);
  }

  .hero-dest-emoji { font-size: 1.75rem; }

  .hero-dest-info {
    display: flex;
    flex-direction: column;
  }

  .hero-dest-name {
    font-weight: 700;
    font-size: 0.9375rem;
    color: var(--white);
  }

  .hero-dest-tag {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.7);
  }

  /* ---- FEATURES ---- */
  .bg-white { background: var(--white); }

  .section-header { margin-bottom: var(--sp-12); }
  .mx-auto { margin-left: auto; margin-right: auto; }
  .mb-8 { margin-bottom: var(--sp-8); }
  .mt-8 { margin-top: var(--sp-8); }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--sp-5);
  }

  .feature-card {
    background: var(--cream);
    border-radius: var(--radius-lg);
    padding: var(--sp-6);
    transition: transform var(--transition-normal), box-shadow var(--transition-normal);
    animation: slideUp 0.5s ease both;
    animation-delay: calc(var(--i) * 0.08s);
  }

  .feature-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
  }

  .feature-icon {
    font-size: 2rem;
    margin-bottom: var(--sp-4);
  }

  .feature-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--forest);
    margin-bottom: var(--sp-2);
  }

  .feature-desc {
    font-size: 0.9rem;
    color: var(--gray);
    line-height: 1.6;
  }

  /* ---- DIFFERENTIATORS ---- */
  .diff-section {
    background: var(--cream);
  }

  .diff-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sp-16);
    align-items: center;
  }

  .diff-points {
    display: flex;
    flex-direction: column;
    gap: var(--sp-5);
    margin-top: var(--sp-8);
  }

  .diff-point {
    display: flex;
    gap: var(--sp-4);
    align-items: flex-start;
  }

  .diff-point-icon {
    font-size: 1.5rem;
    width: 44px;
    height: 44px;
    background: var(--white);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: var(--shadow-sm);
  }

  .diff-point strong {
    font-size: 1rem;
    color: var(--forest);
    display: block;
    margin-bottom: var(--sp-1);
  }

  .diff-point p {
    font-size: 0.875rem;
    margin: 0;
  }

  /* ---- MOCK APP ---- */
  .mock-app {
    background: var(--white);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    overflow: hidden;
    border: 1px solid var(--border);
  }

  .mock-header {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    padding: var(--sp-3) var(--sp-4);
    background: var(--forest);
    color: rgba(255,255,255,0.6);
    font-size: 0.8125rem;
    font-weight: 600;
  }

  .mock-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  .mock-dot.red    { background: #ff5f56; }
  .mock-dot.yellow { background: #ffbd2e; }
  .mock-dot.green  { background: #27c93f; }
  .mock-app-name   { margin-left: var(--sp-2); color: rgba(255,255,255,0.8); }

  .mock-chat {
    padding: var(--sp-4);
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }

  .mock-msg {
    display: flex;
    align-items: flex-end;
    gap: var(--sp-2);
  }

  .mock-msg.right { flex-direction: row-reverse; }

  .mock-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.6875rem;
    font-weight: 700;
    color: white;
    flex-shrink: 0;
  }
  .mock-avatar.forest { background: var(--forest); }
  .mock-avatar.terra  { background: var(--terracotta); }
  .mock-avatar.gray   { background: var(--gray); }

  .mock-bubble {
    background: var(--cream);
    color: var(--forest);
    padding: var(--sp-2) var(--sp-3);
    border-radius: var(--radius-md) var(--radius-md) var(--radius-md) 2px;
    font-size: 0.8125rem;
    max-width: 200px;
    line-height: 1.4;
  }

  .mock-bubble.accent {
    background: var(--terracotta);
    color: white;
    border-radius: var(--radius-md) var(--radius-md) 2px var(--radius-md);
  }

  .mock-poll-card {
    background: var(--cream);
    border-radius: var(--radius-md);
    padding: var(--sp-3) var(--sp-4);
    border-left: 3px solid var(--terracotta);
  }

  .mock-poll-q {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--forest);
    margin-bottom: var(--sp-2);
  }

  .mock-poll-opt {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--gray);
    padding: var(--sp-1) var(--sp-2);
    border-radius: var(--radius-sm);
    margin-bottom: var(--sp-1);
  }

  .mock-poll-opt.active {
    background: var(--forest-10);
    color: var(--forest);
    font-weight: 600;
  }

  /* ---- MEMORY SHOWCASE ---- */
  .memory-showcase {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: 200px 200px;
    gap: var(--sp-3);
    border-radius: var(--radius-xl);
    overflow: hidden;
  }

  .memory-tile {
    position: relative;
    border-radius: var(--radius-lg);
    overflow: hidden;
    cursor: pointer;
    transition: transform var(--transition-normal);
  }

  .memory-tile:hover { transform: scale(1.02); }

  .tile-large { grid-row: span 2; }
  .tile-medium { grid-column: span 1; }

  .tile-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(23,63,53,0.6) 0%, transparent 60%);
  }

  .tile-content {
    position: absolute;
    bottom: var(--sp-4);
    left: var(--sp-4);
    color: white;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .tile-content strong {
    font-size: 0.9375rem;
    font-weight: 700;
  }

  /* ---- TESTIMONIALS ---- */
  .testimonials-section { background: var(--cream); }

  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--sp-5);
  }

  .stars {
    color: var(--terracotta);
    font-size: 1rem;
    letter-spacing: 2px;
    margin-bottom: var(--sp-3);
  }

  .testimonial-text {
    font-size: 0.9375rem;
    color: var(--gray-dark);
    line-height: 1.65;
    font-style: italic;
    margin-bottom: var(--sp-5);
  }

  .testimonial-author {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
  }

  /* ---- CTA ---- */
  .cta-section {
    background: var(--forest);
    padding: var(--sp-20) 0;
  }

  .cta-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-8);
  }

  .cta-title {
    font-size: clamp(1.75rem, 3.5vw, 2.75rem);
    color: var(--white);
    margin-bottom: var(--sp-4);
    font-weight: 700;
  }

  .cta-sub {
    font-size: 1.0625rem;
    color: rgba(255,255,255,0.7);
    max-width: 480px;
    margin-bottom: var(--sp-8);
  }

  .cta-actions {
    display: flex;
    gap: var(--sp-4);
    flex-wrap: wrap;
  }

  .cta-ghost-btn {
    color: rgba(255,255,255,0.8);
  }
  .cta-ghost-btn:hover { background: rgba(255,255,255,0.1); color: white; }

  .cta-emoji-stack {
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
    font-size: 3rem;
  }

  /* ---- FOOTER ---- */
  .landing-footer {
    background: var(--forest-dark);
    padding: var(--sp-12) 0 var(--sp-8);
  }

  .footer-top {
    display: flex;
    gap: var(--sp-16);
    margin-bottom: var(--sp-8);
  }

  .footer-brand { flex: 1; }
  .footer-tagline {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.5);
    margin-top: var(--sp-3);
  }

  .landing-footer .logo-text { color: var(--white); }

  .footer-links {
    display: flex;
    gap: var(--sp-12);
  }

  .footer-col {
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }

  .footer-col-title {
    color: rgba(255,255,255,0.5);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: var(--sp-1);
  }

  .footer-col a {
    color: rgba(255,255,255,0.7);
    font-size: 0.9rem;
    text-decoration: none;
    transition: color var(--transition-fast);
  }
  .footer-col a:hover { color: var(--white); }

  .footer-bottom {
    padding-top: var(--sp-6);
    border-top: 1px solid rgba(255,255,255,0.1);
  }

  .footer-bottom p {
    color: rgba(255,255,255,0.4);
  }

  /* ---- RESPONSIVE ---- */
  @media (max-width: 1024px) {
    .hero-cards { display: none; }
    .diff-layout { grid-template-columns: 1fr; }
    .features-grid { grid-template-columns: repeat(2, 1fr); }
    .testimonials-grid { grid-template-columns: repeat(2, 1fr); }
    .memory-showcase { grid-template-columns: 1fr 1fr; grid-template-rows: auto; }
    .tile-large { grid-row: auto; }
  }

  @media (max-width: 768px) {
    .header-nav { display: none; }
    .header-actions .btn-ghost { display: none; }
    .features-grid { grid-template-columns: 1fr; }
    .testimonials-grid { grid-template-columns: 1fr; }
    .cta-box { flex-direction: column; text-align: center; }
    .cta-emoji-stack { flex-direction: row; }
    .footer-top { flex-direction: column; gap: var(--sp-8); }
    .footer-links { flex-wrap: wrap; gap: var(--sp-8); }
    .hero-stats { gap: var(--sp-5); }
    .memory-showcase { grid-template-columns: 1fr; }
    .demo-hint { display: none; }
  }

  @media (max-width: 480px) {
    .hero-headline { font-size: 2.25rem; }
    .hero-actions { flex-direction: column; align-items: flex-start; }
  }
</style>
