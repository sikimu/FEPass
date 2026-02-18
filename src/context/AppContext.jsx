import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  PROGRESS: 'fe_study_progress',
  QUIZ_HISTORY: 'fe_quiz_history',
  STREAKS: 'fe_study_streaks',
  API_KEY: 'fe_claude_api_key',
  SETTINGS: 'fe_settings',
};

function loadFromStorage(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('localStorage save failed:', e);
  }
}

export function AppProvider({ children }) {
  const [progress, setProgress] = useState(() =>
    loadFromStorage(STORAGE_KEYS.PROGRESS, {})
  );
  const [quizHistory, setQuizHistory] = useState(() =>
    loadFromStorage(STORAGE_KEYS.QUIZ_HISTORY, [])
  );
  const [streaks, setStreaks] = useState(() =>
    loadFromStorage(STORAGE_KEYS.STREAKS, { current: 0, lastDate: null, best: 0 })
  );
  const [apiKey, setApiKeyState] = useState(() =>
    loadFromStorage(STORAGE_KEYS.API_KEY, '')
  );
  const [settings, setSettingsState] = useState(() =>
    loadFromStorage(STORAGE_KEYS.SETTINGS, { darkMode: false })
  );

  // Persist on change
  useEffect(() => { saveToStorage(STORAGE_KEYS.PROGRESS, progress); }, [progress]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.QUIZ_HISTORY, quizHistory); }, [quizHistory]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.STREAKS, streaks); }, [streaks]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.SETTINGS, settings); }, [settings]);

  // Dark mode effect
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const recordAnswer = useCallback((question, selectedAnswer) => {
    const isCorrect = selectedAnswer === question.answer;
    const entry = {
      id: question.id,
      category: question.category,
      subcategory: question.subcategory,
      isCorrect,
      selectedAnswer,
      correctAnswer: question.answer,
      timestamp: new Date().toISOString(),
    };

    setQuizHistory(prev => {
      const next = [entry, ...prev].slice(0, 500); // keep last 500
      return next;
    });

    // Update category progress
    setProgress(prev => {
      const key = question.subcategory;
      const existing = prev[key] || { correct: 0, total: 0, status: 'studying' };
      return {
        ...prev,
        [key]: {
          ...existing,
          correct: existing.correct + (isCorrect ? 1 : 0),
          total: existing.total + 1,
          status: 'studying',
          lastStudied: new Date().toISOString(),
        },
      };
    });

    // Update streaks
    updateStreaks();

    return isCorrect;
  }, []);

  const updateStreaks = useCallback(() => {
    const today = new Date().toDateString();
    setStreaks(prev => {
      if (prev.lastDate === today) return prev;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isConsecutive = prev.lastDate === yesterday.toDateString();
      const current = isConsecutive ? prev.current + 1 : 1;
      return {
        current,
        lastDate: today,
        best: Math.max(prev.best, current),
      };
    });
  }, []);

  const markTopicComplete = useCallback((topicId) => {
    setProgress(prev => ({
      ...prev,
      [topicId]: {
        ...prev[topicId],
        status: 'completed',
        completedAt: new Date().toISOString(),
      },
    }));
  }, []);

  const getSubcategoryStats = useCallback((subcategory) => {
    const data = progress[subcategory] || { correct: 0, total: 0, status: 'not_started' };
    const rate = data.total > 0 ? Math.round((data.correct / data.total) * 100) : null;
    return { ...data, rate };
  }, [progress]);

  const getCategoryStats = useCallback((categoryName) => {
    const entries = Object.entries(progress).filter(([key]) => {
      const historyEntry = quizHistory.find(h => h.subcategory === key);
      return historyEntry?.category === categoryName;
    });
    if (entries.length === 0) {
      const categoryHistory = quizHistory.filter(h => h.category === categoryName);
      const correct = categoryHistory.filter(h => h.isCorrect).length;
      const total = categoryHistory.length;
      return { correct, total, rate: total > 0 ? Math.round((correct / total) * 100) : null };
    }
    const correct = entries.reduce((sum, [, v]) => sum + (v.correct || 0), 0);
    const total = entries.reduce((sum, [, v]) => sum + (v.total || 0), 0);
    return { correct, total, rate: total > 0 ? Math.round((correct / total) * 100) : null };
  }, [progress, quizHistory]);

  const setApiKey = useCallback((key) => {
    setApiKeyState(key);
    saveToStorage(STORAGE_KEYS.API_KEY, key);
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setSettingsState(prev => ({ ...prev, ...newSettings }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({});
    setQuizHistory([]);
    setStreaks({ current: 0, lastDate: null, best: 0 });
  }, []);

  const totalStats = {
    total: quizHistory.length,
    correct: quizHistory.filter(h => h.isCorrect).length,
    rate: quizHistory.length > 0
      ? Math.round((quizHistory.filter(h => h.isCorrect).length / quizHistory.length) * 100)
      : null,
  };

  return (
    <AppContext.Provider value={{
      progress,
      quizHistory,
      streaks,
      apiKey,
      settings,
      totalStats,
      recordAnswer,
      markTopicComplete,
      getSubcategoryStats,
      getCategoryStats,
      setApiKey,
      updateSettings,
      resetProgress,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
