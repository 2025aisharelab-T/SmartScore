import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Share2, Mail, Copy, Check } from 'lucide-react';
import { useEvaluation } from '../../context/EvaluationContext.jsx';
import { exportToCsv, exportToTxt } from '../../services/exportService.js';

export default function ExportToolbar() {
  const { evaluators, criteria } = useEvaluation();
  const [copied, setCopied] = useState(false);

  const handleCsvExport = () => {
    exportToCsv(evaluators, criteria);
  };

  const handleTxtExport = () => {
    exportToTxt(evaluators, criteria);
  };

  const handleCopySummary = () => {
    const text = evaluators.map(ev => {
      const scores = criteria.map(c => `${c.name}: ${ev.itemScores?.[c.id] || 0}점`).join(', ');
      return `[${ev.name}] ${scores} => 총점: ${ev.extractedTotalScore}점`;
    }).join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleMailShare = () => {
    const subject = encodeURIComponent('[SmartScore] 평가위원 수기 평가표 집계 결과 보고');
    const body = encodeURIComponent(
      `안녕하세요.\nSmartScore 평가 집계 결과입니다.\n\n` +
      `총 평가위원: ${evaluators.length}명\n\n` +
      evaluators.map(e => `- ${e.name}: 총점 ${e.extractedTotalScore}점`).join('\n') +
      `\n\n감사합니다.`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-400" />
          집계 데이터 변환 및 공유 Export Toolbar
        </h4>
        <p className="text-xs text-slate-400 mt-0.5">
          검증이 완료된 평가 데이터를 CSV(Excel), TXT 문서로 다운로드하거나 이메일로 바로 공유하세요.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <button
          onClick={handleCsvExport}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition active:scale-95"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>CSV (Excel) 내보내기</span>
        </button>

        <button
          onClick={handleTxtExport}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20 transition active:scale-95"
        >
          <FileText className="w-4 h-4" />
          <span>TXT 보고서 다운로드</span>
        </button>

        <button
          onClick={handleCopySummary}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition"
          title="요약 클립보드 복사"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>

        <button
          onClick={handleMailShare}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition"
          title="이메일 공유"
        >
          <Mail className="w-4 h-4 text-indigo-400" />
        </button>
      </div>
    </div>
  );
}
