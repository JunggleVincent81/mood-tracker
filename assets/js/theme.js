/* =====================================================
   THEME SWITCHER
   Handles global theme state
   ===================================================== */

(function () {
  const THEME_KEY = 'mood-tracker-theme';
  const DEFAULT_THEME = 'default';
  const LAVENDER_THEME = 'lavender';

  const root = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggle');
  const themeOptionButtons = document.querySelectorAll('[data-theme-option]');

  /**
   * Apply theme to document
   * @param {string} theme
   */
  function applyTheme(theme) {
    if (theme === LAVENDER_THEME) {
      root.setAttribute('data-theme', LAVENDER_THEME);
    } else {
      root.removeAttribute('data-theme');
    }
  }

  /**
   * Save theme preference
   * @param {string} theme
   */
  function saveTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
  }

  /**
   * Load saved theme
   */
  function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
    applyTheme(savedTheme);
    return savedTheme;
  }

  /**
   * Toggle between default and lavender
   */
  function toggleTheme() {
    const currentTheme =
      root.getAttribute('data-theme') === LAVENDER_THEME
        ? LAVENDER_THEME
        : DEFAULT_THEME;

    const nextTheme =
      currentTheme === DEFAULT_THEME ? LAVENDER_THEME : DEFAULT_THEME;

    applyTheme(nextTheme);
    saveTheme(nextTheme);
  }

  /**
   * Init theme system
   */
  function initTheme() {
    loadTheme();

    // Navbar toggle button
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Settings page buttons
    if (themeOptionButtons.length > 0) {
      themeOptionButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const selectedTheme = btn.getAttribute('data-theme-option');
          applyTheme(selectedTheme);
          saveTheme(selectedTheme);
        });
      });
    }
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', initTheme);
})();
