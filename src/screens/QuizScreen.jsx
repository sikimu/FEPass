import { useState, useEffect, useCallback } from 'react';
import { getRandomQuestions, getQuestionsBySubcategory, ALL_QUESTIONS } from '../utils/questions';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';

const CHOICE_KEYS = ['a', 'b', 'c', 'd'];
const CHOICE_LABELS = { a: 'A', b: 'B', c: 'C', d: 'D' };

export function QuizScreen({ params = {}, onNavigate }) {
  const { recordAnswer } = useApp();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [session, setSession] = useState({ correct: 0, total: 0 });
  const [finished, setFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const loadQuestions = useCallback(() => {
    let qs;
    if (params.subcategory) {
      qs = getQuestionsBySubcategory(params.subcategory);
      if (qs.length === 0) qs = ALL_QUESTIONS.filter(q => q.subcategory.includes(params.subcategory.slice(0, 8)));
      if (qs.length === 0) qs = getRandomQuestions(10);
    } else {
      qs = getRandomQuestions(10);
    }
    const shuffled = [...qs].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setSelected(null);
    setAnswered(false);
    setIsCorrect(null);
    setSession({ correct: 0, total: 0 });
    setFinished(false);
  }, [params.subcategory]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const currentQ = questions[currentIndex];

  function handleSelect(choice) {
    if (answered) return;
    setSelected(choice);
    const correct = recordAnswer(currentQ, choice);
    setIsCorrect(correct);
    setAnswered(true);
    setShowExplanation(true);
    setSession(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
  }

  function handleNext() {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelected(null);
      setAnswered(false);
      setIsCorrect(null);
      setShowExplanation(false);
    }
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-gray-500">問題を読み込み中...</p>
      </div>
    );
  }

  if (finished) {
    return <ResultSummary session={session} onRetry={loadQuestions} onHome={() => onNavigate('home')} onSyllabus={() => onNavigate('syllabus')} />;
  }

  const getChoiceStyle = (key) => {
    if (!answered) {
      return selected === key
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-pointer';
    }
    if (key === currentQ.answer) return 'border-green-500 bg-green-50 dark:bg-green-900/20';
    if (key === selected && key !== currentQ.answer) return 'border-red-500 bg-red-50 dark:bg-red-900/20';
    return 'border-gray-200 dark:border-gray-700 opacity-50';
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-gray-800 dark:text-gray-100">
            {params.subcategory ? params.subcategory : 'ランダム演習'}
          </h1>
          <p className="text-sm text-gray-500">{currentIndex + 1} / {questions.length} 問</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-green-600">{session.correct} 正解</p>
          <p className="text-xs text-gray-400">{session.total > 0 ? Math.round(session.correct / session.total * 100) : 0}%</p>
        </div>
      </div>

      {/* Progress */}
      <ProgressBar value={currentIndex} max={questions.length} color="blue" />

      {/* Question card */}
      <Card>
        <div className="p-5">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge color="blue">{currentQ.category}</Badge>
            <Badge color="gray">{currentQ.subcategory}</Badge>
            {currentQ.year && <Badge color="purple">{currentQ.year}年</Badge>}
          </div>

          <p className="text-gray-800 dark:text-gray-100 leading-relaxed font-medium">{currentQ.question}</p>
        </div>
      </Card>

      {/* Choices */}
      <div className="space-y-2">
        {CHOICE_KEYS.map(key => (
          <div
            key={key}
            className={`border-2 rounded-xl p-4 transition-all duration-150 ${getChoiceStyle(key)}`}
            onClick={() => handleSelect(key)}
          >
            <div className="flex items-start gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                answered && key === currentQ.answer
                  ? 'bg-green-500 text-white'
                  : answered && key === selected && key !== currentQ.answer
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}>
                {CHOICE_LABELS[key]}
              </span>
              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{currentQ.choices[key]}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Result feedback */}
      {answered && (
        <div className={`p-4 rounded-xl border-2 ${isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700'}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{isCorrect ? '⭕' : '❌'}</span>
            <span className={`font-bold ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {isCorrect ? '正解！' : `不正解。正解は ${CHOICE_LABELS[currentQ.answer]} です。`}
            </span>
          </div>
          {showExplanation && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">解説</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{currentQ.explanation}</p>
              {currentQ.tags && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {currentQ.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Next button */}
      {answered && (
        <Button onClick={handleNext} variant="primary" size="lg" className="w-full">
          {currentIndex + 1 >= questions.length ? '結果を見る' : '次の問題へ →'}
        </Button>
      )}
    </div>
  );
}

function ResultSummary({ session, onRetry, onHome, onSyllabus }) {
  const rate = session.total > 0 ? Math.round(session.correct / session.total * 100) : 0;
  const getEmoji = () => {
    if (rate >= 90) return '🎉';
    if (rate >= 70) return '😊';
    if (rate >= 50) return '😐';
    return '😢';
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card className="text-center p-8">
        <div className="text-5xl mb-4">{getEmoji()}</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">演習完了！</h2>
        <p className="text-gray-500 text-sm mb-6">{session.total} 問中 {session.correct} 問正解</p>

        <div className="text-6xl font-bold text-blue-600 mb-2">{rate}%</div>
        <ProgressBar value={rate} color={rate >= 80 ? 'green' : rate >= 60 ? 'blue' : 'red'} size="lg" />

        <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
          {rate >= 80 && <p>素晴らしい成績です！この調子で続けましょう！</p>}
          {rate >= 60 && rate < 80 && <p>良い成績です！苦手な問題を復習しましょう。</p>}
          {rate < 60 && <p>基礎を固めながら繰り返し練習しましょう。</p>}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3">
        <Button onClick={onRetry} variant="primary" size="lg" className="w-full">
          もう一度練習する
        </Button>
        <Button onClick={onSyllabus} variant="outline" size="lg" className="w-full">
          別の分野を選ぶ
        </Button>
        <Button onClick={onHome} variant="secondary" size="lg" className="w-full">
          ホームへ戻る
        </Button>
      </div>
    </div>
  );
}
