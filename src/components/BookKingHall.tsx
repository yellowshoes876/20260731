import React from 'react';
import { Trophy, Crown, Award, Sparkles, Flame, BookOpen, Heart, PartyPopper, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ReadingLog, TopReader } from '../types';

interface BookKingHallProps {
  logs: ReadingLog[];
}

export const BookKingHall: React.FC<BookKingHallProps> = ({ logs }) => {
  // Get current year and month (e.g. "2026-07")
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentMonthTitle = `${now.getMonth() + 1}월`;

  // Filter current month logs
  const currentMonthLogs = logs.filter((l) => l.date && l.date.startsWith(currentMonthStr));

  // Compute student reading counts for this month
  const studentMap = new Map<string, { count: number; studentName: string; grade: string; classNum: string; books: string[] }>();

  currentMonthLogs.forEach((l) => {
    const key = `${l.grade}-${l.classNum}-${l.studentName}`;
    if (!studentMap.has(key)) {
      studentMap.set(key, {
        count: 0,
        studentName: l.studentName,
        grade: l.grade,
        classNum: l.classNum,
        books: [],
      });
    }
    const entry = studentMap.get(key)!;
    entry.count += 1;
    if (l.bookTitle && !entry.books.includes(l.bookTitle)) {
      entry.books.push(l.bookTitle);
    }
  });

  // Sort by count descending
  const topReaders = Array.from(studentMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const triggerCelebration = () => {
    // Grand celebratory fireworks
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      confetti({
        particleCount: 40,
        startVelocity: 30,
        spread: 360,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#C0C0C0', '#CD7F32', '#10B981', '#3B82F6'],
      });
    }, 250);
  };

  const MOTIVATIONAL_QUOTES = [
    "“책은 우리 안의 동결된 바다를 깨는 도끼이어야 한다.” — 프란츠 카프카",
    "“오늘 읽은 한 줄의 글귀가 내일의 생각하는 큰 힘이 됩니다.”",
    "“독서는 단지 지식을 더하는 것이 아니라 우리의 세상을 넓힙니다.”",
    "“꾸준한 독서 습관은 평생을 함께할 가장 든든한 지혜의 자산입니다.”"
  ];

  const randomQuote = MOTIVATIONAL_QUOTES[now.getDate() % MOTIVATIONAL_QUOTES.length];

  return (
    <div className="space-y-8">
      
      {/* Main Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950 border border-amber-500/30 p-8 text-white overflow-hidden shadow-2xl">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>{currentMonthTitle} 명예의 전당</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-white tracking-tight">
              👑 {currentMonthTitle} 우리반 이달의 독서왕
            </h2>

            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              이번 달 가장 많은 책을 읽고 정성스러운 독서 기록을 남겨준 멋진 독서왕들을 소개합니다!
            </p>

            <div className="pt-2 italic text-xs text-amber-200/80 flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{randomQuote}</span>
            </div>
          </div>

          <button
            onClick={triggerCelebration}
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-extrabold text-sm flex items-center gap-2.5 shadow-xl shadow-amber-500/25 transition-transform hover:scale-105 active:scale-95 shrink-0"
          >
            <PartyPopper className="w-5 h-5 text-slate-950" />
            <span>🎉 축하 세레머니!</span>
          </button>
        </div>

      </div>

      {/* Top 3 Rankings Cards */}
      {topReaders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400 space-y-3">
          <Trophy className="w-12 h-12 mx-auto text-amber-300" />
          <h4 className="text-base font-bold text-slate-700">이번 달 독서왕 도전자를 기다립니다!</h4>
          <p className="text-xs text-slate-500">
            {currentMonthTitle}에 책을 읽고 독서록을 작성하면 자동으로 명예의 전당에 등재됩니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          {topReaders.map((reader, index) => {
            const rank = index + 1;

            const rankStyles = {
              1: {
                border: 'border-amber-400/80 bg-gradient-to-b from-amber-50/90 via-white to-amber-50/30',
                badgeBg: 'bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950',
                badgeText: '🥇 1st Place',
                crownColor: 'text-amber-500',
                glow: 'shadow-2xl shadow-amber-500/15 ring-2 ring-amber-400/50',
              },
              2: {
                border: 'border-slate-300 bg-gradient-to-b from-slate-50/90 via-white to-slate-50/30',
                badgeBg: 'bg-gradient-to-r from-slate-300 to-slate-500 text-slate-950',
                badgeText: '🥈 2nd Place',
                crownColor: 'text-slate-400',
                glow: 'shadow-lg shadow-slate-400/10',
              },
              3: {
                border: 'border-amber-700/30 bg-gradient-to-b from-amber-900/5 via-white to-amber-900/5',
                badgeBg: 'bg-gradient-to-r from-amber-700 to-amber-800 text-white',
                badgeText: '🥉 3rd Place',
                crownColor: 'text-amber-700',
                glow: 'shadow-lg shadow-amber-800/10',
              },
            }[rank] || {
              border: 'border-slate-200 bg-white',
              badgeBg: 'bg-slate-200 text-slate-800',
              badgeText: `${rank}위`,
              crownColor: 'text-slate-400',
              glow: 'shadow',
            };

            return (
              <div
                key={reader.studentName}
                className={`rounded-3xl p-6 border ${rankStyles.border} ${rankStyles.glow} relative flex flex-col justify-between space-y-5 transition-transform hover:-translate-y-1`}
              >
                {/* Crown / Rank Badge Header */}
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-black shadow-sm ${rankStyles.badgeBg}`}>
                    {rankStyles.badgeText}
                  </span>
                  <div className={`p-2.5 rounded-2xl bg-white shadow-md ${rankStyles.crownColor}`}>
                    <Trophy className="w-6 h-6" />
                  </div>
                </div>

                {/* Reader Profile */}
                <div className="space-y-2 text-center py-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold">
                    {reader.grade}학년 {reader.classNum}반
                  </span>

                  <h3 className="text-2xl font-black text-slate-900 font-serif">
                    {reader.studentName}
                  </h3>

                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 font-extrabold text-sm">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    <span>이번 달 총 {reader.count}권 읽음</span>
                  </div>
                </div>

                {/* Favorite books list */}
                <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs text-slate-700">
                  <span className="font-bold text-[11px] text-slate-500 flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                    읽은 대표 도서:
                  </span>
                  <p className="line-clamp-2 font-medium text-slate-900 italic">
                    {reader.books.slice(0, 3).join(', ')}
                    {reader.books.length > 3 && ' 외...'}
                  </p>
                </div>

                {/* Motivational Footer */}
                <div className="pt-2 border-t border-slate-100 text-center text-[11px] font-bold text-emerald-700 flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>학급 독서왕 등재를 축하합니다!</span>
                </div>

              </div>
            );
          })}

        </div>
      )}

      {/* Monthly Statistics Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            {currentMonthTitle} 우리반 전체 독서 열기
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            이번 달 총 <strong className="text-amber-600 font-extrabold">{currentMonthLogs.length}권</strong>의 독서록이 쌓여 지혜의 창고가 채워지고 있습니다.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="block text-[10px] text-slate-400 font-bold uppercase">이달 총 기록</span>
            <span className="text-lg font-black text-slate-800">{currentMonthLogs.length}건</span>
          </div>

          <div className="px-4 py-2 bg-amber-50 rounded-xl border border-amber-200 text-center">
            <span className="block text-[10px] text-amber-700 font-bold uppercase">참여 독서왕</span>
            <span className="text-lg font-black text-amber-900">{studentMap.size}명</span>
          </div>
        </div>
      </div>

    </div>
  );
};
