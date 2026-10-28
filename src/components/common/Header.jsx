import React, { useState } from 'react';
import { Sparkles, Key, Sliders, RotateCcw, ShieldCheck, Cpu } from 'lucide-react';
import { useEvaluation } from '../../context/EvaluationContext.jsx';
import ApiKeyModal from './ApiKeyModal.jsx';
import CriteriaModal from './CriteriaModal.jsx';

export default function Header() {
  const { apiKey, resetToDefaultMock } = useEvaluation();
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);
  const [isCriteriaOpen, setIsCriteriaOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-slate-900 border-b border-slate-800/80 px-4 py-3 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">SmartScore</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  PWA v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                AI 평가위원 수기 평가표 판독 & 자동 검증 집계 시스템
              </p>
            </div>
          </div>

          {/* Controls & Settings */}
          <div className="flex items-center gap-2">
            {/* Status indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              {apiKey ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-medium">GPT-4o Vision</span>
                </>
              ) : (
                <>
                  <Cpu className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-300 font-medium">Mock Simulator</span>
                </>
              )}
            </div>

            <button
              onClick={() => setIsApiKeyOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition"
              title="OpenAI API Key 설정"
            >
              <Key className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">API Key</span>
            </button>

            <button
              onClick={() => setIsCriteriaOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition"
              title="평가항목 커스텀 설정"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">항목 설정</span>
            </button>

            <button
              onClick={() => {
                if (confirm('샘플 데모 데이터로 초기화하시겠습니까?')) {
                  resetToDefaultMock();
                }
              }}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition"
              title="데모 초기화"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <ApiKeyModal isOpen={isApiKeyOpen} onClose={() => setIsApiKeyOpen(false)} />
      <CriteriaModal isOpen={isCriteriaOpen} onClose={() => setIsCriteriaOpen(false)} />
    </>
  );
}
