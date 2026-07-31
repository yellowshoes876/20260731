import React from 'react';
import { BookOpen, Award, ShieldCheck, Database, Sparkles, CheckCircle2 } from 'lucide-react';
import { GasConfig } from '../types';

interface NavbarProps {
  currentTab: 'student' | 'king' | 'teacher';
  setCurrentTab: (tab: 'student' | 'king' | 'teacher') => void;
  gasConfig: GasConfig;
  onOpenGasModal: () => void;
  isTeacherAuthenticated: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  gasConfig,
  onOpenGasModal,
  isTeacherAuthenticated,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-xl backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div 
          onClick={() => setCurrentTab('student')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
            <BookOpen className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white font-serif">
                우리반 전자 독서기록장
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-3 h-3 mr-1 text-amber-400" />
                스마트 학급
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              책으로 넓어지는 우리들의 세상과 생각
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60 shadow-inner">
          <button
            onClick={() => setCurrentTab('student')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentTab === 'student'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>학생 독서록</span>
          </button>

          <button
            onClick={() => setCurrentTab('king')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentTab === 'king'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>이달의 독서왕</span>
          </button>

          <button
            onClick={() => setCurrentTab('teacher')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentTab === 'teacher'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>교사 대시보드</span>
            {isTeacherAuthenticated && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </button>
        </nav>

        {/* GAS Settings Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGasModal}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
              gasConfig.isConnected
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/50'
            }`}
            title="구글 스프레드시트 연동 설정"
          >
            <Database className="w-4 h-4" />
            <span className="hidden md:inline">
              {gasConfig.isConnected ? '구글 시트 연동중' : '시트 연동 설정'}
            </span>
            <span className="flex h-2 w-2 relative">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  gasConfig.isConnected ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  gasConfig.isConnected ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              ></span>
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
