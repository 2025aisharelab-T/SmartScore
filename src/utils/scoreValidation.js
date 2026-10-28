/**
 * Score Validation & Aggregation Utility Functions
 */

/**
 * Calculates sum of item scores for an evaluator
 * @param {Record<string, number>} itemScores 
 * @returns {number}
 */
export function calculateItemTotal(itemScores = {}) {
  return Object.values(itemScores).reduce((sum, score) => {
    if (score === '' || score === null || score === undefined) return sum;
    const num = Number(score);
    return isNaN(num) ? sum : sum + num;
  }, 0);
}

/**
 * Validates whether an evaluator's item sum matches the OCR-extracted total score,
 * and checks for zero scores and empty fields.
 * @param {Object} evaluator 
 * @param {Array<Object>} [criteria]
 * @returns {Object} { isValid, hasEmpty, hasZero, statusLabel, calculatedTotal, extractedTotal, difference }
 */
export function validateEvaluatorScore(evaluator, criteria = []) {
  if (!evaluator) {
    return {
      isValid: false,
      hasEmpty: true,
      hasZero: false,
      statusLabel: '오류 (빈값)',
      calculatedTotal: 0,
      extractedTotal: 0,
      difference: 0
    };
  }

  const itemScores = evaluator.itemScores || {};
  let hasEmpty = false;
  let hasZero = false;

  if (criteria && criteria.length > 0) {
    criteria.forEach(c => {
      const val = itemScores[c.id];
      if (val === '' || val === null || val === undefined) {
        hasEmpty = true;
      } else {
        const num = Number(val);
        if (isNaN(num)) {
          hasEmpty = true;
        } else if (num === 0) {
          hasZero = true;
        }
      }
    });
  } else {
    const vals = Object.values(itemScores);
    if (vals.length === 0) {
      hasEmpty = true;
    } else {
      vals.forEach(v => {
        if (v === '' || v === null || v === undefined) {
          hasEmpty = true;
        } else {
          const num = Number(v);
          if (isNaN(num)) {
            hasEmpty = true;
          } else if (num === 0) {
            hasZero = true;
          }
        }
      });
    }
  }

  const rawExtracted = evaluator.extractedTotalScore;
  const isExtractedEmpty = (rawExtracted === '' || rawExtracted === null || rawExtracted === undefined || isNaN(Number(rawExtracted)));
  if (isExtractedEmpty) {
    hasEmpty = true;
  }
  const extractedTotal = isExtractedEmpty ? 0 : Number(rawExtracted);
  if (!isExtractedEmpty && extractedTotal === 0) {
    hasZero = true;
  }

  const calculatedTotal = calculateItemTotal(evaluator.itemScores);
  const isMismatch = (calculatedTotal !== extractedTotal);
  const isValid = !hasEmpty && !hasZero && !isMismatch;
  const difference = calculatedTotal - extractedTotal;

  let statusLabel = '검수완료';
  if (hasEmpty) {
    statusLabel = '오류 (빈값)';
  } else if (hasZero) {
    statusLabel = '점검필요 (0점)';
  } else if (isMismatch) {
    statusLabel = '점검필요 (불일치)';
  }

  return {
    isValid,
    hasEmpty,
    hasZero,
    statusLabel,
    calculatedTotal,
    extractedTotal,
    difference
  };
}

/**
 * Identifies the evaluator IDs with the maximum and minimum validated total scores
 * @param {Array<Object>} evaluators 
 * @returns {Object} { maxEvaluatorId, minEvaluatorId, maxScore, minScore }
 */
export function findMaxMinEvaluators(evaluators = []) {
  if (!evaluators || evaluators.length === 0) {
    return { maxEvaluatorId: null, minEvaluatorId: null, maxScore: null, minScore: null };
  }

  let maxScore = -Infinity;
  let minScore = Infinity;
  let maxEvaluatorId = null;
  let minEvaluatorId = null;

  evaluators.forEach(ev => {
    const total = calculateItemTotal(ev.itemScores);
    if (total > maxScore) {
      maxScore = total;
      maxEvaluatorId = ev.id;
    }
    if (total < minScore) {
      minScore = total;
      minEvaluatorId = ev.id;
    }
  });

  // If all scores are identical or less than 2 evaluators, prevent misleading highlight
  if (maxScore === minScore) {
    return { maxEvaluatorId: null, minEvaluatorId: null, maxScore, minScore };
  }

  return {
    maxEvaluatorId,
    minEvaluatorId,
    maxScore,
    minScore
  };
}

/**
 * Calculates overall summary statistics across all evaluators
 * @param {Array<Object>} evaluators 
 * @returns {Object} { totalEvaluators, averageScore, trimmedMean, validCount }
 */
export function calculateOverallStats(evaluators = []) {
  if (!evaluators || evaluators.length === 0) {
    return { totalEvaluators: 0, averageScore: 0, trimmedMean: 0, validCount: 0 };
  }

  const totals = evaluators.map(ev => calculateItemTotal(ev.itemScores));
  const validCount = evaluators.filter(ev => validateEvaluatorScore(ev).isValid).length;
  
  const sum = totals.reduce((a, b) => a + b, 0);
  const averageScore = sum / totals.length;

  let trimmedMean = averageScore;
  if (totals.length >= 3) {
    const sorted = [...totals].sort((a, b) => a - b);
    const middleScores = sorted.slice(1, sorted.length - 1);
    const middleSum = middleScores.reduce((a, b) => a + b, 0);
    trimmedMean = middleSum / middleScores.length;
  }

  return {
    totalEvaluators: evaluators.length,
    averageScore: Number(averageScore.toFixed(2)),
    trimmedMean: Number(trimmedMean.toFixed(2)),
    validCount
  };
}
