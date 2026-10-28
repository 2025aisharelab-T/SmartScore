import React from 'react';
import { Camera, CheckCircle2, Table, ChevronRight } from 'lucide-react';
import { useEvaluation } from '../../context/EvaluationContext.jsx';

export default function StepIndicator() {
  const { currentStep, setCurrentStep } = useEvaluation();

  const steps = [
    { id: 1, title: 'Step 1. 촬영 및 업로드', icon: Camera, desc: '수기 평가표 이미지 Scan' },
    { id: 2, title: 'Step 2. 점수 교차 검증', icon: CheckCircle2, desc: '인식 데이터 수동 확인' },
    { id: 3, title: 'Step 3. 종합 집계 및 내보내기', icon: Table, desc: '최고/최저 음영 및 Export' },
  ];

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur border-b border-slate-800 py-3 px-4 shadow-md sticky top-0 z-20">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-left flex-shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-400/50'
                    : isCompleted
                    ? 'bg-slate-800/80 text-emerald-400 border border-slate-700/80 hover:bg-slate-800'
                    : 'bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {step.id}
                </div>
                <div>
                  <div className="text-xs font-bold leading-none">{step.title}</div>
                  <div className="text-[10px] opacity-75 hidden sm:block mt-0.5">{step.desc}</div>
                </div>
              </button>
              {idx < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0 hidden md:block" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
