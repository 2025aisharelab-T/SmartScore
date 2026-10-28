import React, { useState } from 'react';
import { Key, Eye, EyeOff, Check, X, ShieldAlert, Zap } from 'lucide-react';
import { useEvaluation } from '../../context/EvaluationContext.jsx';

export default function ApiKeyModal({ isOpen, onClose }) {
  const { apiKey, setApiKey } = useEvaluation();
  const [tempKey, setTempKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setApiKey(tempKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">OpenAI API 키 설정</h2>
            <p className="text-xs text-slate-400">GPT-4o Vision 수기 표 인식용 API Key</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              OpenAI API Key (sk-...)
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl py-2.5 pl-3 pr-10 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 text-xs space-y-2">
            <div className="flex items-start gap-2 text-slate-400">
              <Zap className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>API 키 미입력 시:</strong> 스마트 시뮬레이션용 Mock OCR 데이터를 활용하여 전체 기능을 무료로 체험하실 수 있습니다.
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>입력된 키는 브라우저 LocalStorage에만 안전하게 저장됩니다.</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800 transition"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/25 transition active:scale-95"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" /> 저장 완료
                </>
              ) : (
                '설정 저장'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
