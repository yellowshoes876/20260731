import { ReadingLog, GasConfig, StudentInfo } from '../types';

const STORAGE_LOGS_KEY = 'classroom_reading_logs_v1';
const STORAGE_GAS_CONFIG_KEY = 'classroom_gas_config_v1';
const STORAGE_STUDENT_INFO_KEY = 'classroom_student_info_v1';

export const INITIAL_SAMPLE_LOGS: ReadingLog[] = [
  {
    id: 'log_101',
    grade: '3',
    classNum: '1',
    studentName: '김지우',
    bookTitle: '어린 왕자',
    author: '앙투안 드 생텍쥐페리',
    publisher: '열린책들',
    summary: '사막에 불시착한 조종사가 다른 별에서 온 어린 왕자를 만나 사랑과 우정, 관계의 의미에 대해 깨닫게 되는 감동적인 이야기입니다.',
    review: '눈에 보이지 않는 마음의 소중함을 깨달았고, 사막의 장미 이야기가 정말 기억에 남습니다.',
    rating: 5,
    date: '2026-07-28',
    createdAt: 1785200000000,
  },
  {
    id: 'log_102',
    grade: '3',
    classNum: '1',
    studentName: '김지우',
    bookTitle: '아몬드',
    author: '손원평',
    publisher: '창비',
    summary: '감정을 느끼지 못하는 감정 표현 불능증을 가진 윤재가 불행을 마주하면서 세상과 소통하고 성장해 나가는 이야기입니다.',
    review: '타인의 고통과 감정에 공감하는 법이 얼마나 소중한지 깊이 느꼈습니다.',
    rating: 5,
    date: '2026-07-20',
    createdAt: 1784500000000,
  },
  {
    id: 'log_103',
    grade: '3',
    classNum: '1',
    studentName: '김지우',
    bookTitle: '자전거 도둑',
    author: '박완서',
    publisher: '다림',
    summary: '시골에서 도시로 온 수남이가 자전거 사건을 통해 양심과 도덕성 사이에서 고민하며 솔직함의 가치를 배우는 작품입니다.',
    review: '작은 거짓말이라도 양심을 속이지 않는 바른 삶의 자세를 배워야겠다고 다짐했습니다.',
    rating: 4,
    date: '2026-07-15',
    createdAt: 1784000000000,
  },
  {
    id: 'log_104',
    grade: '3',
    classNum: '1',
    studentName: '김지우',
    bookTitle: '마당을 나온 암탉',
    author: '황선미',
    publisher: '사계절',
    summary: '양계장을 탈출해 스스로의 삶을 선택하고 초록이라는 족제비 아기를 자식처럼 키워내는 잎싹이의 숭고한 모성애와 자유 이야기입니다.',
    review: '잎싹이의 용기와 끝없는 사랑이 가슴 깊이 와닿아 눈물이 났습니다.',
    rating: 5,
    date: '2026-07-08',
    createdAt: 1783500000000,
  },
  {
    id: 'log_105',
    grade: '3',
    classNum: '2',
    studentName: '이서준',
    bookTitle: '지구 끝의 온실',
    author: '김초엽',
    publisher: '자이언트북스',
    summary: '멸망 이후 숲이 무성해진 지구에서 온실과 사람들의 따뜻한 연대로 위기를 극복해낸 신비롭고 아름다운 SF 소설입니다.',
    review: '절망적인 상황에서도 희망을 지키는 연대의 힘이 얼마나 위대한지 깨달았습니다.',
    rating: 5,
    date: '2026-07-25',
    createdAt: 1784900000000,
  },
  {
    id: 'log_106',
    grade: '3',
    classNum: '2',
    studentName: '이서준',
    bookTitle: '파랑새',
    author: '모리스 마테를링크',
    publisher: '인디고',
    summary: '칠칠이와 미칠이가 행복의 파랑새를 찾아 여행을 떠나지만, 결국 진정한 행복은 바로 우리 곁 가깝고 평범한 일상에 있음을 깨닫습니다.',
    review: '멀리서 행복을 찾기보다 매일의 작은 일상에 감사해야겠다고 생각했습니다.',
    rating: 4,
    date: '2026-07-18',
    createdAt: 1784300000000,
  },
  {
    id: 'log_107',
    grade: '3',
    classNum: '2',
    studentName: '이서준',
    bookTitle: '몽실언니',
    author: '권정생',
    publisher: '창비',
    summary: '어려운 비극적 시대 상황 속에서도 동생들을 지키며 따뜻한 인간애를 잃지 않는 몽실언니의 고귀한 삶을 그린 이야기입니다.',
    review: '몽실언니의 굳세고 당찬 마음과 사람을 온전히 사랑하는 진심에 가슴이 뭉클했습니다.',
    rating: 5,
    date: '2026-07-11',
    createdAt: 1783700000000,
  },
  {
    id: 'log_108',
    grade: '3',
    classNum: '1',
    studentName: '박민서',
    bookTitle: '시간을 파는 상점',
    author: '김선영',
    publisher: '자음과모음',
    summary: '의문의 제보를 받아 사람들의 시간을 나누고 해결해 주는 크로노스 상점을 운영하며 시간의 소중함과 관계의 귀함을 배우는 청소년 소설입니다.',
    review: '지나간 시간은 돌이킬 수 없으니 지금의 순간을 최선을 다해 살아야겠다고 느꼈습니다.',
    rating: 5,
    date: '2026-07-26',
    createdAt: 1785000000000,
  },
  {
    id: 'log_109',
    grade: '3',
    classNum: '1',
    studentName: '박민서',
    bookTitle: '원미동 사람들',
    author: '양귀자',
    publisher: '문학과지성사',
    summary: '부천 원미동이라는 평범한 동네 이웃들의 소소한 삶과 기쁨, 슬픔을 담은 따뜻한 사실주의 소설입니다.',
    review: '이웃 간의 정과 인간미 넘치는 소박한 사람들의 이야기가 정겹고 안락함을 주었습니다.',
    rating: 4,
    date: '2026-07-14',
    createdAt: 1783900000000,
  },
  {
    id: 'log_110',
    grade: '3',
    classNum: '3',
    studentName: '최현우',
    bookTitle: '노인과 바다',
    author: '어니스트 헤밍웨이',
    publisher: '민음사',
    summary: '쿠바의 늙은 어부 산티아고가 청새치와 외로운 사투를 벌이며 불굴의 도전 의지와 인내심을 보여주는 세계 명작입니다.',
    review: '인간은 파멸할지언정 패배하지 않는다는 대사가 가장 감동적이었습니다.',
    rating: 5,
    date: '2026-07-22',
    createdAt: 1784600000000,
  }
];

export function getLocalLogs(): ReadingLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_LOGS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(INITIAL_SAMPLE_LOGS));
      return INITIAL_SAMPLE_LOGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load logs from localStorage', err);
    return INITIAL_SAMPLE_LOGS;
  }
}

export function saveLocalLogs(logs: ReadingLog[]): void {
  try {
    localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(logs));
  } catch (err) {
    console.error('Failed to save logs to localStorage', err);
  }
}

export function getGasConfig(): GasConfig {
  try {
    const raw = localStorage.getItem(STORAGE_GAS_CONFIG_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load gas config', err);
  }
  return { scriptUrl: '', isConnected: false };
}

export function saveGasConfig(config: GasConfig): void {
  try {
    localStorage.setItem(STORAGE_GAS_CONFIG_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save gas config', err);
  }
}

export function getSavedStudentInfo(): StudentInfo {
  try {
    const raw = localStorage.getItem(STORAGE_STUDENT_INFO_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load student info', err);
  }
  return { grade: '3', classNum: '1', studentName: '' };
}

export function saveStudentInfo(info: StudentInfo): void {
  try {
    localStorage.setItem(STORAGE_STUDENT_INFO_KEY, JSON.stringify(info));
  } catch (err) {
    console.error('Failed to save student info', err);
  }
}

// GAS Async Fetchers
export async function syncLogsFromGas(scriptUrl: string): Promise<{ success: boolean; logs?: ReadingLog[]; error?: string }> {
  if (!scriptUrl) {
    return { success: false, error: '구글 앱스 스크립트 웹 앱 URL이 설정되지 않았습니다.' };
  }

  try {
    const res = await fetch(scriptUrl);
    if (!res.ok) {
      throw new Error(`HTTP error status: ${res.status}`);
    }
    const json = await res.json();
    if (json.status === 'success' && Array.isArray(json.data)) {
      // Merge gas logs with local storage logs cleanly
      const localLogs = getLocalLogs();
      const mergedMap = new Map<string, ReadingLog>();
      
      // Load local logs first
      localLogs.forEach(log => mergedMap.set(log.id, log));
      // Overwrite/add remote logs
      json.data.forEach((log: ReadingLog) => {
        if (log.id && log.bookTitle) {
          mergedMap.set(log.id, log);
        }
      });

      const mergedLogs = Array.from(mergedMap.values()).sort((a, b) => b.createdAt - a.createdAt);
      saveLocalLogs(mergedLogs);
      
      // Update config
      saveGasConfig({
        scriptUrl,
        isConnected: true,
        lastSyncedAt: new Date().toLocaleTimeString('ko-KR')
      });

      return { success: true, logs: mergedLogs };
    } else {
      throw new Error(json.message || '응답 데이터 형식이 올바르지 않습니다.');
    }
  } catch (err: any) {
    console.warn('GAS Sync warning:', err);
    return { success: false, error: err.message || '구글 시트 연동 중 오류가 발생했습니다.' };
  }
}

export async function addLogToGas(scriptUrl: string, log: ReadingLog): Promise<boolean> {
  // Always update local storage first
  const logs = getLocalLogs();
  const updatedLogs = [log, ...logs];
  saveLocalLogs(updatedLogs);

  if (!scriptUrl) return true; // Saved locally

  try {
    // Send to GAS
    await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ action: 'add', log }),
    });
    return true;
  } catch (err) {
    console.warn('GAS Add Log Background Sync Warning:', err);
    return true; // Still saved locally
  }
}

export async function deleteLogFromGas(scriptUrl: string, logId: string): Promise<boolean> {
  // Update local storage first
  const logs = getLocalLogs();
  const filtered = logs.filter(l => l.id !== logId);
  saveLocalLogs(filtered);

  if (!scriptUrl) return true;

  try {
    await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ action: 'delete', id: logId }),
    });
    return true;
  } catch (err) {
    console.warn('GAS Delete Log Sync Warning:', err);
    return true;
  }
}
