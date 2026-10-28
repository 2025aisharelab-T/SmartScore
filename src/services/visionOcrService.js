import { simulateMockOcr, DEFAULT_CRITERIA } from './mockOcrData.js';

/**
 * Sends image payload to OpenAI GPT-4o Vision API or falls back to mock simulation
 * @param {string} base64Image 
 * @param {Array<Object>} criteria 
 * @param {string} apiKey 
 * @returns {Promise<Object>}
 */
export async function analyzeEvaluationSheet(base64Image, criteria = DEFAULT_CRITERIA, apiKey = '') {
  // If no API key provided, automatically fallback to realistic Mock OCR
  if (!apiKey || apiKey.trim() === '') {
    console.log('No OpenAI API Key found. Running Mock Vision OCR Engine...');
    return await simulateMockOcr(criteria, Math.random() < 0.3); // 30% chance of test mismatch
  }

  try {
    const criteriaDescription = criteria.map(c => `- ${c.name} (ID: "${c.id}", Max Score: ${c.maxScore})`).join('\n');
    
    const prompt = `
You are an expert OCR vision scanner reading a handwritten evaluation score sheet (평가위원 수기 평가표).
Extract the individual scores for each evaluation criteria and the total written score on the document.

Criteria list:
${criteriaDescription}

Respond strictly in valid JSON format with this exact JSON schema:
{
  "itemScores": {
    "criterion_id_1": score_number,
    "criterion_id_2": score_number
  },
  "extractedTotalScore": written_total_number,
  "confidence": 0.95,
  "notes": "short Korean observation if handwriting is ambiguous or mismatched"
}

Notes:
- Convert any handwritten Korean numbers or digits accurately.
- Ensure all criteria IDs match the requested list keys exactly.
- "extractedTotalScore" MUST be the written total score stated on the sheet paper.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: base64Image.startsWith('data:') ? base64Image : `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        temperature: 0.1,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `API HTTP Error ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices[0]?.message?.content;
    const parsed = JSON.parse(rawContent);

    return {
      success: true,
      itemScores: parsed.itemScores || {},
      extractedTotalScore: Number(parsed.extractedTotalScore) || 0,
      confidence: parsed.confidence || 0.95,
      isMock: false,
      notes: parsed.notes || 'GPT-4o Vision 분석 완료'
    };
  } catch (err) {
    console.warn('GPT-4o API Vision error, falling back to mock OCR:', err.message);
    const mockFallback = await simulateMockOcr(criteria, false);
    return {
      ...mockFallback,
      errorMsg: `API 호출 실패 (${err.message}) - 시뮬레이션 결과 적용됨`
    };
  }
}
