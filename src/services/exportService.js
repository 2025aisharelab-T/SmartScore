import { calculateItemTotal, validateEvaluatorScore, findMaxMinEvaluators, calculateOverallStats } from '../utils/scoreValidation.js';
import { formatDate, formatFileName, formatScore } from '../utils/formatters.js';

/**
 * Triggers browser file download
 * @param {string} content 
 * @param {string} fileName 
 * @param {string} mimeType 
 */
function downloadFile(content, fileName, mimeType = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports evaluation aggregate table as UTF-8 BOM CSV for MS Excel
 * @param {Array<Object>} evaluators 
 * @param {Array<Object>} criteria 
 */
export function exportToCsv(evaluators = [], criteria = []) {
  if (!evaluators.length) return;

  const BOM = '\uFEFF'; // MS Excel UTF-8 BOM
  const headers = ['연번', '평가위원명', ...criteria.map(c => `${c.name}(${c.maxScore}점)`), 'OCR 표기 총점', '검증 합계 총점', '검증 상태', '비고'];
  
  const rows = evaluators.map((ev, index) => {
    const val = validateEvaluatorScore(ev);
    const itemScores = criteria.map(c => ev.itemScores?.[c.id] ?? 0);
    const statusText = val.isValid ? '일치(정상)' : `불일치(오차 ${val.difference > 0 ? '+' : ''}${val.difference}점)`;
    
    return [
      index + 1,
      `"${ev.name.replace(/"/g, '""')}"`,
      ...itemScores,
      ev.extractedTotalScore,
      val.calculatedTotal,
      `"${statusText}"`,
      `"${(ev.notes || '').replace(/"/g, '""')}"`
    ];
  });

  // Calculate summary rows
  const stats = calculateOverallStats(evaluators);
  const summaryRow = ['-', '전체 평균', ...criteria.map(c => {
    const avg = evaluators.reduce((sum, e) => sum + (Number(e.itemScores?.[c.id]) || 0), 0) / evaluators.length;
    return formatScore(avg);
  }), '-', formatScore(stats.averageScore), `최고/최저 제외 평균: ${stats.trimmedMean}점`, ''];

  const csvContent = BOM + [headers.join(','), ...rows.map(r => r.join(',')), summaryRow.join(',')].join('\n');
  const filename = formatFileName('평가위원_수기평가표_집계표', 'csv');
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
}

/**
 * Exports readable TXT evaluation summary report
 * @param {Array<Object>} evaluators 
 * @param {Array<Object>} criteria 
 */
export function exportToTxt(evaluators = [], criteria = []) {
  if (!evaluators.length) return;

  const dateStr = formatDate();
  const stats = calculateOverallStats(evaluators);
  const { maxEvaluatorId, minEvaluatorId, maxScore, minScore } = findMaxMinEvaluators(evaluators);

  let txt = `=================================================================\n`;
  txt += `            SmartScore 평가위원 수기 평가표 종합 집계 보고서\n`;
  txt += `=================================================================\n`;
  txt += `작성일시: ${dateStr}\n`;
  txt += `총 평가위원 수: ${evaluators.length}명 (검증 완료: ${stats.validCount}명)\n`;
  txt += `종합 평균 점수: ${stats.averageScore}점 / 100점\n`;
  txt += `조정 평균 (최고/최저 제외): ${stats.trimmedMean}점\n`;
  txt += `-----------------------------------------------------------------\n\n`;

  txt += `[세부 평가항목 기준]\n`;
  criteria.forEach((c, idx) => {
    txt += `  ${idx + 1}. ${c.name} (배점: ${c.maxScore}점)\n`;
  });
  txt += `\n-----------------------------------------------------------------\n`;
  txt += `[평가위원별 세부 점수 및 검증 결과]\n`;

  evaluators.forEach((ev, idx) => {
    const val = validateEvaluatorScore(ev);
    const isMax = ev.id === maxEvaluatorId;
    const isMin = ev.id === minEvaluatorId;
    const tag = isMax ? ' ★[최고점]' : isMin ? ' ▲[최저점]' : '';

    txt += `\n#${idx + 1} ${ev.name}${tag}\n`;
    criteria.forEach(c => {
      txt += `  - ${c.name}: ${ev.itemScores?.[c.id] ?? 0}점 / ${c.maxScore}점\n`;
    });
    txt += `  - OCR 표기 총점: ${ev.extractedTotalScore}점\n`;
    txt += `  - 계산 합계 총점: ${val.calculatedTotal}점\n`;
    txt += `  - 검증 상태: ${val.isValid ? '정상 (일치)' : '⚠️ 불일치 경고 (확인 필요)'}\n`;
    if (ev.notes) txt += `  - 비고: ${ev.notes}\n`;
  });

  txt += `\n=================================================================\n`;
  txt += `SmartScore System Generated Report\n`;

  const filename = formatFileName('평가집계보고서', 'txt');
  downloadFile(txt, filename, 'text/plain;charset=utf-8;');
}
