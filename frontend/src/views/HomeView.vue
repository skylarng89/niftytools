<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero__container">
        <div class="hero__content animate-fade-in">
          <h1 class="hero__title">
            Developer's
            <span class="gradient-text">Swiss Army Knife</span>
          </h1>
          <p class="hero__subtitle">
            A collection of powerful utilities to streamline your development workflow.
            Fast, private, and beautifully designed.
          </p>
          <div class="hero__actions">
            <GradientButton variant="primary" size="lg" @click="$router.push('/text-tools')">
              Get Started
              <template #icon><i class="ti ti-arrow-right"></i></template>
            </GradientButton>
            <GradientButton variant="outline" size="lg" @click="$router.push('/about')">
              Learn More
            </GradientButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
      <div class="stats__container">
        <GlassCard variant="elevated" padding="xl">
          <div class="stats__grid">
            <div class="stat-item">
              <div class="stat-item__value gradient-text">{{ stats.tools }}+</div>
              <div class="stat-item__label">Tools Available</div>
            </div>
            <div class="stat-item">
              <div class="stat-item__value gradient-text-secondary">{{ stats.algorithms }}+</div>
              <div class="stat-item__label">Algorithms</div>
            </div>
            <div class="stat-item">
              <div class="stat-item__value gradient-text">100%</div>
              <div class="stat-item__label">Private</div>
            </div>
            <div class="stat-item">
              <div class="stat-item__value gradient-text-secondary">{{ stats.speed }}ms</div>
              <div class="stat-item__label">Avg Response</div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="features__container">
        <div class="features__header">
          <h2 class="features__title">Available Tools</h2>
          <p class="features__subtitle">
            Powerful utilities designed for developers, by developers
          </p>
        </div>

        <div class="features__grid">
          <!-- Text Tools Card -->
          <GlassCard variant="elevated" padding="xl" hoverable clickable @click="$router.push('/text-tools')"
            class="feature-card">
            <div class="feature-card__icon">
              <div class="feature-card__icon-bg">
                <i class="ti ti-file-text feature-card__icon-symbol"></i>
              </div>
            </div>
            <h3 class="feature-card__title">Text Tools</h3>
            <p class="feature-card__description">
              Sort, format, and manipulate text with powerful algorithms.
              Supports file uploads and multiple export formats.
            </p>
            <ul class="feature-card__features">
              <li><i class="ti ti-check"></i> Multiple sorting algorithms</li>
              <li><i class="ti ti-check"></i> File upload support (TXT, CSV)</li>
              <li><i class="ti ti-check"></i> Export to CSV & JSON</li>
              <li><i class="ti ti-check"></i> Remove duplicates & empty lines</li>
            </ul>
            <div class="feature-card__action">
              <span class="feature-card__link">
                Explore Text Tools
                <i class="ti ti-arrow-right feature-card__arrow"></i>
              </span>
            </div>
          </GlassCard>

          <!-- Coming Soon Card 1 -->
          <GlassCard variant="subtle" padding="xl" class="feature-card feature-card--coming-soon">
            <div class="feature-card__icon">
              <div class="feature-card__icon-bg feature-card__icon-bg--muted">
                <i class="ti ti-lock feature-card__icon-symbol"></i>
              </div>
            </div>
            <h3 class="feature-card__title">Encryption Tools</h3>
            <p class="feature-card__description">
              Encrypt and decrypt text using various algorithms.
              Hash generation and verification.
            </p>
            <div class="feature-card__badge">Coming Soon</div>
          </GlassCard>

          <!-- Coming Soon Card 2 -->
          <GlassCard variant="subtle" padding="xl" class="feature-card feature-card--coming-soon">
            <div class="feature-card__icon">
              <div class="feature-card__icon-bg feature-card__icon-bg--muted">
                <i class="ti ti-palette feature-card__icon-symbol"></i>
              </div>
            </div>
            <h3 class="feature-card__title">Color Tools</h3>
            <p class="feature-card__description">
              Color palette generation, conversion between formats,
              and accessibility checking.
            </p>
            <div class="feature-card__badge">Coming Soon</div>
          </GlassCard>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="benefits">
      <div class="benefits__container">
        <div class="benefits__header">
          <h2 class="benefits__title">Why NiftyTools?</h2>
          <p class="benefits__subtitle">
            Built with modern technology and developer experience in mind
          </p>
        </div>

        <div class="benefits__grid">
          <div class="benefit-item">
            <div class="benefit-item__icon"><i class="ti ti-bolt"></i></div>
            <h3 class="benefit-item__title">Lightning Fast</h3>
            <p class="benefit-item__description">
              Optimized algorithms and modern architecture ensure instant results,
              no matter the data size.
            </p>
          </div>

          <div class="benefit-item">
            <div class="benefit-item__icon"><i class="ti ti-lock"></i></div>
            <h3 class="benefit-item__title">100% Private</h3>
            <p class="benefit-item__description">
              All processing happens locally. Your data never leaves your machine,
              ensuring complete privacy.
            </p>
          </div>

          <div class="benefit-item">
            <div class="benefit-item__icon"><i class="ti ti-target"></i></div>
            <h3 class="benefit-item__title">Developer Focused</h3>
            <p class="benefit-item__description">
              Built by developers for developers. Clean interface, keyboard shortcuts,
              and powerful features.
            </p>
          </div>

          <div class="benefit-item">
            <div class="benefit-item__icon"><i class="ti ti-rocket"></i></div>
            <h3 class="benefit-item__title">Modern Stack</h3>
            <p class="benefit-item__description">
              Built with Vue 3, FastAPI, and microservices architecture for
              reliability and performance.
            </p>
          </div>

          <div class="benefit-item">
            <div class="benefit-item__icon"><i class="ti ti-device-mobile"></i></div>
            <h3 class="benefit-item__title">Responsive Design</h3>
            <p class="benefit-item__description">
              Works seamlessly on desktop, tablet, and mobile devices with
              a beautiful, modern interface.
            </p>
          </div>

          <div class="benefit-item">
            <div class="benefit-item__icon"><i class="ti ti-refresh"></i></div>
            <h3 class="benefit-item__title">Always Improving</h3>
            <p class="benefit-item__description">
              Regular updates with new features, improvements, and bug fixes
              based on user feedback.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import GlassCard from '../components/GlassCard.vue'
  import GradientButton from '../components/GradientButton.vue'

  const stats = ref({
    tools: 5,
    algorithms: 10,
    speed: 50
  })
</script>

<style scoped>
  .home-view {
    width: 100%;
  }

  /* ============================================
   HERO SECTION
   ============================================ */

  .hero {
    padding: 4rem 1rem 6rem;
    position: relative;
    overflow: hidden;
  }

  .hero::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -10%;
    width: 120%;
    height: 200%;
    background: radial-gradient(circle, hsla(250, 75%, 55%, 0.1) 0%, transparent 70%);
    animation: heroGlow 8s ease-in-out infinite;
  }

  @keyframes heroGlow {

    0%,
    100% {
      transform: scale(1) rotate(0deg);
    }

    50% {
      transform: scale(1.1) rotate(5deg);
    }
  }

  .hero__container {
    max-width: 1280px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .hero__content {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }

  .hero__title {
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 900;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    color: var(--color-dark-text);
  }

  .hero__subtitle {
    font-size: clamp(1.125rem, 2vw, 1.375rem);
    line-height: 1.6;
    color: var(--color-dark-text-muted);
    margin-bottom: 2.5rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero__actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  /* ============================================
   STATS SECTION
   ============================================ */

  .stats {
    padding: 0 1rem 4rem;
    margin-top: -2rem;
  }

  .stats__container {
    max-width: 1280px;
    margin: 0 auto;
  }

  .stats__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 2rem;
    text-align: center;
  }

  .stat-item__value {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
  }

  .stat-item__label {
    font-size: 0.875rem;
    color: var(--color-dark-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
  }

  /* ============================================
   FEATURES SECTION
   ============================================ */

  .features {
    padding: 4rem 1rem;
  }

  .features__container {
    max-width: 1280px;
    margin: 0 auto;
  }

  .features__header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .features__title {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    margin-bottom: 1rem;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .features__subtitle {
    font-size: 1.125rem;
    color: var(--color-dark-text-muted);
  }

  .features__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .feature-card {
    display: flex;
    flex-direction: column;
    cursor: pointer;
  }

  .feature-card--coming-soon {
    opacity: 0.7;
    cursor: default;
  }

  .feature-card__icon {
    margin-bottom: 1.5rem;
  }

  .feature-card__icon-bg {
    width: 64px;
    height: 64px;
    border-radius: var(--radius-xl);
    background: var(--gradient-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 16px rgba(124, 58, 237, 0.3);
  }

  .feature-card__icon-bg--muted {
    background: var(--color-dark-border);
    box-shadow: none;
  }

  .feature-card__icon-symbol {
    font-size: 2rem;
    color: white;
  }

  .feature-card__icon-bg--muted .feature-card__icon-symbol {
    color: var(--color-dark-text-muted);
  }

  .feature-card__title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--color-dark-text);
  }

  .feature-card__description {
    color: var(--color-dark-text-muted);
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  .feature-card__features {
    list-style: none;
    padding: 0;
    margin: 0 0 1.5rem 0;
    flex: 1;
  }

  .feature-card__features li {
    padding: 0.5rem 0;
    color: var(--color-dark-text-muted);
    font-size: 0.9375rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .feature-card__features li i {
    color: var(--color-secondary-500);
    font-size: 1.125rem;
    flex-shrink: 0;
  }

  .feature-card__action {
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid var(--color-dark-border);
  }

  .feature-card__link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
    color: var(--color-primary-500);
    transition: all var(--transition-base);
  }

  .feature-card:hover .feature-card__link {
    color: var(--color-primary-400);
  }

  .feature-card__arrow {
    transition: transform var(--transition-base);
  }

  .feature-card:hover .feature-card__arrow {
    transform: translateX(4px);
  }

  .feature-card__badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: var(--color-dark-border);
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-dark-text-muted);
    margin-top: auto;
  }

  /* ============================================
   BENEFITS SECTION
   ============================================ */

  .benefits {
    padding: 4rem 1rem;
    background: var(--color-dark-surface);
  }

  .benefits__container {
    max-width: 1280px;
    margin: 0 auto;
  }

  .benefits__header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .benefits__title {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    margin-bottom: 1rem;
    color: var(--color-dark-text);
  }

  .benefits__subtitle {
    font-size: 1.125rem;
    color: var(--color-dark-text-muted);
  }

  .benefits__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
  }

  .benefit-item {
    text-align: center;
    padding: 2rem;
  }

  .benefit-item__icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .benefit-item__icon i {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .benefit-item__title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    color: var(--color-dark-text);
  }

  .benefit-item__description {
    color: var(--color-dark-text-muted);
    line-height: 1.6;
    font-size: 0.9375rem;
  }

  /* ============================================
   RESPONSIVE
   ============================================ */

  @media (max-width: 768px) {
    .hero {
      padding: 3rem 1rem 4rem;
    }

    .stats__grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .features__grid {
      grid-template-columns: 1fr;
    }

    .benefits__grid {
      grid-template-columns: 1fr;
    }
  }
</style>