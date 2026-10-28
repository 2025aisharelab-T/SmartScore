import React, { useState } from 'react';
import { Sliders, Plus, Trash2, X, Check, RotateCcw } from 'lucide-react';
import { useEvaluation } from '../../context/EvaluationContext.jsx';
import { DEFAULT_CRITERIA } from '../../services/mockOcrData.js';

export default function CriteriaModal({ isOpen, onClose }) {
  const { criteria, setCriteria } = useEvaluation();
  const [localCriteria, setLocalCriteria] = useState(criteria);

  if (!isOpen) return null;

  const handleScoreChange = (id, newMaxScore) => {
    const num = Math.max(1, Math.min(100, Number(newMaxScore) || 0));
    setLocalCriteria(localCriteria.map(c => c.id === id ? { ...c, maxScore: num } : c));
  };

  const handleNameChange = (id, newName) => {
    setLocalCriteria(localCriteria.map(c => c.id === id ? { ...c, name: newName } : c));
  };

  const handleAddCriterion = () => {
    const newId = `crit-${Date.now()}`;
    setLocalCriteria([
      ...localCriteria,
      { id: newId, name: `새 평가 항목 ${localCriteria.length + 1}`, maxScore: 20 }
    ]);
  };

  const handleDeleteCriterion = (id) => {
    if (localCriteria.length <= 1) {
      alert('최소 1개 이상의 평가 항목이 필요합니다.');
      return;
    }
    setLocalCriteria(localCriteria.filter(c => c.id !== id));
  };

  const handleReset = () => {
    setLocalCriteria(DEFAULT_CRITERIA);
  };

  const handleSave = () => {
    setCriteria(localCriteria);
    onClose();
  };

  const totalMaxScore = localCriteria.reduce((sum, c) => sum + Number(c.maxScore || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">평가항목 커스텀 설정</h2>
            <p className="text-xs text-slate-400">항목명 및 항목별 배점 한도 조정</p>
          </div>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {localCriteria.map((crit, idx) => (
            <div key={crit.id} className="flex items-center gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-500 w-5">{idx + 1}</span>
              <input
                type="text"
                value={crit.name}
                onChange={(e) => handleNameChange(crit.id, e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                placeholder="평가 항목명"
              />
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400">배점:</span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={crit.maxScore}
                  onChange={(e) => handleScoreChange(crit.id, e.target.value)}
                  className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-center text-indigo-400 font-bold focus:outline-none focus:border-indigo-500"
                />
                <span className="text-xs text-slate-500">점</span>
              </div>
              <button
                onClick={() => handleDeleteCriterion(crit.id)}
                className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddCriterion}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 rounded-xl transition"
            >
              <Plus className="w-3.5 h-3.5" /> 항목 추가
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 rounded-xl transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> 초기화
            </button>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400">
              총 배점합: <strong className="text-indigo-400">{totalMaxScore}점</strong>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800 transition"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1 px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/25 transition active:scale-95"
          >
            <Check className="w-4 h-4" /> 적용 저장
          </button>
        </div>
      </div>
    </div>
  );
}
