import { useApp } from '../context/AppContext';
import { Card, CardBody } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../components/common/ProgressBar';

export function HomeScreen({ onNavigate }) {
  const { totalStats, streaks, quizHistory } = useApp();

  const recentHistory = quizHistory.slice(0, 5);

  const statCards = [
    {
      label: '総回答数',
      value: totalStats.total,
      sub: '問',
      icon: '📝',
      color: 'text-blue-600',
    },
    {
      label: '全体正答率',
      value: totalStats.rate !== null ? `${totalStats.rate}%` : '--',
      sub: '',
      icon: '✅',
      color: 'text-green-600',
    },
    {
      label: '連続学習日数',
      value: streaks.current,
      sub: '日',
      icon: '🔥',
      color: 'text-orange-500',
    },
    {
      label: '最高連続記録',
      value: streaks.best,
      sub: '日',
      icon: '🏆',
      color: 'text-yellow-500',
    },
  ];

  const quickActions = [
    {
      label: 'ランダム演習',
      desc: '全分野からランダムに出題',
      icon: '🎲',
      action: () => onNavigate('quiz', { mode: 'random' }),
      variant: 'primary',
    },
    {
      label: '分野別演習',
      desc: '分野を選んで問題を解く',
      icon: '📚',
      action: () => onNavigate('syllabus'),
      variant: 'outline',
    },
    {
      label: '記述問題',
      desc: '長文・記述式問題に挑戦',
      icon: '📝',
      action: () => onNavigate('long'),
      variant: 'outline',
    },
    {
      label: '弱点を確認',
      desc: '苦手分野を可視化・集中学習',
      icon: '📊',
      action: () => onNavigate('weakness'),
      variant: 'outline',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">基本情報技術者試験</h1>
        <p className="text-blue-200 text-sm mb-4">合格を目指して一緒に頑張りましょう！</p>
        {totalStats.total > 0 ? (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>全体正答率</span>
              <span className="font-bold">{totalStats.rate}%</span>
            </div>
            <ProgressBar value={totalStats.rate || 0} color="blue" size="lg" />
            <p className="text-xs text-blue-200 mt-1">{totalStats.correct} / {totalStats.total} 問正解</p>
          </div>
        ) : (
          <p className="text-sm text-blue-200">まずは問題演習から始めましょう！</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map(card => (
          <Card key={card.label} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{card.label}</p>
                <p className={`text-2xl font-bold ${card.color}`}>
                  {card.value}<span className="text-sm font-normal text-gray-500">{card.sub}</span>
                </p>
              </div>
              <span className="text-2xl">{card.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">クイックスタート</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map(action => (
            <Card key={action.label} className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={action.action}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{action.icon}</span>
                <div>
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{action.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{action.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent History */}
      {recentHistory.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">最近の回答</h2>
          <Card>
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {recentHistory.map((h, i) => (
                <li key={i} className="px-4 py-3 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 dark:text-gray-200 truncate">{h.subcategory}</p>
                    <p className="text-xs text-gray-400">{new Date(h.timestamp).toLocaleString('ja-JP')}</p>
                  </div>
                  <span className={`ml-3 text-lg ${h.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {h.isCorrect ? '⭕' : '❌'}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}
