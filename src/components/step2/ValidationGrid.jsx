import React from 'react';
import { Edit3, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useEvaluation } from '../../context/EvaluationContext.jsx';
import { validateEvaluatorScore } from '../../utils/scoreValidation.js';
import DiscrepancyBadge from './DiscrepancyBadge.jsx';

export default function ValidationGrid({ evaluator }) {
  const { criteria, openNumpad } = useEvaluation();

  if (!evaluator) return null;

  const { isValid, calculatedTotal, extractedTotal, difference } = validateEvaluatorScore(evaluator);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold text-slate-400">검증 및 점수 수정</span>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <span>{evaluator.name}</span>
            {isValid ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> 검증 완료
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> 불일치 경고
              </span>
            )}
          </h3>
        </div>

        <div className="text-right">
          <div className="text-[11px] text-slate-400">자동 계산 총점</div>
          <div className="text-xl font-black font-mono text-blue-400">{calculatedTotal}점</div>
        </div>
      </div>

      {/* Discrepancy Banner */}
      <DiscrepancyBadge
        isValid={isValid}
        calculatedTotal={calculatedTotal}
        extractedTotal={extractedTotal}
        difference={difference}
      />

      {/* Interactive Criteria Cards / Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 block mb-2">
          세부 항목 점수 터치 시 수치 입력 패드(Numpad) 오픈:
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {criteria.map((crit, idx) => {
            const score = evaluator.itemScores?.[crit.id] ?? 0;
            const isFull = score === crit.maxScore;

            return (
              <div
                key={crit.id}
                onClick={() => openNumpad(evaluator.id, crit.id, score, crit.maxScore, `${crit.name} 점수`)}
                className="bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/50 p-4 rounded-2xl cursor-pointer transition shadow group flex items-center justify-between"
              >
                <div>
                  <div className="text-[11px] text-slate-500 font-bold">항목 #{idx + 1}</div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition">
                    {crit.name}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">배점 한도: {crit.maxScore}점</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-black font-mono text-slate-100 group-hover:text-blue-400 transition">
                      {score}
                      <span className="text-xs text-slate-500 font-normal"> / {crit.maxScore}</span>
                    </div>
                    {isFull && <span className="text-[9px] font-bold text-indigo-400">만점</span>}
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 group-hover:bg-blue-600 text-slate-400 group-hover:text-white transition">
                    <Edit3 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Extracted Total Score Cell */}
      <div
        onClick={() => openNumpad(evaluator.id, 'extractedTotalScore', extractedTotal, 100, 'OCR 표기 총점 수정')}
        className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between shadow ${
          !isValid
            ? 'bg-rose-500/10 border-rose-500/50 hover:border-rose-400'
            : 'bg-slate-950 border-slate-800 hover:border-blue-500/40'
        }`}
      >
        <div>
          <div className="text-xs font-extrabold text-slate-300">표기된 OCR 총점 (Handwritten Written Total)</div>
          <div className="text-[11px] text-slate-500">
            {isValid ? '항목 합계와 일치함' : '⚠️ 오차가 있는 경우 종이 표기 총점을 직접 수정할 수 있습니다.'}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className={`text-2xl font-black font-mono ${!isValid ? 'text-rose-400' : 'text-emerald-400'}`}>
              {extractedTotal}점
            </div>
            <span className="text-[10px] text-slate-500">클릭하여 수정</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 text-slate-400">
            <Edit3 className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
