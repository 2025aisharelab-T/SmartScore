import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Info, Sparkles, FileSpreadsheet } from 'lucide-react';
import { useEvaluation } from '../../context/EvaluationContext.jsx';
import EvaluatorSelector from './EvaluatorSelector.jsx';
import ImageUploader from './ImageUploader.jsx';

export default function Step1Container() {
  const { evaluators, addEvaluator, activeEvaluatorId, setActiveEvaluatorId, setCurrentStep } = useEvaluation();
  const [selectedId, setSelectedId] = useState(activeEvaluatorId || evaluators[0]?.id || 'eval-1');

  const handleAddNewEvaluator = () => {
    const newId = addEvaluator({});
    setSelectedId(newId);
  };

  const handleOcrSuccess = (evaluatorId, res) => {
    setActiveEvaluatorId(evaluatorId);
    // Auto prompt transition to Step 2 for verification
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/20 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
              Step 1
            </span>
            <h2 className="text-lg font-bold text-white">수기 평가표 스캔 및 데이터 추출</h2>
          </div>
          <p className="text-xs text-slate-300">
            평가위원의 종이 평가표를 스마트폰 카메라로 찍어 업로드하면 GPT-4o Vision이 세부 항목 점수와 총점을 판독합니다.
          </p>
        </div>

        <button
          onClick={() => setCurrentStep(2)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition flex-shrink-0 active:scale-95"
        >
          <span>검증 단계 이동 (Step 2)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Evaluator Selector */}
      <EvaluatorSelector
        selectedId={selectedId}
        onSelect={setSelectedId}
        onAddNew={handleAddNewEvaluator}
      />

      {/* Uploader Box */}
      <ImageUploader
        selectedEvaluatorId={selectedId}
        onOcrSuccess={handleOcrSuccess}
      />

      {/* Quick Status Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          현재 등록된 평가위원 인식 현황
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {evaluators.map(ev => {
            const hasData = ev.extractedTotalScore > 0;
            return (
              <div
                key={ev.id}
                onClick={() => {
                  setSelectedId(ev.id);
                  setActiveEvaluatorId(ev.id);
                  setCurrentStep(2);
                }}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                  hasData
                    ? 'bg-slate-950 border-slate-800 hover:border-blue-500/40'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                }`}
              >
                <div className="truncate">
                  <div className="font-bold text-slate-200">{ev.name}</div>
                  <div className="text-[10px] text-slate-500">{ev.notes || '점수 입력됨'}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-extrabold text-blue-400 text-sm">
                    {ev.extractedTotalScore || 0}점
                  </div>
                  <span className="text-[10px] text-slate-500">클릭 시 검증</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
