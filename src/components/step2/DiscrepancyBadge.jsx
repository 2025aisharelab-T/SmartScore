import React from 'react';
import { AlertTriangle, CheckCircle2, ArrowRightLeft } from 'lucide-react';

export default function DiscrepancyBadge({ isValid, calculatedTotal, extractedTotal, difference }) {
  if (isValid) {
    return (
      <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2.5 rounded-xl text-xs font-bold animate-fadeIn">
        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
        <span>자동 합산 검증 성공! (세부항목 합계: {calculatedTotal}점 = 표기 총점: {extractedTotal}점)</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-rose-500/10 border border-rose-500/40 text-rose-300 p-3.5 rounded-xl text-xs font-bold animate-shake shadow-lg shadow-rose-950/40">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 animate-bounce" />
        <div>
          <span className="text-rose-200">총점 검증 불일치 감지!</span>
          <div className="text-[11px] text-rose-400/80 font-normal mt-0.5">
            세부 항목 점수의 합계({calculatedTotal}점)와 표기된 총점({extractedTotal}점)이 일치하지 않습니다. (오차: {difference > 0 ? `+${difference}` : difference}점)
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-rose-500/30 text-xs font-mono">
        <span className="text-slate-400">합계</span>
        <span className="text-rose-400 font-extrabold">{calculatedTotal}</span>
        <ArrowRightLeft className="w-3 h-3 text-slate-500" />
        <span className="text-slate-400">표기</span>
        <span className="text-amber-400 font-extrabold">{extractedTotal}</span>
      </div>
    </div>
  );
}
