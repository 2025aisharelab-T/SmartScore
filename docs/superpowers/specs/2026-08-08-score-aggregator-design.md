# Assessment Score Aggregator (SmartScore) Design Specification

Date: 2026-08-08
Status: Approved Design
Target Workspace: `d:/AI 코딩/SmartScore`

## 1. Overview & Purpose
SmartScore is a mobile-responsive Progressive Web App (PWA) designed for evaluation committees and public/enterprise scoring events. It automates the process of extracting scores from smartphone photos of handwritten evaluation score sheets using OpenAI's GPT-4o Vision API (with dynamic fallbacks to Mock OCR data for offline or non-API-key testing), performs automated mathematical cross-validation (detecting score mismatches), provides intuitive mobile numpad touch-editing, and visualizes aggregated matrix tables with highest/lowest score highlighting and TXT/CSV exporting.

---

## 2. Technical Stack
- **Framework**: React 18 + Vite (PWA template with `vite-plugin-pwa`)
- **Styling**: Tailwind CSS + Lucide React Icons (Modern corporate dashboard UI theme)
- **State Management**: React Context / Hooks (`EvaluationContext`) for state persistence with `localStorage` fallback
- **Vision/OCR Engine**: OpenAI GPT-4o Vision API (base64 image payload + JSON structured output mode) + Built-in realistic Mock OCR Engine
- **Export Capabilities**: CSV export, TXT printable report generator, Native Web Share / Email share layout

---

## 3. System Architecture & Components

### 3.1 Directory Structure
```
d:/AI 코딩/SmartScore/
├── public/
│   ├── favicon.svg
│   └── pwa-192x192.png
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── StepIndicator.jsx
│   │   │   ├── ApiKeyModal.jsx
│   │   │   └── CriteriaModal.jsx
│   │   ├── step1/
│   │   │   ├── ImageUploader.jsx
│   │   │   ├── CameraCapture.jsx
│   │   │   └── EvaluatorSelector.jsx
│   │   ├── step2/
│   │   │   ├── ImageReviewViewer.jsx
│   │   │   ├── ValidationGrid.jsx
│   │   │   ├── CustomNumpadModal.jsx
│   │   │   └── DiscrepancyBadge.jsx
│   │   └── step3/
│   │       ├── AggregationTable.jsx
│   │       ├── ScoreStats.jsx
│   │       └── ExportToolbar.jsx
│   ├── context/
│   │   └── EvaluationContext.jsx
│   ├── services/
│   │   ├── visionOcrService.js
│   │   ├── mockOcrData.js
│   │   └── exportService.js
│   ├── utils/
│   │   ├── scoreValidation.js
│   │   └── formatters.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 4. Key Workflows & Features

### Step 1: Image Capture & OCR Processing
- **Image Input**: HTML5 file input `<input type="file" capture="environment" accept="image/*">` or camera capture modal.
- **Image Pre-processing**: Client-side canvas compression/resizing to under 1024px for fast API transmission.
- **OCR Engine (`visionOcrService.js`)**:
  - Checks if OpenAI API key is stored in `localStorage`.
  - If API key exists: sends base64 image prompt requesting structured JSON containing item scores and total score.
  - If no API key: runs `simulateMockOcr()` with realistic handwriting extraction simulation and delayed response.

### Step 2: Cross-Validation & Mobile Manual Edit
- **Validation Rule**:
  $$\text{calculatedTotal} = \sum_{i=1}^{n} \text{score}_i$$
  $$\text{isValid} = (\text{calculatedTotal} === \text{extractedTotal})$$
- **Visual Alert**:
  - If `!isValid`, cell turns soft red (`bg-red-500/10 border-red-500`), displaying warning badge `총점 불일치: 표기 [X]점 vs 합계 [Y]점`.
- **Mobile Numpad**: Clicking any score cell opens an intuitive touch-friendly Numpad overlay tailored for quick one-tap number entry without software keyboard layout distortion.

### Step 3: Comprehensive Data Matrix & Aggregation
- **Data Matrix Layout**:
  - Rows: Evaluators (A, B, C, D, E, F, G... 7+ expandable)
  - Columns: Evaluation Criteria ($C_1, C_2, \dots, C_n$), Extracted Total, Validated Total, Status Badge.
- **Max & Min Highlighting**:
  - Highest Evaluator Total Score: Soft Blue background (`bg-blue-100 text-blue-900 border-blue-300 font-bold`).
  - Lowest Evaluator Total Score: Soft Red background (`bg-rose-100 text-rose-900 border-rose-300 font-bold`).
- **Stats Summary**:
  - Overall Average Score
  - Trimmed Mean (excluding Max & Min for unbiased evaluation)
  - Completion Status (e.g., 7 of 7 Evaluators verified)

### Step 4: Export & Data Persistence
- **Export TXT**: Clean formatted ASCII report per evaluator and combined summary.
- **Export CSV**: Standard UTF-8 BOM CSV compatible with MS Excel.
- **Email / Share**: Pre-filled mailto link & Clipboard copy function.

---

## 5. Verification & Testing Plan
- **Mock OCR Test**: Upload test sample image without API key $\rightarrow$ verify automatic score population and validation alert.
- **Validation Correction Test**: Edit item score $\rightarrow$ check real-time recalculation and red alert clearing.
- **Highlighting Test**: Add 7 evaluators with varying scores $\rightarrow$ verify exact Max (blue) and Min (red) styling.
- **Export Verification**: Trigger CSV/TXT downloads $\rightarrow$ verify valid formatting and file download.
