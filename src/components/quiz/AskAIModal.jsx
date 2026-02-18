import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';

export function AskAIModal({ question, onClose }) {
  const { apiKey } = useApp();
  const [userQuestion, setUserQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleAsk() {
    if (!userQuestion.trim() || !apiKey) return;
    setLoading(true);
    setError('');
    setResponse('');

    const systemPrompt = `あなたは基本情報技術者試験の専門家講師です。
受験生の質問に対して、試験に役立つ観点から丁寧に解説してください。
関連する試験のポイントや覚え方のコツも提供してください。
回答は日本語で、わかりやすく簡潔にまとめてください。`;

    const contextMessage = question
      ? `【問題】${question.question}\n【正解】${question.answer}: ${question.choices[question.answer]}\n【解説】${question.explanation}\n\n`
      : '';

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: `${contextMessage}質問: ${userQuestion}`,
            },
          ],
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || `APIエラー: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.content[0].text);
    } catch (e) {
      setError(e.message || 'APIの呼び出しに失敗しました。APIキーを確認してください。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">🤖 AIに質問する</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {question && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-sm text-gray-600 dark:text-gray-400">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">現在の問題</p>
              <p className="line-clamp-2">{question.question}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              質問を入力してください
            </label>
            <textarea
              value={userQuestion}
              onChange={e => setUserQuestion(e.target.value)}
              placeholder="例：この問題のポイントをもっと詳しく説明してください"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
              <span>AIが回答を生成中...</span>
            </div>
          )}

          {response && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">AIの回答</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{response}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
          <Button
            onClick={handleAsk}
            variant="primary"
            className="flex-1"
            disabled={!userQuestion.trim() || loading}
          >
            {loading ? '生成中...' : '質問する'}
          </Button>
          <Button onClick={onClose} variant="secondary">
            閉じる
          </Button>
        </div>
      </div>
    </div>
  );
}
