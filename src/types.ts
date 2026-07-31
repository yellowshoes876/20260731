export interface ReadingLog {
  id: string;
  grade: string;        // 학년 (예: "3")
  classNum: string;     // 반 (예: "2")
  studentName: string;  // 학생 이름
  bookTitle: string;    // 도서명
  author: string;       // 지은이/저자
  publisher: string;    // 출판사
  summary: string;      // 줄거리
  review: string;       // 한 줄 소감/감상평
  rating: number;       // 별점 (1~5)
  date: string;         // YYYY-MM-DD
  createdAt: number;    // timestamp ms
}

export interface StudentInfo {
  grade: string;
  classNum: string;
  studentName: string;
}

export interface GasConfig {
  scriptUrl: string;
  isConnected: boolean;
  lastSyncedAt?: string;
}

export interface FilterOptions {
  grade: string;
  classNum: string;
  studentName: string;
  month: string;
  searchQuery: string;
}

export interface TopReader {
  studentName: string;
  grade: string;
  classNum: string;
  count: number;
  recentBook: string;
}
