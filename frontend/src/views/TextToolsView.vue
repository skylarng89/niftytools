<template>
  <div class="text-tools-layout">
    <!-- Text Tools Navigation -->
    <div class="submenu-container">
      <nav class="submenu">
        <router-link to="/text-tools" exact-active-class="submenu__link--active" class="submenu__link">
          <i class="ti ti-layout-dashboard submenu__icon"></i>
          <span>Overview</span>
        </router-link>
        <router-link to="/text-tools/sort" active-class="submenu__link--active" class="submenu__link">
          <i class="ti ti-sort-ascending submenu__icon"></i>
          <span>Sort Text</span>
        </router-link>
      </nav>
    </div>

    <!-- Router Content -->
    <div class="submenu-content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
  // Text tools layout component
</script>

<style scoped>
  .text-tools-layout {
    width: 100%;
  }

  /* ============================================
   SUBMENU CONTAINER
   ============================================ */

  .submenu-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1rem 2rem;
  }

  .submenu {
    display: inline-flex;
    gap: 0.5rem;
    padding: 0.5rem;
    background: var(--glass-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-xl);
    box-shadow: var(--glass-shadow);
  }

  /* ============================================
   SUBMENU LINKS
   ============================================ */

  .submenu__link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-lg);
    font-weight: 500;
    font-size: 0.9375rem;
    color: var(--color-dark-text-muted);
    text-decoration: none;
    transition: all var(--transition-base);
    position: relative;
    white-space: nowrap;
  }

  .submenu__link::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-lg);
    background: var(--gradient-primary);
    opacity: 0;
    transition: opacity var(--transition-base);
  }

  .submenu__link:hover {
    color: var(--color-dark-text);
    background: hsla(240, 10%, 20%, 0.5);
  }

  .submenu__link--active {
    color: white;
  }

  .submenu__link--active::before {
    opacity: 1;
  }

  .submenu__icon {
    font-size: 1.125rem;
    position: relative;
    z-index: 1;
  }

  .submenu__link span {
    position: relative;
    z-index: 1;
  }

  /* ============================================
   CONTENT AREA
   ============================================ */

  .submenu-content {
    animation: fadeIn var(--transition-base) ease-out;
  }

  /* ============================================
   RESPONSIVE
   ============================================ */

  @media (max-width: 640px) {
    .submenu {
      width: 100%;
      justify-content: center;
    }

    .submenu__link {
      flex: 1;
      justify-content: center;
      padding: 0.75rem 1rem;
    }
  }
</style>