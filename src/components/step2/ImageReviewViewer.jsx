import React, { useState } from 'react';
import { Eye, FileImage, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

export default function ImageReviewViewer({ imageUrl, evaluatorName }) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!imageUrl) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-500 space-y-2">
        <FileImage className="w-10 h-10 mx-auto text-slate-700" />
        <p className="text-xs">업로드된 수기 평가표 원본 이미지가 없습니다.</p>
        <p className="text-[11px] text-slate-600">Step 1에서 이미지를 업로드하면 이곳에서 교차 확인 가능합니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-slate-200">원본 수기 평가표 이미지 ({evaluatorName})</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom(Math.max(0.8, zoom - 0.2))}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
            title="축소"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-slate-500 font-mono w-8 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(Math.min(2.5, zoom + 0.2))}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
            title="확대"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setRotation((rotation + 90) % 360)}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg ml-1"
            title="90도 회전"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-slate-950 border border-slate-800 max-h-72 flex items-center justify-center p-2">
        <img
          src={imageUrl}
          alt="원본 평가표"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transition: 'transform 0.2s ease-out'
          }}
          className="max-h-64 object-contain"
        />
      </div>
    </div>
  );
}
