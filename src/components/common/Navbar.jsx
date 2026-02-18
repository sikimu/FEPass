import { useApp } from '../../context/AppContext';

const NAV_ITEMS = [
  { id: 'home', label: 'ホーム', icon: '🏠' },
  { id: 'syllabus', label: 'シラバス', icon: '📚' },
  { id: 'quiz', label: '問題演習', icon: '✏️' },
  { id: 'long', label: '記述問題', icon: '📝' },
  { id: 'weakness', label: '弱点分析', icon: '📊' },
  { id: 'settings', label: '設定', icon: '⚙️' },
];

export function Navbar({ currentScreen, onNavigate }) {
  const { settings, updateSettings } = useApp();

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <span className="font-bold text-blue-700 dark:text-blue-400 text-lg leading-tight">FEPass</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">基本情報技術者試験 学習アプリ</span>
          </div>
          <button
            onClick={() => updateSettings({ darkMode: !settings.darkMode })}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
            aria-label="ダークモード切替"
          >
            {settings.darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Bottom nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 md:hidden">
        <div className="grid grid-cols-6 h-16">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 text-xs transition-colors ${
                currentScreen === item.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] leading-tight">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Side nav (desktop) */}
      <nav className="hidden md:flex fixed left-0 top-14 bottom-0 w-52 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex-col py-4 px-2 z-30">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium mb-1 transition-colors text-left ${
              currentScreen === item.id
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </>
  );
}
