import React, { useState } from 'react';
import { Copy, Check, Code } from 'lucide-react';
import { GAS_CODE_GS } from '../utils/gasCode';

export const CodeGsViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(GAS_CODE_GS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/90 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-slate-200">Code.gs</span>
          <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-sans">
            Google Apps Script 전용
          </span>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
            copied
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>복사 완료!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>전체 코드 복사</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 overflow-x-auto max-h-96 font-mono text-xs text-slate-300 leading-relaxed bg-slate-950">
        <pre>{GAS_CODE_GS}</pre>
      </div>
    </div>
  );
};
