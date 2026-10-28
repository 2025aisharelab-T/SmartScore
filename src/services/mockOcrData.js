/**
 * Mock OCR Service & Sample Data Generator
 * Provides realistic evaluation scores with handwriting simulation samples
 */

export const DEFAULT_CRITERIA = [
  { id: 'crit-1', name: '(샘플) 기획성 및 독창성', maxScore: 20 },
  { id: 'crit-2', name: '(샘플) 기술적 완성도', maxScore: 30 },
  { id: 'crit-3', name: '(샘플) 사업성 및 시장성', maxScore: 30 },
  { id: 'crit-4', name: '(샘플) 수행 능력 및 팀구성', maxScore: 20 },
];

export const INITIAL_EVALUATORS_MOCK = [
  {
    id: 'eval-1',
    name: '(샘플) 평가위원 A (김철수)',
    itemScores: { 'crit-1': 18, 'crit-2': 27, 'crit-3': 26, 'crit-4': 18 },
    extractedTotalScore: 89, // 18+27+26+18 = 89 (MATCH)
    notes: '항목별 평가 완료'
  },
  {
    id: 'eval-2',
    name: '(샘플) 평가위원 B (이영희)',
    itemScores: { 'crit-1': 17, 'crit-2': 28, 'crit-3': 29, 'crit-4': 19 },
    extractedTotalScore: 93, // 17+28+29+19 = 93 (MATCH - Maximum Total)
    notes: '우수한 기술 완성도'
  },
  {
    id: 'eval-3',
    name: '(샘플) 평가위원 C (박민수)',
    itemScores: { 'crit-1': 15, 'crit-2': 22, 'crit-3': 24, 'crit-4': 16 },
    extractedTotalScore: 82, // 15+22+24+16 = 77, but handwriting error OCR total 82 (MISMATCH -> Red warning)
    notes: '인식 총점 불일치 샘플 (합계 77 vs 총점 82)'
  },
  {
    id: 'eval-4',
    name: '(샘플) 평가위원 D (정수진)',
    itemScores: { 'crit-1': 14, 'crit-2': 20, 'crit-3': 21, 'crit-4': 15 },
    extractedTotalScore: 70, // 14+20+21+15 = 70 (MATCH - Minimum Total)
    notes: '기획 부분 보완 필요'
  },
  {
    id: 'eval-5',
    name: '(샘플) 평가위원 E (최동현)',
    itemScores: { 'crit-1': 19, 'crit-2': 26, 'crit-3': 27, 'crit-4': 18 },
    extractedTotalScore: 90, // 19+26+27+18 = 90 (MATCH)
    notes: '팀 수행 역량 양호'
  },
  {
    id: 'eval-6',
    name: '(샘플) 평가위원 F (한지민)',
    itemScores: { 'crit-1': 16, 'crit-2': 25, 'crit-3': 23, 'crit-4': 17 },
    extractedTotalScore: 81, // 16+25+23+17 = 81 (MATCH)
    notes: '시장성 양호'
  },
  {
    id: 'eval-7',
    name: '(샘플) 평가위원 G (강태웅)',
    itemScores: { 'crit-1': 17, 'crit-2': 24, 'crit-3': 25, 'crit-4': 17 },
    extractedTotalScore: 83, // 17+24+25+17 = 83 (MATCH)
    notes: '전반적 무난한 평점'
  }
];

/**
 * Generates dynamic mock OCR analysis result for a newly uploaded evaluation image
 * @param {Array<Object>} criteria 
 * @param {boolean} simulateMismatch 
 * @returns {Promise<Object>}
 */
export function simulateMockOcr(criteria = DEFAULT_CRITERIA, simulateMismatch = false) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const itemScores = {};
      let total = 0;

      criteria.forEach(crit => {
        // Random score between 70% ~ 95% of maxScore
        const score = Math.round((crit.maxScore * (0.7 + Math.random() * 0.25)));
        itemScores[crit.id] = score;
        total += score;
      });

      // Introduce artificial mismatch if requested
      const extractedTotalScore = simulateMismatch ? total + 5 : total;

      resolve({
        success: true,
        itemScores,
        extractedTotalScore,
        confidence: 0.96,
        isMock: true,
        notes: simulateMismatch ? '인식 총점 오차 감지됨 (수동 확인 권장)' : '정상 판독 완료'
      });
    }, 1200); // Realistic 1.2s delay
  });
}
