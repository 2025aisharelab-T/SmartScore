/**
 * Score Validation & Aggregation Utility Functions
 */

/**
 * Calculates sum of item scores for an evaluator
 * @param {Record<string, number>} itemScores 
 * @returns {number}
 */
export function calculateItemTotal(itemScores = {}) {
  return Object.values(itemScores).reduce((sum, score) => sum + (Number(score) || 0), 0);
}

/**
 * Validates whether an evaluator's item sum matches the OCR-extracted total score
 * @param {Object} evaluator 
 * @returns {Object} { isValid, calculatedTotal, extractedTotal, difference }
 */
export function validateEvaluatorScore(evaluator) {
  if (!evaluator) return { isValid: true, calculatedTotal: 0, extractedTotal: 0, difference: 0 };
  
  const calculatedTotal = calculateItemTotal(evaluator.itemScores);
  const extractedTotal = Number(evaluator.extractedTotalScore) || 0;
  const isValid = calculatedTotal === extractedTotal;
  const difference = calculatedTotal - extractedTotal;

  return {
    isValid,
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
