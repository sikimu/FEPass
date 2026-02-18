import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { HomeScreen } from './screens/HomeScreen';
import { SyllabusScreen } from './screens/SyllabusScreen';
import { QuizScreen } from './screens/QuizScreen';
import { LongAnswerScreen } from './screens/LongAnswerScreen';
import { WeaknessScreen } from './screens/WeaknessScreen';
import { StudyScreen } from './screens/StudyScreen';
import { SettingsScreen } from './screens/SettingsScreen';

function AppContent() {
  const [screen, setScreen] = useState('home');
  const [screenParams, setScreenParams] = useState({});

  function navigate(screenId, params = {}) {
    setScreen(screenId);
    setScreenParams(params);
    window.scrollTo(0, 0);
  }

  const screenProps = {
    onNavigate: navigate,
    params: screenParams,
  };

  const screens = {
    home: <HomeScreen {...screenProps} />,
    syllabus: <SyllabusScreen {...screenProps} />,
    quiz: <QuizScreen {...screenProps} />,
    long: <LongAnswerScreen {...screenProps} />,
    weakness: <WeaknessScreen {...screenProps} />,
    study: <StudyScreen {...screenProps} />,
    settings: <SettingsScreen {...screenProps} />,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar currentScreen={screen} onNavigate={navigate} />

      {/* Main content area */}
      <div className="md:pl-52 pt-14">
        <main className="max-w-3xl mx-auto px-4 py-6 pb-24 md:pb-8">
          {screens[screen] || screens.home}
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
