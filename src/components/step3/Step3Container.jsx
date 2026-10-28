import React from 'react';
import { ArrowLeft, RefreshCw, CheckCircle2, Sparkles } from 'lucide-react';
import { useEvaluation } from '../../context/EvaluationContext.jsx';
import ScoreStats from './ScoreStats.jsx';
import AggregationTable from './AggregationTable.jsx';
import ExportToolbar from './ExportToolbar.jsx';

export default function Step3Container() {
  const { setCurrentStep, resetToDefaultMock } = useEvaluation();

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-emerald-900/30 to-slate-900 border border-emerald-500/20 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
              Step 3
            </span>
            <h2 className="text-lg font-bold text-white">종합 평가표 집계 및 내보내기</h2>
          </div>
          <p className="text-xs text-slate-300">
            모든 평가위원의 수기 평가 데이터 집계가 완료되었습니다. 전체 평균, 조정 평균(최고/최저 제외) 확인 및 내보내기가 가능합니다.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setCurrentStep(2)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" /> 점수 재검증 (Step 2)
          </button>
        </div>
      </div>

      {/* Analytics Summary */}
      <ScoreStats />

      {/* Aggregation Table */}
      <AggregationTable />

      {/* Export Toolbar */}
      <ExportToolbar />
    </div>
  );
}
