import React, { useRef, useState } from 'react';
import { Camera, UploadCloud, Image as ImageIcon, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { analyzeEvaluationSheet } from '../../services/visionOcrService.js';
import { useEvaluation } from '../../context/EvaluationContext.jsx';

export default function ImageUploader({ selectedEvaluatorId, onOcrSuccess }) {
  const { apiKey, criteria, updateEvaluator, evaluators } = useEvaluation();
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('이미지 파일(JPG, PNG 등)만 업로드 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;
      setImagePreview(base64Data);
      triggerOcrAnalysis(base64Data);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const triggerOcrAnalysis = async (base64Img) => {
    setIsProcessing(true);
    setStatusMsg(apiKey ? 'GPT-4o Vision API로 수기 점수를 분석하는 중...' : 'Mock OCR 엔지니어링으로 수기 표 인식 중...');

    try {
      const res = await analyzeEvaluationSheet(base64Img, criteria, apiKey);
      
      if (res.success) {
        // Update selected evaluator with OCR extracted data
        updateEvaluator(selectedEvaluatorId, {
          imageUrl: base64Img,
          itemScores: res.itemScores,
          extractedTotalScore: res.extractedTotalScore,
          notes: res.notes || (res.isMock ? 'Mock OCR 판독 완료' : 'GPT-4o Vision 판독 완료')
        });

        if (onOcrSuccess) {
          onOcrSuccess(selectedEvaluatorId, res);
        }
      }
    } catch (err) {
      console.error(err);
      alert(`OCR 판독 오류가 발생했습니다: ${err.message}`);
    } finally {
      setIsProcessing(false);
      setStatusMsg('');
    }
  };

  const targetEv = evaluators.find(e => e.id === selectedEvaluatorId);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      {/* Target Evaluator Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold text-slate-400">판독 데이터 매핑 대상</span>
          <h3 className="text-base font-extrabold text-blue-400">{targetEv?.name || '평가위원 선택됨'}</h3>
        </div>
        {!apiKey && (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> API Key 미입력 시 Mock 시뮬레이터 동작
          </span>
        )}
      </div>

      {/* Main Upload / Camera Area */}
      {!imagePreview ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) processFile(file);
          }}
          className="border-2 border-dashed border-slate-700 hover:border-blue-500/60 bg-slate-950/60 rounded-2xl p-8 text-center transition cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition duration-300">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h4 className="text-base font-bold text-slate-200 mb-1">
            수기 평가표 이미지 촬영 또는 드래그 업로드
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            모바일 기기의 카메라로 수기 점수가 적힌 평가표를 직접 찍거나 갤러리 이미지 파일을 업로드하세요.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
            {/* Mobile Native Camera Input */}
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition active:scale-95"
            >
              <Camera className="w-4 h-4" />
              카메라 촬영 (Mobile)
            </button>

            {/* Gallery File Input */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition"
            >
              <ImageIcon className="w-4 h-4 text-slate-400" />
              갤러리 파일 선택
            </button>
          </div>

          {/* Hidden inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        /* Image Preview & Status */
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 max-h-80 flex items-center justify-center group">
            <img
              src={imagePreview}
              alt="수기 평가표"
              className="object-contain max-h-80 w-auto"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 space-y-3">
                <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
                <p className="text-sm font-bold text-slate-100">{statusMsg}</p>
                <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse w-3/4" />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setImagePreview(null);
              }}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition disabled:opacity-50"
            >
              <RefreshCw className="w-3.5 h-3.5" /> 다시 촬영/업로드
            </button>

            <button
              onClick={() => triggerOcrAnalysis(imagePreview)}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" /> OCR 재인식 실행
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
