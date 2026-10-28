import React from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, UserCheck, Sparkles } from 'lucide-react';
import { useEvaluation } from '../../context/EvaluationContext.jsx';
import ImageReviewViewer from './ImageReviewViewer.jsx';
import ValidationGrid from './ValidationGrid.jsx';
import CustomNumpadModal from './CustomNumpadModal.jsx';
import { validateEvaluatorScore } from '../../utils/scoreValidation.js';

export default function Step2Container() {
  const { evaluators, activeEvaluatorId, setActiveEvaluatorId, activeEvaluator, setCurrentStep } = useEvaluation();

  const allValid = evaluators.every(ev => validateEvaluatorScore(ev).isValid);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-blue-900/30 to-slate-900 border border-indigo-500/20 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
              Step 2
            </span>
            <h2 className="text-lg font-bold text-white">데이터 수동 및 자동 교차 검증</h2>
          </div>
          <p className="text-xs text-slate-300">
            인식된 세부 점수 합계와 표기 총점을 자동 비교합니다. 불일치 셀(붉은색) 터치 시 터치패드(Numpad)로 즉시 수정 가능합니다.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setCurrentStep(1)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" /> 촬영 단계
          </button>

          <button
            onClick={() => setCurrentStep(3)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition active:scale-95"
          >
            <span>종합 집계표 확정 (Step 3)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Evaluator Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {evaluators.map(ev => {
          const { isValid } = validateEvaluatorScore(ev);
          const isSelected = activeEvaluatorId === ev.id;

          return (
            <button
              key={ev.id}
              onClick={() => setActiveEvaluatorId(ev.id)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-2 flex-shrink-0 ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{ev.name}</span>
              {!isValid && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {/* Two Pane Layout: Left Image Inspection / Right Score Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5">
          <ImageReviewViewer
            imageUrl={activeEvaluator?.imageUrl}
            evaluatorName={activeEvaluator?.name}
          />
        </div>

        <div className="md:col-span-7">
          <ValidationGrid evaluator={activeEvaluator} />
        </div>
      </div>

      {/* Numpad Popup Modal */}
      <CustomNumpadModal />
    </div>
  );
}
