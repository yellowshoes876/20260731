import React, { useState } from 'react';
import { ShieldCheck, Lock, LogOut, Users, BookOpen, Trophy, Star, Download, Search, Filter, Trash2, Eye, Calendar, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { ReadingLog } from '../types';

interface TeacherDashboardProps {
  logs: ReadingLog[];
  isAuthenticated: boolean;
  onAuthenticate: (password: string) => boolean;
  onLogout: () => void;
  onDeleteLog: (logId: string) => void;
  onRefreshData?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  logs,
  isAuthenticated,
  onAuthenticate,
  onLogout,
  onDeleteLog,
  onRefreshData,
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Filters
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [searchName, setSearchName] = useState('');

  // Selected Log Modal for Viewing
  const [selectedLog, setSelectedLog] = useState<ReadingLog | null>(null);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onAuthenticate(passwordInput);
    if (!success) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
      setPasswordInput('');
    }
  };

  const handleQuickLogin = () => {
    onAuthenticate('1234');
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-slate-900 border border-slate-800 text-white rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 text-white">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-white">
            교사 관리자 인증
          </h2>
          <p className="text-xs text-slate-400">
            학급 독서기록 통계 확인 및 기록 관리를 위해 비밀번호를 입력해 주세요.
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              관리자 비밀번호
            </label>
            <div className="relative">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="비밀번호 입력 (기본: 1234)"
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none transition font-mono"
                required
              />
              <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
            </div>
            {passwordError && (
              <p className="text-[11px] text-rose-400 mt-1">
                비밀번호가 올바르지 않습니다. (기본 비밀번호: 1234)
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-3.5 rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition"
          >
            대시보드 접속하기
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800 text-center">
          <button
            onClick={handleQuickLogin}
            className="text-xs text-amber-400 hover:underline font-bold inline-flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>기본 비밀번호(1234)로 원클릭 바로 접속하기</span>
          </button>
        </div>
      </div>
    );
  }

  // Filtered Logs
  const filteredLogs = logs.filter((l) => {
    if (selectedGrade !== 'all' && l.grade !== selectedGrade) return false;
    if (selectedClass !== 'all' && l.classNum !== selectedClass) return false;
    if (selectedMonth !== 'all' && l.date && !l.date.startsWith(selectedMonth)) return false;
    if (searchName.trim()) {
      const q = searchName.toLowerCase();
      const matchName = l.studentName.toLowerCase().includes(q);
      const matchBook = l.bookTitle.toLowerCase().includes(q);
      if (!matchName && !matchBook) return false;
    }
    return true;
  });

  // Calculate Metrics
  const totalLogsCount = logs.length;
  const uniqueStudents = new Set(logs.map((l) => `${l.grade}-${l.classNum}-${l.studentName}`)).size;
  const avgRating = totalLogsCount > 0
    ? (logs.reduce((acc, l) => acc + (l.rating || 5), 0) / totalLogsCount).toFixed(1)
    : '5.0';

  // Compute Top Student
  const studentMap = new Map<string, { count: number; name: string; grade: string; classNum: string }>();
  logs.forEach((l) => {
    const key = `${l.grade}-${l.classNum}-${l.studentName}`;
    if (!studentMap.has(key)) {
      studentMap.set(key, { count: 0, name: l.studentName, grade: l.grade, classNum: l.classNum });
    }
    studentMap.get(key)!.count += 1;
  });

  const studentRankings = Array.from(studentMap.values()).sort((a, b) => b.count - a.count);
  const topStudent = studentRankings[0];

  // Month options from logs
  const monthsSet = new Set<string>();
  logs.forEach((l) => {
    if (l.date && l.date.length >= 7) {
      monthsSet.add(l.date.substring(0, 7));
    }
  });
  const monthOptions = Array.from(monthsSet).sort().reverse();

  // CSV Export
  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      alert('다운로드할 독서록 데이터가 없습니다.');
      return;
    }

    const headers = ['ID', '학년', '반', '이름', '도서명', '저자', '출판사', '줄거리', '한줄소감', '별점', '작성일'];
    const rows = filteredLogs.map((l) => [
      `"${l.id}"`,
      `"${l.grade}"`,
      `"${l.classNum}"`,
      `"${l.studentName}"`,
      `"${l.bookTitle.replace(/"/g, '""')}"`,
      `"${(l.author || '').replace(/"/g, '""')}"`,
      `"${(l.publisher || '').replace(/"/g, '""')}"`,
      `"${(l.summary || '').replace(/"/g, '""')}"`,
      `"${(l.review || '').replace(/"/g, '""')}"`,
      `"${l.rating}"`,
      `"${l.date}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `우리반_전자독서기록장_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Controls Header */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
              교사 관리 대시보드
              <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                인증됨
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              학급 독서 현황 통계 분석 및 학생들의 작성 내역을 종합 관리합니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {onRefreshData && (
            <button
              onClick={onRefreshData}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
              title="최신 데이터 불러오기"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>새로고침</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>엑셀/CSV 다운로드</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>로그아웃</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">총 누적 독서록</span>
            <div className="text-2xl font-black text-slate-900">{totalLogsCount}권</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">참여 학생 수</span>
            <div className="text-2xl font-black text-slate-900">{uniqueStudents}명</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">최다 독서 학생</span>
            <div className="text-base font-extrabold text-slate-900 truncate max-w-[140px]">
              {topStudent ? `${topStudent.name} (${topStudent.count}권)` : '없음'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">평균 추천 별점</span>
            <div className="text-2xl font-black text-slate-900">{avgRating} / 5.0</div>
          </div>
        </div>

      </div>

      {/* Main Analysis Section: Ranking & Logs Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Student Ranking Table */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              학생별 독서 건수 순위
            </h3>
            <span className="text-[11px] text-slate-400">상위 TOP 10</span>
          </div>

          <div className="space-y-2">
            {studentRankings.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">기록이 없습니다.</p>
            ) : (
              studentRankings.slice(0, 10).map((st, idx) => (
                <div
                  key={`${st.grade}-${st.classNum}-${st.name}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        idx === 0
                          ? 'bg-amber-400 text-slate-950 font-black'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-900 font-bold'
                          : idx === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-800">
                      {st.grade}학년 {st.classNum}반 {st.name}
                    </span>
                  </div>

                  <span className="font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
                    {st.count}권
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Comprehensive Logs Filter & Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              독서록 전체 현황 및 관리
            </h3>
            <span className="text-xs text-slate-500">
              필터 적용 결과: <strong className="text-emerald-600 font-bold">{filteredLogs.length}</strong>건
            </span>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">학년</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 outline-none"
              >
                <option value="all">전체 학년</option>
                {[1, 2, 3, 4, 5, 6].map((g) => (
                  <option key={g} value={String(g)}>{g}학년</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">반</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 outline-none"
              >
                <option value="all">전체 반</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
                  <option key={c} value={String(c)}>{c}반</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">작성 월</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 outline-none"
              >
                <option value="all">전체 기간</option>
                {monthOptions.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">이름/도서 검색</label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="검색..."
                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 outline-none"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">학생</th>
                  <th className="p-3">도서명</th>
                  <th className="p-3">저자</th>
                  <th className="p-3">별점</th>
                  <th className="p-3">작성일</th>
                  <th className="p-3 text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400">
                      검색 조건에 해당 독서록이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-bold text-slate-900 whitespace-nowrap">
                        {log.grade}-{log.classNum} {log.studentName}
                      </td>
                      <td className="p-3 font-bold text-slate-800 line-clamp-1 max-w-[160px]">
                        {log.bookTitle}
                      </td>
                      <td className="p-3 text-slate-500 truncate max-w-[100px]">
                        {log.author || '미상'}
                      </td>
                      <td className="p-3 text-amber-500 font-bold">
                        ★ {log.rating}
                      </td>
                      <td className="p-3 text-slate-400 whitespace-nowrap">
                        {log.date}
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                            title="상세 보기"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`'${log.bookTitle}' 독서록을 삭제하시겠습니까?`)) {
                                onDeleteLog(log.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 space-y-5 shadow-2xl relative">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
                {selectedLog.grade}학년 {selectedLog.classNum}반 {selectedLog.studentName}
              </span>
              <h2 className="text-xl font-bold font-serif text-slate-900 mt-2">
                {selectedLog.bookTitle}
              </h2>
              <p className="text-xs text-slate-500">
                지은이: {selectedLog.author || '미상'} | 출판사: {selectedLog.publisher || '미상'}
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-800">
              <div>
                <strong className="block text-slate-500 font-bold mb-1">줄거리:</strong>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 whitespace-pre-wrap leading-relaxed">
                  {selectedLog.summary}
                </p>
              </div>

              <div>
                <strong className="block text-amber-800 font-bold mb-1">한 줄 감상평:</strong>
                <p className="p-3 bg-amber-50 rounded-xl border border-amber-200 italic text-amber-950">
                  "{selectedLog.review}"
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-400">작성일: {selectedLog.date}</span>
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
