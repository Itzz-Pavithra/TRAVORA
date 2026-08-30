<script lang="ts">
  import { page } from '$app/stores';
  import { notifications } from '$lib/stores';

  const tripId = $derived($page.params.id);

  // Travel Quiz State
  let quizAnswered = $state(false);
  let selectedQuizOption = $state<number | null>(null);
  const quizQuestion = {
    q: 'Which famous church in Old Goa houses the mortal remains of St. Francis Xavier?',
    options: ['Se Cathedral', 'Basilica of Bom Jesus', 'Church of St. Cajetan', 'Mae De Deus Church'],
    correct: 1
  };

  // Group Challenges State
  let challenges = $state([
    { id: 'c1', title: 'Sunset Silhouette Photo', desc: 'Capture a creative group silhouette during sunset.', done: true },
    { id: 'c2', title: 'Local Cuisine Explorer', desc: 'Try a traditional authentic local dish together.', done: true },
    { id: 'c3', title: 'Hidden Gem Discovery', desc: 'Find a quiet corner or viewpoint away from crowds.', done: false },
    { id: 'c4', title: 'Early Morning Stroll', desc: 'Wake up before 7 AM for a beach or countryside walk.', done: false }
  ]);

  // Fun Prompts State
  let promptVotes = $state<Record<string, string>>({
    p1: 'Arun',
    p2: 'Pavithra',
    p3: 'Karthik'
  });

  const prompts = [
    { id: 'p1', question: '🧭 Who is most likely to get lost?' },
    { id: 'p2', question: '📋 Who planned the trip best?' },
    { id: 'p3', question: '📸 Who took the best photo of the day?' }
  ];

  function toggleChallenge(id: string) {
    challenges = challenges.map(c => c.id === id ? { ...c, done: !c.done } : c);
    notifications.show('Challenge updated!');
  }

  function handleQuizSubmit(idx: number) {
    selectedQuizOption = idx;
    quizAnswered = true;
    if (idx === quizQuestion.correct) {
      notifications.show('🎉 Correct! Basilica of Bom Jesus is a UNESCO World Heritage site.');
    } else {
      notifications.show('Almost! The correct answer is Basilica of Bom Jesus.', 'info');
    }
  }

  function votePrompt(promptId: string, name: string) {
    promptVotes[promptId] = name;
    notifications.show(`Voted for ${name}!`);
  }
</script>

<svelte:head>
  <title>Travel Fun & Games — Travora</title>
</svelte:head>

<div class="fun-tab">
  <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
    <div>
      <h2 class="section-title">🎮 Travel Fun, Quizzes & Challenges</h2>
      <p class="text-xs text-gray">Interactive group games, destination trivia, and photography quests.</p>
    </div>
  </div>

  <div class="grid-3 gap-6">
    <!-- Travel Quiz (1 col) -->
    <div class="card p-6 flex-col justify-between">
      <div>
        <span class="badge badge-terracotta text-xs mb-3">🧠 Destination Trivia</span>
        <h3 class="text-forest font-bold mb-4">{quizQuestion.q}</h3>

        <div class="flex-col gap-2">
          {#each quizQuestion.options as opt, i}
            <button 
              class="quiz-option-btn" 
              class:selected={selectedQuizOption === i}
              class:correct={quizAnswered && i === quizQuestion.correct}
              class:wrong={quizAnswered && selectedQuizOption === i && i !== quizQuestion.correct}
              disabled={quizAnswered}
              onclick={() => handleQuizSubmit(i)}
            >
              <span>{opt}</span>
              {#if quizAnswered && i === quizQuestion.correct}
                <span>✓</span>
              {/if}
            </button>
          {/each}
        </div>
      </div>

      {#if quizAnswered}
        <div class="mt-4 pt-3 border-t text-xs text-gray">
          Trivia refreshes with new destination facts every day!
        </div>
      {/if}
    </div>

    <!-- Trip Challenges (1 col) -->
    <div class="card p-6">
      <span class="badge badge-forest text-xs mb-3">🎯 Group Quests</span>
      <h3 class="text-forest font-bold mb-4">Trip Challenges</h3>

      <div class="flex-col gap-3">
        {#each challenges as chal}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div 
            class="challenge-card card p-3" 
            class:completed={chal.done}
            onclick={() => toggleChallenge(chal.id)}
          >
            <div class="flex items-start gap-3">
              <input type="checkbox" checked={chal.done} class="challenge-checkbox" />
              <div>
                <strong class="text-sm text-forest" class:strikethrough={chal.done}>{chal.title}</strong>
                <p class="text-xs text-gray">{chal.desc}</p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Fun Prompts (1 col) -->
    <div class="card p-6">
      <span class="badge badge-cream text-xs mb-3">🏆 Superlatives</span>
      <h3 class="text-forest font-bold mb-4">Fun Prompts</h3>

      <div class="flex-col gap-4">
        {#each prompts as p}
          <div class="prompt-box card p-3">
            <strong class="text-xs text-forest block mb-2">{p.question}</strong>
            <div class="flex gap-2 flex-wrap">
              {#each ['Pavithra', 'Arun', 'Priya', 'Karthik', 'Divya'] as name}
                <button 
                  class="chip text-xs" 
                  class:active={promptVotes[p.id] === name}
                  onclick={() => votePrompt(p.id, name)}
                >
                  {name}
                </button>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .quiz-option-btn {
    width: 100%;
    text-align: left;
    background: var(--cream);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-md);
    padding: var(--sp-3);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--forest);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all var(--transition-fast);
  }

  .quiz-option-btn:hover:not(:disabled) {
    background: var(--cream-dark);
    border-color: var(--forest);
  }

  .quiz-option-btn.correct {
    background: rgba(23, 63, 53, 0.15);
    border-color: var(--forest);
    color: var(--forest);
    font-weight: 700;
  }

  .quiz-option-btn.wrong {
    background: rgba(217, 119, 69, 0.15);
    border-color: var(--terracotta);
    color: var(--terracotta-dark);
  }

  .challenge-card {
    background: var(--cream);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .challenge-card.completed {
    opacity: 0.75;
    background: var(--cream-dark);
  }

  .challenge-checkbox {
    accent-color: var(--forest);
    margin-top: 3px;
  }

  .strikethrough {
    text-decoration: line-through;
  }

  .prompt-box {
    background: var(--cream);
  }

  .border-t {
    border-top: 1px solid var(--border);
  }
</style>
