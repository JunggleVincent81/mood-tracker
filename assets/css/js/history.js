/* =====================================================
   MOOD HISTORY
   Render mood entries from localStorage
   ===================================================== */

(function () {
  const STORAGE_KEY = 'mood-tracker-entries';

  const historyList = document.querySelector('.history-list');
  const emptyState = document.querySelector('.history-empty');
  const filterRange = document.getElementById('filterRange');
  const filterMood = document.getElementById('filterMood');

  /**
   * Get mood entries from localStorage
   * @returns {Array}
   */
  function getEntries() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  /**
   * Format date for display
   * @param {string} isoDate
   * @returns {string}
   */
  function formatDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Map mood value to label & class
   */
  function getMoodMeta(mood) {
    const map = {
      'very-bad': { label: 'Very Bad 😞', class: 'mood-negative' },
      'bad': { label: 'Bad 😕', class: 'mood-negative' },
      'neutral': { label: 'Neutral 😐', class: 'mood-neutral' },
      'good': { label: 'Good 🙂', class: 'mood-positive' },
      'very-good': { label: 'Very Good 😄', class: 'mood-positive' }
    };

    return map[mood] || { label: mood, class: '' };
  }

  /**
   * Filter entries by range & mood
   */
  function filterEntries(entries) {
    let result = [...entries];

    // Filter by mood
    if (filterMood && filterMood.value !== 'all') {
      result = result.filter(
        (entry) => entry.mood === filterMood.value
      );
    }

    // Filter by date range
    if (filterRange && filterRange.value !== 'all') {
      const days = parseInt(filterRange.value, 10);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);

      result = result.filter(
        (entry) => new Date(entry.date) >= cutoff
      );
    }

    return result;
  }

  /**
   * Render history list
   */
  function renderHistory(entries) {
    if (!historyList) return;

    historyList.innerHTML = '';

    if (entries.length === 0) {
      if (emptyState) emptyState.hidden = false;
      return;
    }

    if (emptyState) emptyState.hidden = true;

    entries.forEach((entry) => {
      const moodMeta = getMoodMeta(entry.mood);

      const article = document.createElement('article');
      article.className = `card history-item ${moodMeta.class}`;

      article.innerHTML = `
        <header class="history-item-header">
          <h3>${moodMeta.label}</h3>
          <time datetime="${entry.date}">
            ${formatDate(entry.date)}
          </time>
        </header>
        ${
          entry.note
            ? `<p class="history-note">${entry.note}</p>`
            : ''
        }
      `;

      historyList.appendChild(article);
    });
  }

  /**
   * Init history page
   */
  function initHistory() {
    const entries = getEntries();
    renderHistory(entries);

    if (filterRange || filterMood) {
      const handleFilter = () => {
        const filtered = filterEntries(entries);
        renderHistory(filtered);
      };

      if (filterRange) filterRange.addEventListener('change', handleFilter);
      if (filterMood) filterMood.addEventListener('change', handleFilter);
    }
  }

  document.addEventListener('DOMContentLoaded', initHistory);
})();
