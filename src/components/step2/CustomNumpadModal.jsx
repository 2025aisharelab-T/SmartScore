import React, { useState, useEffect } from 'react';
import { X, Delete, Check, ArrowUpRight } from 'lucide-react';
import { useEvaluation } from '../../context/EvaluationContext.jsx';

export default function CustomNumpadModal() {
  const { numpadState, closeNumpad, updateEvaluator, evaluators } = useEvaluation();
  const [value, setValue] = useState('');

  useEffect(() => {
    if (numpadState) {
      setValue(String(numpadState.currentScore ?? ''));
    }
  }, [numpadState]);

  if (!numpadState) return null;

  const { evaluatorId, criterionId, maxScore, label } = numpadState;
  const isTotalEdit = criterionId === 'extractedTotalScore';

  const handleDigit = (digit) => {
    let next = value + digit;
    // Remove leading zeros
    if (next.length > 1 && next.startsWith('0')) next = next.slice(1);
    
    // Cap score at maxScore if applicable
    if (maxScore && Number(next) > maxScore) {
      next = String(maxScore);
    }
    setValue(next);
  };

  const handleBackspace = () => {
    setValue(value.slice(0, -1));
  };

  const handleClear = () => {
    setValue('');
  };

  const handleSetMax = () => {
    if (maxScore) setValue(String(maxScore));
  };

  const handleSave = () => {
    const num = Math.max(0, Number(value) || 0);

    if (isTotalEdit) {
      updateEvaluator(evaluatorId, { extractedTotalScore: num });
    } else {
      const ev = evaluators.find(e => e.id === evaluatorId);
      if (ev) {
        const newItemScores = { ...ev.itemScores, [criterionId]: num };
        updateEvaluator(evaluatorId, { itemScores: newItemScores });
      }
    }
    closeNumpad();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="text-[11px] font-bold text-blue-400">{label || '점수 수정'}</div>
            <div className="text-xs text-slate-400">
              배점 한도: <strong className="text-slate-200">{maxScore ? `${maxScore}점` : '자율'}</strong>
            </div>
          </div>
          <button
            onClick={closeNumpad}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Number Display Box */}
        <div className="bg-slate-950 border border-slate-700/80 rounded-2xl p-4 text-right flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">입력 점수</div>
          <div className="text-3xl font-black font-mono text-blue-400 tracking-wider">
            {value === '' ? <span className="text-slate-700">0</span> : value}
            <span className="text-sm text-slate-500 font-normal ml-1">점</span>
          </div>
        </div>

        {/* Numpad Keypad Grid */}
        <div className="grid grid-cols-3 gap-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(digit => (
            <button
              key={digit}
              onClick={() => handleDigit(digit)}
              className="py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-blue-600 active:text-white text-slate-100 font-black text-xl shadow transition duration-150"
            >
              {digit}
            </button>
          ))}

          {/* Special Action Row */}
          <button
            onClick={handleClear}
            className="py-3.5 rounded-xl bg-slate-950 hover:bg-rose-500/20 text-rose-400 font-bold text-xs border border-rose-500/30 transition"
          >
            전체 지우기
          </button>

          <button
            onClick={() => handleDigit('0')}
            className="py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-blue-600 active:text-white text-slate-100 font-black text-xl shadow transition"
          >
            0
          </button>

          <button
            onClick={handleBackspace}
            className="py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 flex items-center justify-center border border-slate-800 transition"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Max Score Shortcut & Save */}
        <div className="flex items-center gap-2 pt-2">
          {maxScore && (
            <button
              onClick={handleSetMax}
              className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold transition flex items-center justify-center gap-1"
            >
              <span>만점 ({maxScore}점) 입력</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleSave}
            className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>수정 저장</span>
          </button>
        </div>
      </div>
    </div>
  );
}
