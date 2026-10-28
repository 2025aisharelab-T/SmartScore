# SmartScore Assessment Score Aggregator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-responsive React/Vite PWA application that extracts handwritten evaluation scores via OpenAI GPT-4o Vision API / Mock OCR simulation, validates totals, provides touch-friendly mobile score editing, highlights max/min total scores, and exports to CSV/TXT.

**Architecture:** Client-side React SPA with Vite and Tailwind CSS. State is managed via React Context (`EvaluationContext`) persisted in `localStorage`. OCR requests call OpenAI Vision API when an API key is configured or fallback to a built-in OCR simulator (`mockOcrData.js`).

**Tech Stack:** React 18, Vite, Tailwind CSS, Lucide React icons, Vitest for unit testing.

## Global Constraints
- Target directory: `d:/AI 코딩/SmartScore`
- Must support mobile camera input (`capture="environment"`) and image file uploads.
- Minimum 7 evaluators supported with dynamic expansion.
- Automated score validation: $\text{sum}(\text{itemScores}) \equiv \text{extractedTotalScore}$. Highlighting mismatch cells in red.
- Highest total score highlighted in soft blue (`bg-blue-100 border-blue-300 text-blue-900`), lowest in soft red (`bg-rose-100 border-rose-300 text-rose-900`).

---

### Task 1: Project Initialization & Build Setup

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/index.css`
- Create: `src/main.jsx`
- Create: `src/App.jsx`

**Interfaces:**
- Consumes: Standard npm dependencies
- Produces: Base Vite + React + Tailwind CSS environment running on dev server

- [ ] **Step 1: Create package.json and configuration files**
- [ ] **Step 2: Install dependencies (react, react-dom, lucide-react, tailwindcss, autoprefixer, postcss, vitest)**
- [ ] **Step 3: Configure vite.config.js and tailwind.config.js**
- [ ] **Step 4: Verify dev build runs cleanly**

---

### Task 2: Core Domain Logic & Validation Utilities with Tests

**Files:**
- Create: `src/utils/scoreValidation.js`
- Create: `src/utils/formatters.js`
- Create: `src/services/mockOcrData.js`
- Create: `src/services/visionOcrService.js`
- Create: `src/services/exportService.js`
- Test: `src/utils/scoreValidation.test.js`

**Interfaces:**
- Consumes: Raw item score records and evaluator objects
- Produces: `validateEvaluatorScore(evaluator)`, `calculateStats(evaluators)`, `processImageWithOcr(base64Image, apiKey)`, `exportToCsv(evaluators, criteria)`, `exportToTxt(evaluators, criteria)`

- [ ] **Step 1: Write unit tests for score validation and stats calculation in `src/utils/scoreValidation.test.js`**
- [ ] **Step 2: Run test to verify failure before implementation**
- [ ] **Step 3: Implement `src/utils/scoreValidation.js` (calculate sum, compare with total, flag mismatches, find max & min evaluator IDs)**
- [ ] **Step 4: Implement `src/services/mockOcrData.js` and `src/services/visionOcrService.js`**
- [ ] **Step 5: Implement `src/services/exportService.js` for CSV and TXT generation**
- [ ] **Step 6: Run tests to verify all pass**

---

### Task 3: Context & State Management Layer

**Files:**
- Create: `src/context/EvaluationContext.jsx`

**Interfaces:**
- Consumes: Validation utilities & initial preset criteria
- Produces: `EvaluationContext` providing `evaluators`, `criteria`, `currentStep`, `apiKey`, `addEvaluator()`, `updateEvaluator()`, `deleteEvaluator()`, `setApiKey()`, `setCriteria()`, `setCurrentStep()`

- [ ] **Step 1: Implement `EvaluationContext.jsx` with default criteria presets (e.g. 기획력(20), 기술성(30), 사업성(30), 수행능력(20))**
- [ ] **Step 2: Add initial mock evaluators for testing and instant preview**
- [ ] **Step 3: Integrate `localStorage` persistence for API Key and criteria settings**

---

### Task 4: Layout Components & Modals

**Files:**
- Create: `src/components/common/Header.jsx`
- Create: `src/components/common/StepIndicator.jsx`
- Create: `src/components/common/ApiKeyModal.jsx`
- Create: `src/components/common/CriteriaModal.jsx`

**Interfaces:**
- Consumes: `EvaluationContext`
- Produces: Top navigation header, step progress bar (Step 1 -> Step 2 -> Step 3), API Key configuration modal, Custom criteria setup modal

- [ ] **Step 1: Create `StepIndicator.jsx` with mobile-responsive 3-step navigation**
- [ ] **Step 2: Create `ApiKeyModal.jsx` with local storage saving & test connection state**
- [ ] **Step 3: Create `CriteriaModal.jsx` allowing users to customize evaluation criteria names and max scores**
- [ ] **Step 4: Create `Header.jsx` integrating logo, step indicator, and settings trigger buttons**

---

### Task 5: Step 1 - Image Capture & Upload UI

**Files:**
- Create: `src/components/step1/ImageUploader.jsx`
- Create: `src/components/step1/EvaluatorSelector.jsx`
- Create: `src/components/step1/Step1Container.jsx`

**Interfaces:**
- Consumes: `EvaluationContext`, `visionOcrService`
- Produces: Drag-and-drop photo upload UI, camera capture input (`capture="environment"`), evaluator selection dropdown, OCR processing indicator

- [ ] **Step 1: Build `ImageUploader.jsx` with file dropzone, camera access button, and base64 canvas scaler**
- [ ] **Step 2: Build `EvaluatorSelector.jsx` with quick evaluator selection (평가위원 A~G+)**
- [ ] **Step 3: Build `Step1Container.jsx` connecting image upload and OCR invocation, transitioning to Step 2 upon completion**

---

### Task 6: Step 2 - Validation & Mobile Numpad Editing UI

**Files:**
- Create: `src/components/step2/ImageReviewViewer.jsx`
- Create: `src/components/step2/DiscrepancyBadge.jsx`
- Create: `src/components/step2/CustomNumpadModal.jsx`
- Create: `src/components/step2/ValidationGrid.jsx`
- Create: `src/components/step2/Step2Container.jsx`

**Interfaces:**
- Consumes: `EvaluationContext`, `validateEvaluatorScore`
- Produces: Dual-pane photo vs extracted scores review layout, red discrepancy alert badge, touch-friendly Numpad overlay modal for quick mobile score editing

- [ ] **Step 1: Build `ImageReviewViewer.jsx` with zoom & image inspect capability**
- [ ] **Step 2: Build `CustomNumpadModal.jsx` (0-9, backspace, clear, set max score button) optimized for mobile touch**
- [ ] **Step 3: Build `ValidationGrid.jsx` highlighting mismatched cells in red and triggering Numpad on tap**
- [ ] **Step 4: Build `Step2Container.jsx` integrating validation flow and transitioning to Step 3**

---

### Task 7: Step 3 - Aggregation Table & Export UI

**Files:**
- Create: `src/components/step3/ScoreStats.jsx`
- Create: `src/components/step3/AggregationTable.jsx`
- Create: `src/components/step3/ExportToolbar.jsx`
- Create: `src/components/step3/Step3Container.jsx`

**Interfaces:**
- Consumes: `EvaluationContext`, `scoreValidation.js`, `exportService.js`
- Produces: Full evaluator matrix table, soft blue max score & soft red min score highlighting, summary statistics cards, TXT/CSV download buttons

- [ ] **Step 1: Build `ScoreStats.jsx` presenting average score, trimmed mean, and completion count**
- [ ] **Step 2: Build `AggregationTable.jsx` with evaluator rows x criteria columns, styling max (blue) and min (red) total score cells**
- [ ] **Step 3: Build `ExportToolbar.jsx` with TXT download, CSV download, and share actions**
- [ ] **Step 4: Build `Step3Container.jsx` uniting stats, aggregation table, and export actions**

---

### Task 8: Application Integration & PWA Verification

**Files:**
- Modify: `src/App.jsx`
- Create: `public/manifest.json`

**Interfaces:**
- Consumes: Step 1, Step 2, Step 3 containers & Header/Modals
- Produces: Fully functional SmartScore PWA application

- [ ] **Step 1: Wire step switching and main layout inside `App.jsx`**
- [ ] **Step 2: Add sample evaluator records in context for immediate rich preview**
- [ ] **Step 3: Verify build, run test suite, and test responsive UI on mobile viewport**
