import { useState, Component } from 'react';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { HomeScreen } from './screens/HomeScreen';
import { SyllabusScreen } from './screens/SyllabusScreen';
import { QuizScreen } from './screens/QuizScreen';
import { LongAnswerScreen } from './screens/LongAnswerScreen';
import { WeaknessScreen } from './screens/WeaknessScreen';
import { StudyScreen } from './screens/StudyScreen';
import { SettingsScreen } from './screens/SettingsScreen';

// エラーバウンダリ：子コンポーネントのエラーをキャッチして表示
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '24px', color: '#dc2626' }}>
          <h2 style={{ fontWeight: 'bold', marginBottom: '8px' }}>エラーが発生しました</h2>
          <pre style={{ fontSize: '12px', background: '#fef2f2', padding: '12px', borderRadius: '8px', overflow: 'auto' }}>
            {this.state.error.message}
          </pre>
          <button
            onClick={() => this.setState({ error: null })}
            style={{ marginTop: '12px', padding: '8px 16px', background: '#2563eb', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
          >
            再試行
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const SCREENS = {
  home: HomeScreen,
  syllabus: SyllabusScreen,
  quiz: QuizScreen,
  long: LongAnswerScreen,
  weakness: WeaknessScreen,
  study: StudyScreen,
  settings: SettingsScreen,
};

function AppContent() {
  const [screen, setScreen] = useState('home');
  const [screenParams, setScreenParams] = useState({});

  function navigate(screenId, params = {}) {
    setScreen(screenId);
    setScreenParams(params);
    window.scrollTo(0, 0);
  }

  const Screen = SCREENS[screen] || HomeScreen;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar currentScreen={screen} onNavigate={navigate} />

      <div className="md:pl-52 pt-14">
        <main className="max-w-3xl mx-auto px-4 py-6 pb-24 md:pb-8">
          <ErrorBoundary key={screen}>
            <Screen onNavigate={navigate} params={screenParams} />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
