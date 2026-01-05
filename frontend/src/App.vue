<template>
  <div class="app-container">
    <!-- Glassmorphism Header -->
    <header class="app-header">
      <div class="app-header__container">
        <div class="app-header__content">
          <!-- Logo -->
          <div class="app-header__logo">
            <router-link to="/" class="logo-link">
              <NiftyLogo />
            </router-link>
          </div>

          <!-- Navigation -->
          <nav class="app-nav">
            <router-link to="/text-tools" class="app-nav__link" active-class="app-nav__link--active">
              <i class="ti ti-tool app-nav__icon"></i>
              <span>Text Tools</span>
            </router-link>
            <router-link to="/about" class="app-nav__link" active-class="app-nav__link--active">
              <i class="ti ti-info-circle app-nav__icon"></i>
              <span>About</span>
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <div class="app-footer__container">
        <div class="app-footer__content">
          <div class="app-footer__info">
            <p class="app-footer__text">
              <NiftyText :height="18" class="footer-logo" /> - Developer's Swiss Army Knife
            </p>
            <p class="app-footer__version">
              Version {{ appVersion }} • Built with ❤️ using Vue 3 & FastAPI
            </p>
          </div>
          <div class="app-footer__links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="app-footer__link"
              aria-label="GitHub">
              <span>GitHub</span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="app-footer__link"
              aria-label="Twitter">
              <span>Twitter</span>
            </a>
          </div>
        </div>
        <div class="app-footer__copyright">
          <p>
            &copy; {{ currentYear }} NiftyTools. All rights reserved.
            <span class="app-footer__separator">•</span>
            Created by
            <a href="https://about.me/patrickaziken" target="_blank" rel="noopener noreferrer"
              class="app-footer__author">
              Patrick Aziken
            </a>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import NiftyLogo from './components/NiftyLogo.vue'
  import NiftyText from './components/NiftyText.vue'

  const appVersion = ref('1.1.0')
  const currentYear = new Date().getFullYear()
</script>

<style scoped>
  /* ============================================
   APP CONTAINER
   ============================================ */

  .app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* ============================================
   HEADER
   ============================================ */

  .app-header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: var(--glass-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--glass-border);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .app-header__container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .app-header__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
  }

  .app-header__logo {
    flex-shrink: 0;
  }

  .logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    transition: transform var(--transition-base);
  }

  .logo-link:hover {
    transform: scale(1.02);
  }

  /* ============================================
   NAVIGATION
   ============================================ */

  .app-nav {
    display: flex;
    gap: 0.5rem;
  }

  .app-nav__link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    border-radius: var(--radius-lg);
    font-weight: 500;
    font-size: 0.9375rem;
    color: var(--color-dark-text-muted);
    text-decoration: none;
    transition: all var(--transition-base);
    position: relative;
  }

  .app-nav__link::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-lg);
    background: var(--gradient-primary);
    opacity: 0;
    transition: opacity var(--transition-base);
  }

  .app-nav__link:hover {
    color: var(--color-dark-text);
    background: hsla(240, 10%, 20%, 0.5);
  }

  .app-nav__link--active {
    color: white;
  }

  .app-nav__link--active::before {
    opacity: 1;
  }

  .app-nav__icon {
    font-size: 1.125rem;
    position: relative;
    z-index: 1;
  }

  .app-nav__link span:last-child {
    position: relative;
    z-index: 1;
  }

  /* ============================================
   MAIN CONTENT
   ============================================ */

  .app-main {
    flex: 1;
    padding: 2rem 0;
  }

  /* Page Transitions */
  .page-enter-active,
  .page-leave-active {
    transition: all var(--transition-base);
  }

  .page-enter-from {
    opacity: 0;
    transform: translateY(10px);
  }

  .page-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }

  /* ============================================
   FOOTER
   ============================================ */

  .app-footer {
    margin-top: auto;
    background: var(--color-dark-surface);
    border-top: 1px solid var(--color-dark-border);
  }

  .app-footer__container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 3rem 1rem 2rem;
  }

  .app-footer__content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .app-footer__info {
    flex: 1;
    min-width: 250px;
  }

  .app-footer__text {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--color-dark-text);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .footer-logo {
    display: inline-block;
    vertical-align: middle;
  }

  .app-footer__version {
    font-size: 0.875rem;
    color: var(--color-dark-text-muted);
  }

  .app-footer__links {
    display: flex;
    gap: 1.5rem;
  }

  .app-footer__link {
    color: var(--color-dark-text-muted);
    text-decoration: none;
    font-weight: 500;
    transition: color var(--transition-base);
    position: relative;
  }

  .app-footer__link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--gradient-primary);
    transition: width var(--transition-base);
  }

  .app-footer__link:hover {
    color: var(--color-dark-text);
  }

  .app-footer__link:hover::after {
    width: 100%;
  }

  .app-footer__copyright {
    padding-top: 2rem;
    border-top: 1px solid var(--color-dark-border);
    text-align: center;
  }

  .app-footer__copyright p {
    font-size: 0.875rem;
    color: var(--color-dark-text-muted);
  }

  .app-footer__separator {
    margin: 0 0.5rem;
    opacity: 0.5;
  }

  .app-footer__author {
    color: var(--color-dark-text);
    text-decoration: none;
    font-weight: 600;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transition: all var(--transition-base);
    position: relative;
  }

  .app-footer__author:hover {
    opacity: 0.8;
    transform: translateY(-1px);
  }


  /* ============================================
   RESPONSIVE
   ============================================ */

  @media (max-width: 768px) {
    .app-header__content {
      flex-direction: column;
      gap: 1rem;
    }

    .app-nav {
      width: 100%;
      justify-content: center;
    }

    .app-nav__link {
      flex: 1;
      justify-content: center;
    }

    .app-footer__content {
      flex-direction: column;
      text-align: center;
    }

    .app-footer__links {
      justify-content: center;
    }
  }
</style>