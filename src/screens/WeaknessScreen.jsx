import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CATEGORIES = ['テクノロジ系', 'マネジメント系', 'ストラテジ系'];

function getSubcategoryRates(quizHistory) {
  const map = {};
  quizHistory.forEach(h => {
    if (!map[h.subcategory]) {
      map[h.subcategory] = { correct: 0, total: 0, category: h.category };
    }
    map[h.subcategory].total++;
    if (h.isCorrect) map[h.subcategory].correct++;
  });
  return Object.entries(map).map(([name, data]) => ({
    name,
    category: data.category,
    rate: Math.round((data.correct / data.total) * 100),
    correct: data.correct,
    total: data.total,
  }));
}

function getCategoryRates(quizHistory) {
  return CATEGORIES.map(cat => {
    const entries = quizHistory.filter(h => h.category === cat);
    if (entries.length === 0) return { name: cat, shortName: cat.replace('系', ''), rate: 0 };
    const correct = entries.filter(h => h.isCorrect).length;
    return {
      name: cat,
      shortName: cat.replace('系', ''),
      rate: Math.round((correct / entries.length) * 100),
    };
  });
}

export function WeaknessScreen({ onNavigate }) {
  const { quizHistory, totalStats, streaks } = useApp();

  if (quizHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-5xl mb-4">📊</div>
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">まだデータがありません</h2>
        <p className="text-gray-500 text-sm mb-6">問題演習に回答すると、ここに分析データが表示されます。</p>
        <Button onClick={() => onNavigate('quiz')} variant="primary">問題を解く</Button>
      </div>
    );
  }

  const subcategoryRates = getSubcategoryRates(quizHistory);
  const categoryRates = getCategoryRates(quizHistory);
  const weakCategories = [...subcategoryRates].sort((a, b) => a.rate - b.rate).slice(0, 3);
  const recentHistory = quizHistory.slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">弱点分析</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">回答履歴から苦手分野を把握しましょう</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{totalStats.total}</p>
          <p className="text-xs text-gray-500 mt-1">総回答数</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{totalStats.rate ?? '--'}%</p>
          <p className="text-xs text-gray-500 mt-1">正答率</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-orange-500">{streaks.current}</p>
          <p className="text-xs text-gray-500 mt-1">連続学習日数</p>
        </Card>
      </div>

      {/* Radar Chart */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">分野別 正答率（レーダーチャート）</h2>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={categoryRates}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="shortName" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Radar
                name="正答率"
                dataKey="rate"
                stroke="#2563eb"
                fill="#2563eb"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Bar Chart */}
      {subcategoryRates.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">分野別 正答率</h2>
          </CardHeader>
          <CardBody className="overflow-x-auto">
            <ResponsiveContainer width="100%" height={Math.max(200, subcategoryRates.length * 32)}>
              <BarChart
                layout="vertical"
                data={[...subcategoryRates].sort((a, b) => a.rate - b.rate)}
                margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={140} />
                <Tooltip formatter={v => `${v}%`} />
                <Bar dataKey="rate" fill="#2563eb" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      )}

      {/* Weakness TOP3 */}
      {weakCategories.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">弱点分野 TOP3</h2>
          <div className="space-y-3">
            {weakCategories.map((cat, i) => (
              <Card key={cat.name} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-red-500">#{i + 1}</span>
                    <div>
                      <p className="font-medium text-sm text-gray-800 dark:text-gray-100">{cat.name}</p>
                      <p className="text-xs text-gray-500">{cat.correct}/{cat.total} 正解 ({cat.rate}%)</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onNavigate('quiz', { subcategory: cat.name })}
                  >
                    集中学習
                  </Button>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all"
                      style={{ width: `${cat.rate}%` }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recent History */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">最近の回答履歴</h2>
        </CardHeader>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {recentHistory.map((h, i) => (
            <div key={i} className="px-5 py-3 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 dark:text-gray-200 truncate">{h.subcategory}</p>
                <p className="text-xs text-gray-400">{new Date(h.timestamp).toLocaleString('ja-JP')}</p>
              </div>
              <span className={`ml-3 text-lg ${h.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                {h.isCorrect ? '⭕' : '❌'}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
