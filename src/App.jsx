import React from 'react';
import { EvaluationProvider, useEvaluation } from './context/EvaluationContext.jsx';
import Header from './components/common/Header.jsx';
import StepIndicator from './components/common/StepIndicator.jsx';
import Step1Container from './components/step1/Step1Container.jsx';
import Step2Container from './components/step2/Step2Container.jsx';
import Step3Container from './components/step3/Step3Container.jsx';

function AppContent() {
  const { currentStep } = useEvaluation();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <Header />

      {/* Step Indicator Bar */}
      <StepIndicator />

      {/* Main Container */}
      <main className="flex-1 p-4 md:p-6">
        {currentStep === 1 && <Step1Container />}
        {currentStep === 2 && <Step2Container />}
        {currentStep === 3 && <Step3Container />}
      </main>

      {/* Footer */}
      <footer className="w-full bg-slate-900/60 border-t border-slate-800/60 py-3 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>SmartScore © 2026 Assessment Score Aggregator Engine</div>
          <div className="text-[11px] text-slate-600">
            Powered by OpenAI GPT-4o Vision API & Responsive PWA Architecture
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <EvaluationProvider>
      <AppContent />
    </EvaluationProvider>
  );
}
