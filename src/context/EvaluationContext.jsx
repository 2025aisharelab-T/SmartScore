import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_CRITERIA, INITIAL_EVALUATORS_MOCK } from '../services/mockOcrData.js';

const EvaluationContext = createContext(null);

const STORAGE_KEY_API_KEY = 'smart_score_openai_api_key';
const STORAGE_KEY_CRITERIA = 'smart_score_criteria';
const STORAGE_KEY_EVALUATORS = 'smart_score_evaluators';

export function EvaluationProvider({ children }) {
  const [apiKey, setApiKeyState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_API_KEY) || '';
  });

  const [criteria, setCriteriaState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CRITERIA);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_CRITERIA;
  });

  const [evaluators, setEvaluatorsState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_EVALUATORS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_EVALUATORS_MOCK;
  });

  const [currentStep, setCurrentStep] = useState(1); // 1: Capture, 2: Validate, 3: Aggregate
  const [activeEvaluatorId, setActiveEvaluatorId] = useState('eval-3'); // Default to mismatch sample for easy review
  const [numpadState, setNumpadState] = useState(null); // { evaluatorId, criterionId, currentScore, maxScore, label }

  // Persist settings
  const setApiKey = (key) => {
    setApiKeyState(key);
    localStorage.setItem(STORAGE_KEY_API_KEY, key);
  };

  const setCriteria = (newCriteria) => {
    setCriteriaState(newCriteria);
    localStorage.setItem(STORAGE_KEY_CRITERIA, JSON.stringify(newCriteria));
  };

  const setEvaluators = (newEvaluators) => {
    setEvaluatorsState(newEvaluators);
    localStorage.setItem(STORAGE_KEY_EVALUATORS, JSON.stringify(newEvaluators));
  };

  const addEvaluator = (evaluatorData) => {
    const newEvaluator = {
      id: `eval-${Date.now()}`,
      name: evaluatorData.name || `평가위원 ${String.fromCharCode(65 + evaluators.length)}`,
      imageUrl: evaluatorData.imageUrl || null,
      itemScores: evaluatorData.itemScores || {},
      extractedTotalScore: evaluatorData.extractedTotalScore || 0,
      notes: evaluatorData.notes || '신규 등록'
    };
    const updated = [...evaluators, newEvaluator];
    setEvaluators(updated);
    setActiveEvaluatorId(newEvaluator.id);
    return newEvaluator.id;
  };

  const updateEvaluator = (id, partialData) => {
    const updated = evaluators.map(ev => {
      if (ev.id === id) {
        return {
          ...ev,
          ...partialData,
          itemScores: partialData.itemScores ? { ...ev.itemScores, ...partialData.itemScores } : ev.itemScores
        };
      }
      return ev;
    });
    setEvaluators(updated);
  };

  const deleteEvaluator = (id) => {
    const updated = evaluators.filter(ev => ev.id !== id);
    setEvaluators(updated);
    if (activeEvaluatorId === id) {
      setActiveEvaluatorId(updated[0]?.id || null);
    }
  };

  const resetToDefaultMock = () => {
    setEvaluators(INITIAL_EVALUATORS_MOCK);
    setCriteria(DEFAULT_CRITERIA);
    setActiveEvaluatorId('eval-3');
    setCurrentStep(1);
  };

  const openNumpad = (evaluatorId, criterionId, currentScore, maxScore, label) => {
    setNumpadState({ evaluatorId, criterionId, currentScore, maxScore, label });
  };

  const closeNumpad = () => {
    setNumpadState(null);
  };

  const activeEvaluator = evaluators.find(e => e.id === activeEvaluatorId) || evaluators[0] || null;

  return (
    <EvaluationContext.Provider
      value={{
        apiKey,
        setApiKey,
        criteria,
        setCriteria,
        evaluators,
        setEvaluators,
        addEvaluator,
        updateEvaluator,
        deleteEvaluator,
        resetToDefaultMock,
        currentStep,
        setCurrentStep,
        activeEvaluatorId,
        setActiveEvaluatorId,
        activeEvaluator,
        numpadState,
        openNumpad,
        closeNumpad
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );
}

export function useEvaluation() {
  const ctx = useContext(EvaluationContext);
  if (!ctx) {
    throw new Error('useEvaluation must be used within an EvaluationProvider');
  }
  return ctx;
}
