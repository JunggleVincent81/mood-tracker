/* =====================================================
   MOOD INPUT LOGIC
   Handles mood selection and saving (localStorage)
   ===================================================== */

(function () {
  const STORAGE_KEY = 'mood-tracker-entries';

  const moodButtons = document.querySelectorAll('.mood-option');
  const saveButton = document.getElementById('saveMood');
  const noteInput = document.getElementById('moodNote');
  const feedbackEl = document.getElementById('moodFeedback');

  let selectedMood = null;

  /**
   * Clear active state from all mood buttons
   */
  function clearMoodSelection() {
    moodButtons.forEach((btn) => {
      btn.classList.remove('active');
    });
  }

  /**
   * Handle mood selection
   */
  function handleMoodSelect(e) {
    clearMoodSelection();
    const btn = e.currentTarget;
    btn.classList.add('active');
    selectedMood = btn.getAttribute('data-mood');
  }

  /**
   * Get saved mood entries
   * @returns {Array}
   */
  function getStoredEntries() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  /**
   * Save mood entry
   */
  function saveMood() {
    if (!selectedMood) {
      showFeedback('Please select a mood before saving.', 'error');
      return;
    }

    const entry = {
      id: Date.now(),
      mood: selectedMood,
      note: noteInput ? noteInput.value.trim() : '',
      date: new Date().toISOString()
    };

    const entries = getStoredEntries();
    entries.unshift(entry); // newest first
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));

    resetForm();
    showFeedback('Your mood has been saved successfully.', 'success');
  }

  /**
   * Reset form after save
   */
  function resetForm() {
    clearMoodSelection();
    selectedMood = null;
    if (noteInput) noteInput.value = '';
  }

  /**
   * Show feedback message
   * @param {string} message
   * @param {string} type
   */
  function showFeedback(message, type) {
    if (!feedbackEl) return;

    feedbackEl.textContent = message;
    feedbackEl.className = 'mood-feedback';

    if (type === 'success') {
      feedbackEl.classList.add('mood-positive');
    } else {
      feedbackEl.classList.add('mood-negative');
    }
  }

  /**
   * Init mood page
   */
  function initMood() {
    moodButtons.forEach((btn) => {
      btn.addEventListener('click', handleMoodSelect);
    });

    if (saveButton) {
      saveButton.addEventListener('click', saveMood);
    }
  }

  document.addEventListener('DOMContentLoaded', initMood);
})();
