import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Button } from '../components/common/Button';

export function SettingsScreen() {
  const { apiKey, setApiKey, settings, updateSettings, resetProgress, totalStats } = useApp();
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [keySaved, setKeySaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  function handleSaveKey() {
    setApiKey(keyInput.trim());
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  }

  function handleDeleteKey() {
    setApiKey('');
    setKeyInput('');
  }

  function handleReset() {
    resetProgress();
    setShowResetConfirm(false);
  }

  return (
    <div className="space-y-5 max-w-lg mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">設定</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">アプリの設定を変更できます</p>
      </div>

      {/* Display */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">表示設定</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">ダークモード</p>
              <p className="text-xs text-gray-500">目に優しい暗い配色に切り替えます</p>
            </div>
            <button
              onClick={() => updateSettings({ darkMode: !settings.darkMode })}
              className={`relative w-12 h-6 rounded-full transition-colors ${settings.darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </CardBody>
      </Card>

      {/* Claude API Key */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Claude API 設定（オプション）</h2>
        </CardHeader>
        <CardBody className="space-y-3">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
            <p className="text-xs text-yellow-800 dark:text-yellow-300">
              ⚠️ <strong>注意:</strong> APIキーはブラウザのlocalStorageに保存されます。
              共有PCや公共の場所では使用しないでください。
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Anthropic APIキー
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <p className="text-xs text-gray-500">
            APIキーを設定すると、問題の解説画面で「AIに詳しく聞く」ボタンが有効になります。
            使用するモデル: claude-sonnet-4-20250514
          </p>

          <div className="flex gap-2">
            <Button
              onClick={handleSaveKey}
              variant={keySaved ? 'success' : 'primary'}
              size="sm"
              disabled={!keyInput.trim()}
            >
              {keySaved ? '✓ 保存しました' : '保存する'}
            </Button>
            {apiKey && (
              <Button onClick={handleDeleteKey} variant="danger" size="sm">
                削除する
              </Button>
            )}
          </div>

          {apiKey && (
            <p className="text-xs text-green-600 dark:text-green-400">✓ APIキーが設定されています</p>
          )}
        </CardBody>
      </Card>

      {/* Progress */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">学習データ</h2>
        </CardHeader>
        <CardBody className="space-y-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>総回答数: <span className="font-semibold text-gray-800 dark:text-gray-200">{totalStats.total} 問</span></p>
            <p>全体正答率: <span className="font-semibold text-gray-800 dark:text-gray-200">{totalStats.rate !== null ? `${totalStats.rate}%` : '--'}</span></p>
          </div>

          {!showResetConfirm ? (
            <Button onClick={() => setShowResetConfirm(true)} variant="danger" size="sm">
              学習データをリセット
            </Button>
          ) : (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3">
              <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                本当にリセットしますか？すべての回答履歴・進捗データが削除されます。この操作は元に戻せません。
              </p>
              <div className="flex gap-2">
                <Button onClick={handleReset} variant="danger" size="sm">はい、リセットします</Button>
                <Button onClick={() => setShowResetConfirm(false)} variant="secondary" size="sm">キャンセル</Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">アプリについて</h2>
        </CardHeader>
        <CardBody>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p><span className="font-medium">アプリ名:</span> FEPass - 基本情報技術者試験 学習アプリ</p>
            <p><span className="font-medium">バージョン:</span> 1.0.0</p>
            <p><span className="font-medium">問題数:</span> 100問以上（四択）+ 長文記述問題</p>
            <p><span className="font-medium">データ保存:</span> すべてブラウザのローカルストレージに保存</p>
            <p className="text-xs text-gray-400 mt-2">このアプリはオフラインでも動作します（APIキー機能を除く）</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
