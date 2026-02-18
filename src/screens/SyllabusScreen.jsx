import { useState } from 'react';
import syllabusData from '../data/syllabus.json';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Badge, StatusBadge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { Button } from '../components/common/Button';

const CATEGORY_COLORS = {
  technology: 'blue',
  management: 'green',
  strategy: 'purple',
};

export function SyllabusScreen({ onNavigate }) {
  const { progress, getSubcategoryStats } = useApp();
  const [expandedCat, setExpandedCat] = useState('technology');

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">シラバス一覧</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">分野別の学習進捗を確認できます</p>
      </div>

      {syllabusData.categories.map(cat => (
        <div key={cat.id}>
          <button
            className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
            onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span className="font-semibold text-gray-800 dark:text-gray-100">{cat.name}</span>
            </div>
            <span className="text-gray-400 text-sm">{expandedCat === cat.id ? '▲' : '▼'}</span>
          </button>

          {expandedCat === cat.id && (
            <div className="mt-2 space-y-2 pl-2">
              {cat.subcategories.map(sub => (
                <SubcategoryCard
                  key={sub.id}
                  subcategory={sub}
                  categoryId={cat.id}
                  color={CATEGORY_COLORS[cat.id]}
                  onNavigate={onNavigate}
                  getSubcategoryStats={getSubcategoryStats}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function SubcategoryCard({ subcategory, categoryId, color, onNavigate, getSubcategoryStats }) {
  const [expanded, setExpanded] = useState(false);

  // Aggregate stats for all topics in this subcategory
  const allStats = subcategory.topics.map(t => getSubcategoryStats(t.name));
  const totalCorrect = allStats.reduce((s, st) => s + (st.correct || 0), 0);
  const totalAnswered = allStats.reduce((s, st) => s + (st.total || 0), 0);
  const rate = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : null;

  const getProgressColor = (r) => {
    if (r === null) return 'blue';
    if (r >= 80) return 'green';
    if (r >= 60) return 'blue';
    if (r >= 40) return 'yellow';
    return 'red';
  };

  return (
    <Card className="overflow-hidden">
      <button
        className="w-full px-4 py-3 flex items-center justify-between text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-gray-800 dark:text-gray-100">{subcategory.name}</span>
            {rate !== null && (
              <Badge color={getProgressColor(rate) === 'yellow' ? 'yellow' : getProgressColor(rate) === 'red' ? 'red' : getProgressColor(rate) === 'green' ? 'green' : 'blue'}>
                {rate}%
              </Badge>
            )}
          </div>
          {totalAnswered > 0 && (
            <ProgressBar value={rate || 0} color={getProgressColor(rate)} size="sm" />
          )}
          <p className="text-xs text-gray-400 mt-1">{subcategory.topics.length} トピック</p>
        </div>
        <span className="text-gray-400 text-sm ml-3">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 dark:border-gray-700">
          {subcategory.topics.map(topic => {
            const stats = getSubcategoryStats(topic.name);
            return (
              <div key={topic.id} className="px-4 py-3 flex items-center justify-between border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{topic.name}</p>
                  {stats.total > 0 && (
                    <p className="text-xs text-gray-400">{stats.correct}/{stats.total} 正解 ({stats.rate}%)</p>
                  )}
                </div>
                <div className="flex gap-2 ml-3 shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onNavigate('study', { topicId: topic.id, topicName: topic.name })}
                  >
                    解説
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onNavigate('quiz', { subcategory: topic.name })}
                  >
                    演習
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
