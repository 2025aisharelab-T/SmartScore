import React from 'react';
import { Award, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import { useEvaluation } from '../../context/EvaluationContext.jsx';
import { validateEvaluatorScore, findMaxMinEvaluators } from '../../utils/scoreValidation.js';
import { formatScore } from '../../utils/formatters.js';

export default function AggregationTable() {
  const { evaluators, criteria, deleteEvaluator, setCurrentStep, setActiveEvaluatorId } = useEvaluation();

  const { maxEvaluatorId, minEvaluatorId } = findMaxMinEvaluators(evaluators);

  // Column level average calculation
  const getCriteriaAvg = (critId) => {
    if (!evaluators.length) return 0;
    const sum = evaluators.reduce((acc, ev) => acc + (Number(ev.itemScores?.[critId]) || 0), 0);
    return sum / evaluators.length;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            평가위원별 세부 항목 점수 및 총점 종합 데이터 테이블
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            최고 총점(<span className="text-blue-400 font-bold">연한 파란색 🟦</span>) 및 최저 총점(
            <span className="text-rose-400 font-bold">연한 붉은색 🟥</span>)이 음영 하이라이트됩니다.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[11px] font-bold">
          <span className="px-2.5 py-1 rounded-lg bg-blue-900/40 text-blue-300 border border-blue-500/40 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /> 최고 점수
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-rose-900/40 text-rose-300 border border-rose-500/40 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-400" /> 최저 점수
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider">
              <th className="py-3.5 px-4">NO</th>
              <th className="py-3.5 px-4 min-w-[140px]">평가위원명</th>
              {criteria.map((crit) => (
                <th key={crit.id} className="py-3.5 px-4 text-center min-w-[100px]">
                  {crit.name}
                  <div className="text-[10px] text-slate-500 font-normal lowercase">({crit.maxScore}점 만점)</div>
                </th>
              ))}
              <th className="py-3.5 px-4 text-center min-w-[110px]">OCR 표기 총점</th>
              <th className="py-3.5 px-4 text-center min-w-[110px] bg-slate-900">계산 합계 총점</th>
              <th className="py-3.5 px-4 text-center min-w-[100px]">검증 상태</th>
              <th className="py-3.5 px-4 text-center min-w-[60px]">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {evaluators.map((ev, idx) => {
              const { isValid, hasEmpty, hasZero, statusLabel, calculatedTotal, extractedTotal } = validateEvaluatorScore(ev, criteria);
              const isMax = ev.id === maxEvaluatorId;
              const isMin = ev.id === minEvaluatorId;

              // Row background styling
              let rowHighlight = 'hover:bg-slate-800/40';
              if (isMax) rowHighlight = 'bg-blue-950/30 hover:bg-blue-900/40';
              else if (isMin) rowHighlight = 'bg-rose-950/30 hover:bg-rose-900/40';

              return (
                <tr key={ev.id} className={`transition ${rowHighlight}`}>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-500">{idx + 1}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <span>{ev.name}</span>
                      {isMax && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-blue-500/20 text-blue-300 font-black">
                          MAX
                        </span>
                      )}
                      {isMin && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-rose-500/20 text-rose-300 font-black">
                          MIN
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Criteria Item Scores */}
                  {criteria.map((crit) => {
                    const raw = ev.itemScores?.[crit.id];
                    const isEmpty = (raw === '' || raw === null || raw === undefined);
                    const num = Number(raw);
                    const isZero = !isEmpty && num === 0;
                    return (
                      <td key={crit.id} className="py-3.5 px-4 text-center font-mono font-semibold">
                        {isEmpty ? (
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-bold">
                            빈값(오류)
                          </span>
                        ) : isZero ? (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                            0점(점검필요)
                          </span>
                        ) : (
                          <span className="text-slate-300">{num}</span>
                        )}
                      </td>
                    );
                  })}

                  {/* OCR Extracted Total */}
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-400">
                    {extractedTotal === 0 && hasZero ? (
                      <span className="text-amber-400">0 (점검필요)</span>
                    ) : extractedTotal}
                  </td>

                  {/* Calculated Total Cell (With MAX/MIN Highlighting) */}
                  <td className="py-3.5 px-4 text-center">
                    <div
                      className={`py-1.5 px-3 rounded-xl font-mono font-black text-sm border inline-block ${
                        isMax
                          ? 'bg-blue-900/50 text-blue-200 border-blue-400 shadow-md shadow-blue-500/20'
                          : isMin
                          ? 'bg-rose-900/50 text-rose-200 border-rose-400 shadow-md shadow-rose-500/20'
                          : 'bg-slate-950 text-slate-100 border-slate-800'
                      }`}
                    >
                      {calculatedTotal}점
                    </div>
                  </td>

                  {/* Validation Badge */}
                  <td className="py-3.5 px-4 text-center">
                    {isValid ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> 검수완료
                      </span>
                    ) : hasEmpty ? (
                      <button
                        onClick={() => {
                          setActiveEvaluatorId(ev.id);
                          setCurrentStep(2);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition cursor-pointer"
                        title="클릭 시 수정"
                      >
                        <AlertCircle className="w-3 h-3 animate-pulse" /> 오류 (빈값)
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveEvaluatorId(ev.id);
                          setCurrentStep(2);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition cursor-pointer"
                        title="클릭 시 수정"
                      >
                        <AlertCircle className="w-3 h-3 animate-pulse" /> {statusLabel || '점검필요'}
                      </button>
                    )}
                  </td>

                  {/* Delete Action */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => {
                        if (confirm(`'${ev.name}' 데이터를 삭제하시겠습니까?`)) {
                          deleteEvaluator(ev.id);
                        }
                      }}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Average Footer Row */}
          <tfoot>
            <tr className="bg-slate-950 font-bold border-t-2 border-slate-800 text-slate-300">
              <td colSpan={2} className="py-3.5 px-4 text-right text-xs font-black text-slate-400">
                평가 항목별 평균
              </td>
              {criteria.map((crit) => (
                <td key={crit.id} className="py-3.5 px-4 text-center font-mono text-indigo-400">
                  {formatScore(getCriteriaAvg(crit.id))}
                </td>
              ))}
              <td colSpan={4} className="py-3.5 px-4 text-slate-500 text-center font-mono text-[11px]">
                전체 종합 수치 자동 집계됨
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
