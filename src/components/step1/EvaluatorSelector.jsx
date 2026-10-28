import React from 'react';
import { UserCheck, PlusCircle } from 'lucide-react';
import { useEvaluation } from '../../context/EvaluationContext.jsx';

export default function EvaluatorSelector({ selectedId, onSelect, onAddNew }) {
  const { evaluators } = useEvaluation();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-blue-400" />
          촬영/업로드 대상 평가위원 지정
        </label>
        <span className="text-[11px] text-slate-500">현재 등록된 평가위원: {evaluators.length}명</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {evaluators.map(ev => {
          const isSelected = selectedId === ev.id;
          return (
            <button
              key={ev.id}
              onClick={() => onSelect(ev.id)}
              className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <span className="truncate">{ev.name}</span>
              {isSelected && <span className="w-2 h-2 rounded-full bg-white animate-ping" />}
            </button>
          );
        })}

        <button
          onClick={onAddNew}
          className="px-3 py-2.5 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/5 text-xs font-bold transition flex items-center justify-center gap-1"
        >
          <PlusCircle className="w-4 h-4" />
          <span>평가위원 추가</span>
        </button>
      </div>
    </div>
  );
}
