import React, { useState, useEffect } from 'react';
import { ReadingLog, GasConfig } from './types';
import { Navbar } from './components/Navbar';
import { StudentForm } from './components/StudentForm';
import { StudentHistory } from './components/StudentHistory';
import { BookKingHall } from './components/BookKingHall';
import { TeacherDashboard } from './components/TeacherDashboard';
import { GasModal } from './components/GasModal';
import {
  getLocalLogs,
  getGasConfig,
  saveGasConfig,
  syncLogsFromGas,
  addLogToGas,
  deleteLogFromGas,
  getSavedStudentInfo,
} from './utils/gasService';
import { BookOpen, Sparkles, Heart, HeartHandshake } from 'lucide-react';

export default function App() {
  const [logs, setLogs] = useState<ReadingLog[]>([]);
  const [currentTab, setCurrentTab] = useState<'student' | 'king' | 'teacher'>('student');
  const [gasConfig, setGasConfig] = useState<GasConfig>({ scriptUrl: '', isConnected: false });
  const [isGasModalOpen, setIsGasModalOpen] = useState(false);
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState(false);
  const [isSubmittingLog, setIsSubmittingLog] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    // 1. Load local logs
    const initialLogs = getLocalLogs();
    setLogs(initialLogs);

    // 2. Load GAS config
    const config = getGasConfig();
    setGasConfig(config);

    // 3. If GAS scriptUrl exists, attempt background sync
    if (config.scriptUrl) {
      handleSyncRefresh(config.scriptUrl);
    }
  }, []);

  const handleSyncRefresh = async (urlOverride?: string) => {
    const targetUrl = urlOverride || gasConfig.scriptUrl;
    if (!targetUrl) return;

    setIsSyncing(true);
    const res = await syncLogsFromGas(targetUrl);
    setIsSyncing(false);

    if (res.success && res.logs) {
      setLogs(res.logs);
      setGasConfig({
        scriptUrl: targetUrl,
        isConnected: true,
        lastSyncedAt: new Date().toLocaleTimeString('ko-KR'),
      });
    }
  };

  const handleAddLog = async (newLogData: Omit<ReadingLog, 'id' | 'createdAt'>) => {
    setIsSubmittingLog(true);

    const logWithId: ReadingLog = {
      ...newLogData,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
    };

    // Save locally and background push to GAS
    await addLogToGas(gasConfig.scriptUrl, logWithId);

    // Update state
    setLogs((prev) => [logWithId, ...prev]);
    setIsSubmittingLog(false);
  };

  const handleDeleteLog = async (logId: string) => {
    await deleteLogFromGas(gasConfig.scriptUrl, logId);
    setLogs((prev) => prev.filter((l) => l.id !== logId));
  };

  const handleTeacherAuthenticate = (password: string) => {
    if (password === '1234') {
      setIsTeacherAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleTeacherLogout = () => {
    setIsTeacherAuthenticated(false);
  };

  const savedStudent = getSavedStudentInfo();

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 flex flex-col font-sans antialiased selection:bg-amber-200 selection:text-amber-900">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        gasConfig={gasConfig}
        onOpenGasModal={() => setIsGasModalOpen(true)}
        isTeacherAuthenticated={isTeacherAuthenticated}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Tab 1: Student Mode (독서록 작성 및 누적 보기) */}
        {currentTab === 'student' && (
          <div className="space-y-10 animate-fadeIn">
            {/* Student Log Entry Form */}
            <StudentForm onSubmitLog={handleAddLog} isSubmitting={isSubmittingLog} />

            {/* Student Log History Grid */}
            <StudentHistory
              logs={logs}
              currentStudentName={savedStudent?.studentName}
              onDeleteLog={handleDeleteLog}
              isTeacherMode={isTeacherAuthenticated}
            />
          </div>
        )}

        {/* Tab 2: Hall of Fame (이달의 독서왕) */}
        {currentTab === 'king' && (
          <div className="animate-fadeIn">
            <BookKingHall logs={logs} />
          </div>
        )}

        {/* Tab 3: Teacher Dashboard (교사 관리자 모드) */}
        {currentTab === 'teacher' && (
          <div className="animate-fadeIn">
            <TeacherDashboard
              logs={logs}
              isAuthenticated={isTeacherAuthenticated}
              onAuthenticate={handleTeacherAuthenticate}
              onLogout={handleTeacherLogout}
              onDeleteLog={handleDeleteLog}
              onRefreshData={() => handleSyncRefresh()}
            />
          </div>
        )}

      </main>

      {/* Google Sheets GAS Modal */}
      <GasModal
        isOpen={isGasModalOpen}
        onClose={() => setIsGasModalOpen(false)}
        gasConfig={gasConfig}
        onSaveConfig={(cfg) => {
          setGasConfig(cfg);
          saveGasConfig(cfg);
        }}
        onSyncRefresh={() => handleSyncRefresh()}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white font-serif">우리반 전자 독서기록장</span>
              <p className="text-[11px] text-slate-500">
                초·중·고등학교 학급 전용 스마트 독서 포트폴리오
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right space-y-1 text-slate-400">
            <p className="flex items-center justify-center sm:justify-end gap-1">
              <span>스마트 학급 독서 활동을 응원합니다</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </p>
            <p className="text-[11px] text-slate-500">
              {gasConfig.isConnected
                ? '🟢 구글 드라이브 스프레드시트 실시간 동기화중'
                : '🟡 브라우저 로컬 데이터 보관중 (구글 시트 연동 가능)'}
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
