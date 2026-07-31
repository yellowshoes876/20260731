import React, { useState, useEffect } from 'react';
import { BookOpen, User, Building, Star, Sparkles, Send, RotateCcw, Bookmark, CheckCircle, GraduationCap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ReadingLog, StudentInfo } from '../types';
import { getSavedStudentInfo, saveStudentInfo } from '../utils/gasService';

interface StudentFormProps {
  onSubmitLog: (log: Omit<ReadingLog, 'id' | 'createdAt'>) => Promise<void>;
  isSubmitting: boolean;
}

export const StudentForm: React.FC<StudentFormProps> = ({ onSubmitLog, isSubmitting }) => {
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    grade: '3',
    classNum: '1',
    studentName: '',
  });

  const [bookTitle, setBookTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [summary, setSummary] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load saved student info on mount
  useEffect(() => {
    const saved = getSavedStudentInfo();
    if (saved) {
      setStudentInfo(saved);
    }
  }, []);

  // Auto-save student info changes
  const handleStudentInfoChange = (field: keyof StudentInfo, value: string) => {
    const updated = { ...studentInfo, [field]: value };
    setStudentInfo(updated);
    saveStudentInfo(updated);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentInfo.grade || !studentInfo.classNum || !studentInfo.studentName.trim()) {
      alert('학년, 반, 학생 이름을 모두 입력해 주세요.');
      return;
    }

    if (!bookTitle.trim()) {
      alert('도서명을 입력해 주세요.');
      return;
    }

    if (!summary.trim() || !review.trim()) {
      alert('줄거리와 한 줄 감상평을 정성껏 작성해 주세요.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const newLogData = {
      grade: studentInfo.grade.trim(),
      classNum: studentInfo.classNum.trim(),
      studentName: studentInfo.studentName.trim(),
      bookTitle: bookTitle.trim(),
      author: author.trim() || '미상',
      publisher: publisher.trim() || '미상',
      summary: summary.trim(),
      review: review.trim(),
      rating,
      date: todayStr,
    };

    await onSubmitLog(newLogData);

    // Fire celebratory confetti!
    triggerConfetti();

    // Reset book form fields (retain student profile)
    setBookTitle('');
    setAuthor('');
    setPublisher('');
    setSummary('');
    setReview('');
    setRating(5);

    setToastMessage('🎉 독서기록이 성공적으로 등록되었습니다!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleResetBookFields = () => {
    setBookTitle('');
    setAuthor('');
    setPublisher('');
    setSummary('');
    setReview('');
    setRating(5);
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-100 shadow-xl shadow-amber-900/5 p-6 sm:p-8 space-y-8 relative overflow-hidden">
      
      {/* Decorative Accent Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-100/50 via-emerald-50/30 to-transparent rounded-bl-full pointer-events-none" />

      {/* Form Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
              오늘의 독서 기록 작성
              <Sparkles className="w-4 h-4 text-amber-500" />
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              읽은 책의 소중한 감상과 남겨둘 인상을 적어보세요.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetBookFields}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition"
          title="책 정보 양식 초기화"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">양식 지우기</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-between shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        
        {/* Section 1: Student Profile Info */}
        <div className="bg-slate-50/80 p-4 sm:p-5 rounded-xl border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-1">
            <GraduationCap className="w-4 h-4 text-amber-600" />
            <span>학생 정보 (최초 입력 시 자동으로 저장됩니다)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                학년
              </label>
              <select
                value={studentInfo.grade}
                onChange={(e) => handleStudentInfoChange('grade', e.target.value)}
                className="w-full bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none transition"
              >
                {[1, 2, 3, 4, 5, 6].map((g) => (
                  <option key={g} value={String(g)}>
                    {g} 학년
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                반
              </label>
              <input
                type="text"
                value={studentInfo.classNum}
                onChange={(e) => handleStudentInfoChange('classNum', e.target.value)}
                placeholder="예: 1"
                className="w-full bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                이름
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={studentInfo.studentName}
                  onChange={(e) => handleStudentInfoChange('studentName', e.target.value)}
                  placeholder="예: 홍길동"
                  className="w-full bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 rounded-xl pl-8 pr-3 py-2 text-xs font-medium text-slate-800 outline-none transition"
                  required
                />
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Book Main Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-amber-600" />
              <span>도서명 (책 제목) *</span>
            </label>
            <input
              type="text"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              placeholder="예: 어린 왕자"
              className="w-full bg-slate-50/50 border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none transition font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-600" />
              <span>지은이 (저자)</span>
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="예: 앙투안 드 생텍쥐페리"
              className="w-full bg-slate-50/50 border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-amber-600" />
              <span>출판사</span>
            </label>
            <input
              type="text"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              placeholder="예: 열린책들"
              className="w-full bg-slate-50/50 border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none transition"
            />
          </div>
        </div>

        {/* Section 3: Rating Selection */}
        <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>이 책의 추천 평점 (별점)</span>
            </label>
            <p className="text-[11px] text-amber-700 mt-0.5">
              친구들에게 추천하고 싶은 만큼 별을 눌러주세요!
            </p>
          </div>

          <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-amber-200 shadow-sm">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 text-amber-400 transition-transform hover:scale-125 focus:outline-none"
              >
                <Star
                  className={`w-6 h-6 ${
                    (hoverRating || rating) >= star
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-xs font-extrabold text-amber-900">
              {hoverRating || rating} / 5 점
            </span>
          </div>
        </div>

        {/* Section 4: Summary Textarea */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            주요 줄거리 정리 *
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            placeholder="책의 핵심 내용이나 인상 깊었던 사건의 흐름을 요약하여 적어보세요."
            className="w-full bg-slate-50/50 border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 outline-none transition leading-relaxed"
            required
          />
        </div>

        {/* Section 5: Review / Impression */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            한 줄 소감 및 느낀 점 (감상평) *
          </label>
          <input
            type="text"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="이 책을 읽고 새롭게 깨달은 점이나 마음속에 남은 생각을 한 줄로 표현해보세요."
            className="w-full bg-slate-50/50 border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 rounded-xl px-3.5 py-3 text-xs text-slate-900 placeholder-slate-400 outline-none transition font-medium"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 font-bold px-6 py-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>저장 중입니다...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>독서기록 등록하기</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
