import React, { useState } from 'react';
import { BookOpen, Search, Filter, Star, Calendar, User, Quote, ChevronRight, X, Trash2 } from 'lucide-react';
import { ReadingLog } from '../types';

interface StudentHistoryProps {
  logs: ReadingLog[];
  currentStudentName?: string;
  onDeleteLog?: (logId: string) => void;
  isTeacherMode?: boolean;
}

export const StudentHistory: React.FC<StudentHistoryProps> = ({
  logs,
  currentStudentName = '',
  onDeleteLog,
  isTeacherMode = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterOnlyMine, setFilterOnlyMine] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ReadingLog | null>(null);

  // Filtering logic
  const filteredLogs = logs.filter((log) => {
    // Student Name filter (Only mine)
    if (filterOnlyMine && currentStudentName) {
      if (log.studentName.trim() !== currentStudentName.trim()) return false;
    }

    // Class filter
    if (filterClass !== 'all' && log.classNum !== filterClass) return false;

    // Search Query (Book Title, Author, Student Name, Review)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = log.bookTitle.toLowerCase().includes(q);
      const matchAuthor = log.author.toLowerCase().includes(q);
      const matchStudent = log.studentName.toLowerCase().includes(q);
      const matchReview = log.review.toLowerCase().includes(q);
      if (!matchTitle && !matchAuthor && !matchStudent && !matchReview) return false;
    }

    return true;
  });

  // Unique classes for filter dropdown
  const classOptions = Array.from(new Set(logs.map((l) => l.classNum))).sort();

  return (
    <div className="space-y-6">
      
      {/* Top Header & Search Control Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            우리반 독서록 서재
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            친구들과 함께 쌓아 올린 지식과 감성의 도서 서재입니다.
          </p>
        </div>

        {/* Filter inputs */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Toggle 'My Records Only' if student name exists */}
          {currentStudentName && !isTeacherMode && (
            <button
              onClick={() => setFilterOnlyMine(!filterOnlyMine)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                filterOnlyMine
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>내 기록만 보기 ({currentStudentName})</span>
            </button>
          )}

          {/* Class Filter */}
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-amber-500"
          >
            <option value="all">전체 반 보기</option>
            {classOptions.map((c) => (
              <option key={c} value={c}>
                {c}반
              </option>
            ))}
          </select>

          {/* Search Field */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="도서명, 저자, 이름 검색..."
              className="bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-amber-500 w-44 sm:w-56"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

        </div>

      </div>

      {/* Logs Count Stats Banner */}
      <div className="flex items-center justify-between text-xs font-medium text-slate-600 px-1">
        <span>
          총 <strong className="text-amber-600 font-extrabold">{filteredLogs.length}</strong>
          건의 독서록이 검색되었습니다.
        </span>
      </div>

      {/* Card Grid */}
      {filteredLogs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400 space-y-3">
          <BookOpen className="w-12 h-12 mx-auto text-slate-300" />
          <p className="text-sm font-medium">등록된 독서록이 없습니다.</p>
          <p className="text-xs text-slate-400">
            책을 읽고 상단의 양식에 첫 독서록을 작성해 보세요!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              onClick={() => setSelectedLog(log)}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 p-5 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
            >
              {/* Top Card Badge */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60">
                  {log.grade}학년 {log.classNum}반 {log.studentName}
                </span>

                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < log.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200 fill-slate-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Book Title & Author */}
              <div className="space-y-1.5 mb-3">
                <h4 className="text-base font-bold text-slate-900 font-serif line-clamp-1 group-hover:text-amber-600 transition-colors">
                  {log.bookTitle}
                </h4>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <span>지은이: {log.author || '미상'}</span>
                  {log.publisher && (
                    <>
                      <span>•</span>
                      <span>{log.publisher}</span>
                    </>
                  )}
                </p>
              </div>

              {/* Review Quote Highlight */}
              <div className="bg-slate-50/90 p-3 rounded-xl border border-slate-100 my-2 flex-1 flex items-start gap-2">
                <Quote className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5 opacity-60" />
                <p className="text-xs text-slate-700 line-clamp-2 italic leading-relaxed">
                  "{log.review}"
                </p>
              </div>

              {/* Footer Date & Read More */}
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {log.date}
                </span>
                <span className="text-amber-600 font-bold flex items-center group-hover:translate-x-0.5 transition-transform">
                  자세히 보기 <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Optional Teacher Delete Action */}
              {isTeacherMode && onDeleteLog && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`'${log.bookTitle}' 독서록을 정말 삭제하시겠습니까?`)) {
                      onDeleteLog(log.id);
                    }
                  }}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-opacity"
                  title="독서록 삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            
            <button
              onClick={() => setSelectedLog(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 border-b border-slate-100 pb-4 pr-8">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold text-xs">
                  {selectedLog.grade}학년 {selectedLog.classNum}반 {selectedLog.studentName} 학생
                </span>
                <span className="text-xs text-slate-400">{selectedLog.date} 작성</span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 font-serif">
                {selectedLog.bookTitle}
              </h2>

              <p className="text-xs text-slate-500">
                저자: {selectedLog.author || '미상'} | 출판사: {selectedLog.publisher || '미상'}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1 text-amber-400 pt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < selectedLog.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200 fill-slate-100'
                    }`}
                  />
                ))}
                <span className="text-xs font-bold text-slate-700 ml-1">
                  ({selectedLog.rating}점)
                </span>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                📘 줄거리
              </h4>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                {selectedLog.summary}
              </div>
            </div>

            {/* Review */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                💬 한 줄 감상평 & 느낀 점
              </h4>
              <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200/70 text-xs text-amber-950 font-medium leading-relaxed italic">
                "{selectedLog.review}"
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
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
