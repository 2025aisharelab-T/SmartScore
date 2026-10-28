import React from 'react';
import { Users, Award, TrendingUp, ShieldCheck } from 'lucide-react';
import { useEvaluation } from '../../context/EvaluationContext.jsx';
import { calculateOverallStats } from '../../utils/scoreValidation.js';

export default function ScoreStats() {
  const { evaluators } = useEvaluation();
  const stats = calculateOverallStats(evaluators);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Stat Card 1 */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center gap-3">
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] text-slate-400 font-bold">전체 평가위원 수</div>
          <div className="text-xl font-black text-slate-100">{stats.totalEvaluators}명</div>
        </div>
      </div>

      {/* Stat Card 2 */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center gap-3">
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] text-slate-400 font-bold">검증 정상 수치</div>
          <div className="text-xl font-black text-emerald-400">{stats.validCount}명 / {stats.totalEvaluators}명</div>
        </div>
      </div>

      {/* Stat Card 3 */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center gap-3">
        <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] text-slate-400 font-bold">전체 평균 점수</div>
          <div className="text-xl font-black font-mono text-indigo-300">{stats.averageScore}점</div>
        </div>
      </div>

      {/* Stat Card 4 */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center gap-3">
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] text-slate-400 font-bold">조정 평균 (최고/최저 제외)</div>
          <div className="text-xl font-black font-mono text-amber-400">{stats.trimmedMean}점</div>
        </div>
      </div>
    </div>
  );
}
