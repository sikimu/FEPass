import { useState } from 'react';
import technologyLong from '../data/long_questions/technology_long.json';
import managementLong from '../data/long_questions/management_long.json';
import strategyLong from '../data/long_questions/strategy_long.json';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

const ALL_LONG_QUESTIONS = [...technologyLong, ...managementLong, ...strategyLong];

export function LongAnswerScreen() {
  const [selectedQ, setSelectedQ] = useState(null);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [selfScore, setSelfScore] = useState({});

  if (!selectedQ) {
    return <QuestionList questions={ALL_LONG_QUESTIONS} onSelect={setSelectedQ} />;
  }

  function handleReveal(no) {
    setRevealed(prev => ({ ...prev, [no]: true }));
  }

  function toggleSelfScore(key, point) {
    setSelfScore(prev => ({
      ...prev,
      [key]: { ...prev[key], [point]: !prev[key]?.[point] },
    }));
  }

  function handleBack() {
    setSelectedQ(null);
    setAnswers({});
    setRevealed({});
    setSelfScore({});
  }

  const categoryColors = {
    'テクノロジ系': 'blue',
    'マネジメント系': 'green',
    'ストラテジ系': 'purple',
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={handleBack}>← 問題一覧</Button>
        <div>
          <h1 className="font-bold text-gray-800 dark:text-gray-100">{selectedQ.title}</h1>
          <div className="flex gap-2 mt-1">
            <Badge color={categoryColors[selectedQ.category] || 'blue'}>{selectedQ.category}</Badge>
            <Badge color="gray">{selectedQ.subcategory}</Badge>
          </div>
        </div>
      </div>

      {/* Scenario */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">状況説明</h2>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{selectedQ.scenario}</p>
        </CardBody>
      </Card>

      {/* Questions */}
      {selectedQ.questions.map(q => {
        const key = `${selectedQ.id}_${q.no}`;
        const isRevealed = revealed[q.no];

        return (
          <Card key={q.no}>
            <CardHeader>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">設問 {q.no}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{q.question}</p>
            </CardHeader>
            <CardBody className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">あなたの回答</label>
                <textarea
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={5}
                  placeholder="回答を入力してください..."
                  value={answers[key] || ''}
                  onChange={e => setAnswers(prev => ({ ...prev, [key]: e.target.value }))}
                  disabled={isRevealed}
                />
              </div>

              {!isRevealed && (
                <Button
                  onClick={() => handleReveal(q.no)}
                  variant="primary"
                  className="w-full"
                  disabled={!answers[key]?.trim()}
                >
                  解答を確認する
                </Button>
              )}

              {isRevealed && (
                <div className="space-y-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">模範解答</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{q.modelAnswer}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">採点チェックリスト（自己採点）</p>
                    <div className="space-y-2">
                      {q.scoringPoints.map((point, pi) => (
                        <label key={pi} className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            className="mt-0.5 w-4 h-4 accent-blue-600"
                            checked={!!selfScore[key]?.[point]}
                            onChange={() => toggleSelfScore(key, point)}
                          />
                          <span className={`text-sm ${selfScore[key]?.[point] ? 'text-green-600 dark:text-green-400 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                            {point}
                          </span>
                        </label>
                      ))}
                    </div>

                    {selfScore[key] && (
                      <div className="mt-3 text-sm text-gray-500">
                        {Object.values(selfScore[key]).filter(Boolean).length} / {q.scoringPoints.length} 項目達成
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        );
      })}

      <Button variant="outline" className="w-full" onClick={handleBack}>
        問題一覧に戻る
      </Button>
    </div>
  );
}

function QuestionList({ questions, onSelect }) {
  const [filterCat, setFilterCat] = useState('all');
  const categories = ['all', ...new Set(questions.map(q => q.category))];
  const filtered = filterCat === 'all' ? questions : questions.filter(q => q.category === filterCat);

  const catColors = {
    'テクノロジ系': 'blue',
    'マネジメント系': 'green',
    'ストラテジ系': 'purple',
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">記述問題演習</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">実践的な長文・記述問題に挑戦しましょう</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterCat === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat === 'all' ? '全て' : cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(q => (
          <Card key={q.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelect(q)}>
            <div className="p-4">
              <div className="flex gap-2 mb-2">
                <Badge color={catColors[q.category] || 'blue'}>{q.category}</Badge>
                <Badge color="gray">{q.subcategory}</Badge>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">{q.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{q.scenario.slice(0, 100)}...</p>
              <p className="text-xs text-gray-400 mt-2">{q.questions.length} 設問</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
