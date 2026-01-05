/* =====================================================
   MOOD INSIGHT
   Simple analytics & chart rendering (static)
   ===================================================== */

(function () {
  const STORAGE_KEY = 'mood-tracker-entries';

  const chartCanvas = document.getElementById('moodChart');
  const summaryCards = document.querySelectorAll('.insight-card');

  /**
   * Get mood entries
   */
  function getEntries() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  /**
   * Map mood to numeric score
   */
  function moodScore(mood) {
    const map = {
      'very-bad': 1,
      'bad': 2,
      'neutral': 3,
      'good': 4,
      'very-good': 5
    };
    return map[mood] || 3;
  }

  /**
   * Get dominant mood
   */
  function getDominantMood(entries) {
    const count = {};

    entries.forEach((e) => {
      count[e.mood] = (count[e.mood] || 0) + 1;
    });

    return Object.keys(count).reduce((a, b) =>
      count[a] > count[b] ? a : b
    );
  }

  /**
   * Render simple line chart using canvas
   */
  function renderChart(entries) {
    if (!chartCanvas || entries.length === 0) return;

    const ctx = chartCanvas.getContext('2d');
    const width = chartCanvas.width = chartCanvas.offsetWidth;
    const height = chartCanvas.height = 220;

    ctx.clearRect(0, 0, width, height);

    const scores = entries
      .slice(0, 7)
      .reverse()
      .map((e) => moodScore(e.mood));

    const padding = 20;
    const stepX = (width - padding * 2) / (scores.length - 1);
    const stepY = (height - padding * 2) / 4;

    ctx.strokeStyle = '#999';
    ctx.lineWidth = 2;
    ctx.beginPath();

    scores.forEach((score, i) => {
      const x = padding + i * stepX;
      const y = height - padding - (score - 1) * stepY;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();

    // Points
    ctx.fillStyle = '#555';
    scores.forEach((score, i) => {
      const x = padding + i * stepX;
      const y = height - padding - (score - 1) * stepY;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /**
   * Init insight page
   */
  function initInsight() {
    const entries = getEntries();

    if (entries.length === 0) {
      return;
    }

    // Chart
    renderChart(entries);

    // Summary (static text already exists, logic ready for upgrade)
    const dominant = getDominantMood(entries);
    console.info('Dominant mood:', dominant);
  }

  document.addEventListener('DOMContentLoaded', initInsight);
})();
