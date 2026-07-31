import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertCircle, RefreshCw, FileCode, HelpCircle, ExternalLink, Sparkles } from 'lucide-react';
import { GasConfig } from '../types';
import { CodeGsViewer } from './CodeGsViewer';
import { syncLogsFromGas } from '../utils/gasService';

interface GasModalProps {
  isOpen: boolean;
  onClose: () => void;
  gasConfig: GasConfig;
  onSaveConfig: (config: GasConfig) => void;
  onSyncRefresh: () => void;
}

export const GasModal: React.FC<GasModalProps> = ({
  isOpen,
  onClose,
  gasConfig,
  onSaveConfig,
  onSyncRefresh,
}) => {
  const [urlInput, setUrlInput] = useState(gasConfig.scriptUrl || '');
  const [activeTab, setActiveTab] = useState<'settings' | 'code' | 'guide'>('settings');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTestAndSave = async () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      onSaveConfig({ scriptUrl: '', isConnected: false });
      setTestResult({
        success: false,
        message: 'URL이 입력되지 않았습니다. 로컬 저장소 모드로 작동합니다.',
      });
      return;
    }

    if (!trimmed.startsWith('https://script.google.com/macros/s/')) {
      setTestResult({
        success: false,
        message: '올바른 Google Apps Script 웹 앱 URL 형식이 아닙니다. (https://script.google.com/macros/s/... 시작)',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const result = await syncLogsFromGas(trimmed);
    setIsTesting(false);

    if (result.success) {
      setTestResult({
        success: true,
        message: '구글 스프레드시트와 성공적으로 연동되었습니다! 실시간 동기화가 활성화되었습니다.',
      });
      onSaveConfig({
        scriptUrl: trimmed,
        isConnected: true,
        lastSyncedAt: new Date().toLocaleTimeString('ko-KR'),
      });
      onSyncRefresh();
    } else {
      setTestResult({
        success: false,
        message: `연동 실패: ${result.error || '구글 앱스 스크립트 웹 앱 연결에 실패했습니다. 권한 설정을 확인해주세요.'}`,
      });
      onSaveConfig({
        scriptUrl: trimmed,
        isConnected: false,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-slate-800/80 border-b border-slate-700/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
                구글 스프레드시트 연동 설정 (GAS)
              </h2>
              <p className="text-xs text-slate-400">
                학급 독서기록 데이터를 구글 드라이브 시트에 실시간으로 백업하고 공유하세요.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'settings'
                ? 'bg-slate-900 text-amber-400 border-amber-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>연동 URL 설정</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'code'
                ? 'bg-slate-900 text-emerald-400 border-emerald-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Code.gs 복사하기</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'guide'
                ? 'bg-slate-900 text-sky-400 border-sky-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>상세 사용 방법</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {activeTab === 'settings' && (
            <div className="space-y-6">
              
              {/* Status Banner */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                  gasConfig.isConnected
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                }`}
              >
                {gasConfig.isConnected ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                )}
                <div className="text-xs leading-relaxed space-y-1">
                  <div className="font-bold text-sm">
                    {gasConfig.isConnected
                      ? '구글 스프레드시트 연동 중'
                      : '로컬 데이터 모드 작동 중'}
                  </div>
                  <p className="text-slate-300">
                    {gasConfig.isConnected
                      ? `구글 시트와 연결되어 데이터가 백업되고 있습니다. (최종 동기화: ${
                          gasConfig.lastSyncedAt || '방금 전'
                        })`
                      : '구글 시트 URL을 등록하지 않아도 브라우저 로컬 저장소에 정상 기록됩니다.'}
                  </p>
                </div>
              </div>

              {/* URL Input Form */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-300">
                  구글 앱스 스크립트 배포 웹 앱 URL (GAS Web App URL)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none transition-all font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  * 구글 드라이브에서 앱스 스크립트를 웹 앱으로 배포한 후 받은 Executable URL을 복사해 붙여넣으세요.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleTestAndSave}
                  disabled={isTesting}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
                >
                  {isTesting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>연동 테스트 중...</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4" />
                      <span>연동 테스트 및 저장하기</span>
                    </>
                  )}
                </button>
              </div>

              {/* Test Result Message */}
              {testResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs font-medium ${
                    testResult.success
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                      : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                  }`}
                >
                  {testResult.message}
                </div>
              )}

              {/* Quick Guide Trigger */}
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/60 text-xs text-slate-300 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-300">구글 시트 코드가 필요하신가요?</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    교사용 앱스 스크립트 전용 Code.gs를 복사해서 바로 사용할 수 있습니다.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('code')}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 text-xs font-bold transition"
                >
                  코드 보기
                </button>
              </div>

            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-300 bg-amber-950/30 border border-amber-500/30 p-3.5 rounded-xl">
                💡 <span className="font-bold text-amber-300">사용 방법:</span> 아래의 구글 앱스 스크립트 코드를 복사하여 구글 드라이브 앱스 스크립트에 붙여넣고 웹 앱으로 배포하세요.
              </div>
              <CodeGsViewer />
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-5 text-xs text-slate-300 leading-relaxed">
              <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                구글 앱스 스크립트(GAS) 3분 연동 완성 가이드
              </h3>

              <ol className="space-y-4 list-decimal list-inside bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <li className="font-bold text-white">
                  구글 드라이브 접속 및 Apps Script 생성
                  <p className="font-normal text-slate-400 mt-1 pl-5">
                    <a href="https://drive.google.com" target="_blank" rel="noreferrer" className="text-amber-400 underline inline-flex items-center gap-1">
                      Google Drive <ExternalLink className="w-3 h-3" />
                    </a>
                    에서 [새로 만들기] &gt; [기타] &gt; [Google Apps Script]를 선택합니다.
                  </p>
                </li>

                <li className="font-bold text-white">
                  Code.gs 코드 붙여넣기
                  <p className="font-normal text-slate-400 mt-1 pl-5">
                    'Code.gs 복사하기' 탭에서 코드를 복사한 후, 스크립트 편집기 기존 내용을 모두 삭제하고 붙여넣습니다. (ctrl+A 후 ctrl+V)
                  </p>
                </li>

                <li className="font-bold text-white">
                  웹 앱으로 배포 설정 (매우 중요!)
                  <p className="font-normal text-slate-400 mt-1 pl-5">
                    우측 상단 <span className="text-amber-300 font-bold">[배포]</span> &gt; <span className="text-amber-300 font-bold">[새 배포]</span>를 누르고 톱니바퀴를 클릭해 <span className="text-amber-300 font-bold">웹 앱(Web App)</span>을 선택합니다.
                  </p>
                  <ul className="list-disc list-inside mt-1.5 pl-8 text-slate-300 space-y-1">
                    <li>다음 사용자 권한으로 실행: <span className="text-emerald-400 font-bold">나(Me)</span></li>
                    <li>액세스 권한이 있는 사용자: <span className="text-emerald-400 font-bold">모든 사용자(Anyone)</span> (CORS 권한 오류 방지)</li>
                  </ul>
                </li>

                <li className="font-bold text-white">
                  웹 앱 URL 복사 및 입력
                  <p className="font-normal text-slate-400 mt-1 pl-5">
                    배포 승인 후 생성되는 웹 앱 URL을 복사하여 본 웹사이트의 [연동 URL 설정] 창에 붙여넣고 저장하세요.
                  </p>
                </li>
              </ol>

              <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 text-[11px] text-slate-400">
                🔒 모든 데이터는 교사 본인의 구글 드라이브 전용 스프레드시트에 저장되며 타인이나 외부에 공유되지 않습니다.
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-800/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-slate-200 transition"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
