import { Simulation, Comment, LeaderboardEntry } from '@/types';

export const INITIAL_SIMULATIONS: Simulation[] = [
  {
    id: 'sim-1',
    title: '단진자 주기와 중력가속도 탐구 실험',
    subject: '물리',
    targetGrade: '고등학교 물리학 I / 중학교 3학년 과학',
    author: '김선은 교사 (물리과)',
    description: '진자의 길이(L)와 중력 가속도(g)를 조절하여 단진자의 왕복 주기 T = 2π√(L/g) 공식을 직접 검증해보고, 지구, 달, 목성 등 다양한 천체 환경에서의 주기를 비교 관찰할 수 있는 인터랙티브 시뮬레이터입니다.',
    learningObjectives: [
      '단진자의 진폭이 작을 때 주기가 질량에 무관함을 설명할 수 있다.',
      '진자의 길이와 주기의 제곱이 비례함을 그래프로 해석할 수 있다.',
      '다양한 천체(지구, 달, 화성, 목성)의 중력가속도 차이를 주기를 통해 유추할 수 있다.'
    ],
    teacherNote: '💡 [교사 지도 Tip]: 학생들에게 처음에는 추의 질량을 바꾸어보게 한 뒤, 주기가 변하지 않는 "진자의 등시성"을 먼저 체감하게 해 주세요. 이후 실의 길이를 4배로 늘렸을 때 주기가 2배가 되는 것을 확인하도록 유도하면 효과적입니다.',
    likes: 42,
    commentsCount: 3,
    createdAt: '2026-10-06T09:00:00Z',
    type: 'pendulum'
  },
  {
    id: 'sim-2',
    title: '스넬의 법칙과 빛의 전반사 광학 실험실',
    subject: '광학',
    targetGrade: '고등학교 물리학 I / 중학교 2학년 빛과 파동',
    author: '김선은 교사 (물리과)',
    description: '매질 1과 매질 2의 굴절률(n1, n2) 및 입사각(θ1)을 자유자재로 변경하며 굴절각(θ2)을 관측합니다. 밀한 매질에서 소한 매질로 진행할 때 임계각을 넘어설 때 일어나는 "전반사(Total Internal Reflection)" 현상을 생생한 레이저 그래픽으로 시각화합니다.',
    learningObjectives: [
      '스넬의 법칙(n1·sinθ1 = n2·sinθ2)을 통해 굴절률과 굴절각의 관계를 파악한다.',
      '빛이 굴절률이 큰 매질에서 작은 매질로 진행할 때 나타나는 전반사 조건을 찾는다.',
      '광통신(광섬유)과 내시경의 원리를 전반사 실험 결과를 토대로 설명할 수 있다.'
    ],
    teacherNote: '💡 [교사 지도 Tip]: 매질 1을 물(n=1.33) 또는 유리(n=1.5), 매질 2를 공기(n=1.0)로 설정하게 한 뒤, 입사각을 40도에서 서서히 50도로 올리면서 굴절광선이 사라지고 100% 반사되는 임계각 순간을 포착하게 해 보세요.',
    likes: 38,
    commentsCount: 2,
    createdAt: '2026-10-06T10:30:00Z',
    type: 'optics'
  },
  {
    id: 'sim-3',
    title: '푸리에 파동 합성 및 정상파/음파 간섭 탐구실',
    subject: '파동/수학',
    targetGrade: '고등학교 물리학 II / 미적분 융합',
    author: '김선은 교사 (물리과)',
    description: '기본 주파수(기본음)와 여러 배음(고조파 Harmonics)의 진폭과 위상을 중첩하여 사각파, 톱니파, 삼각파 등 복잡한 소리 파형을 만들어내는 인터랙티브 파동 합성기입니다. 파동의 중첩 원리와 실제 악기 음색의 비밀을 밝혀냅니다.',
    learningObjectives: [
      '파동의 중첩 원리에 따라 두 파동이 만났을 때의 합성 변위를 계산할 수 있다.',
      '다양한 배음의 조합을 통해 악기마다 고유한 음색(소리의 맵시)이 생기는 원리를 이해한다.',
      '푸리에 급수(Fourier Series)가 복잡한 파동을 단순한 사인파의 합으로 분해/합성함을 직관적으로 체험한다.'
    ],
    teacherNote: '💡 [교사 지도 Tip]: 1차(기본음)에 3차, 5차 홀수 배음을 추가할수록 점점 매끄러운 곡선이 직사각형 형태(사각파)로 변하는 것을 보여주세요. 신디사이저나 전자악기 음향 원리와 연결하면 학생들의 흥미가 급상승합니다.',
    likes: 51,
    commentsCount: 4,
    createdAt: '2026-10-06T11:15:00Z',
    type: 'wave'
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c-1',
    simulationId: 'sim-1',
    studentName: '이민호',
    gradeClass: '2학년 3반',
    content: '달나라로 중력을 바꾸니까 진자가 진짜 훨씬 느리게 움직여요! 우주복 입고 걸을 때 붕 뜨는 이유를 이제야 확실히 알겠습니다.',
    createdAt: '2026-10-06T12:00:00Z'
  },
  {
    id: 'c-2',
    simulationId: 'sim-1',
    studentName: '박서연',
    gradeClass: '2학년 1반',
    content: '추 무게를 10kg으로 늘려도 주기가 1초도 안 변하는 게 너무 신기해요. 갈릴레이가 피사의 대성당 샹들리에 보고 발견했다는 게 실감납니다!',
    createdAt: '2026-10-06T13:20:00Z'
  },
  {
    id: 'c-3',
    simulationId: 'sim-1',
    studentName: '정우진',
    gradeClass: '2학년 5반',
    content: '선생님! 진자 실의 길이를 1m에서 4m로 하니까 주기가 딱 2배가 되네요! 공식 T=2π√(L/g)가 눈앞에서 증명됐어요.',
    createdAt: '2026-10-06T14:10:00Z'
  },
  {
    id: 'c-4',
    simulationId: 'sim-2',
    studentName: '최다은',
    gradeClass: '1학년 4반',
    content: '유리에서 공기로 쏠 때 41.8도 넘어가니까 빛이 밖으로 하나도 안 나가고 튕겨 나와요! 광통신 케이블 속에서 빛이 이렇게 전송되는군요!',
    createdAt: '2026-10-06T14:45:00Z'
  },
  {
    id: 'c-5',
    simulationId: 'sim-2',
    studentName: '김태윤',
    gradeClass: '1학년 2반',
    content: '레이저 각도 조절 바가 부드러워서 실험실에서 각도기 들고 고생하던 것보다 100배 이해가 잘 됩니다. 시험공부할 때 이 시뮬레이터 꼭 다시 볼게요.',
    createdAt: '2026-10-06T15:30:00Z'
  },
  {
    id: 'c-6',
    simulationId: 'sim-3',
    studentName: '송지호',
    gradeClass: '3학년 2반',
    content: '홀수 배음들만 더하니까 진짜 교과서 그림처럼 각진 네모 파형(사각파)이 만들어집니다. 수학시간에 배운 삼각함수가 음악 소리가 되는 게 소름돋네요.',
    createdAt: '2026-10-06T16:00:00Z'
  },
  {
    id: 'c-7',
    simulationId: 'sim-3',
    studentName: '윤아린',
    gradeClass: '3학년 6반',
    content: '피아노 소리랑 플루트 소리가 파형이 다른 이유를 드디어 이해했습니다. 배음 진폭 조절하면서 소리의 모양을 볼 수 있어서 너무 유익해요!',
    createdAt: '2026-10-06T16:50:00Z'
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'lb-1',
    nickname: '물리마스터_민호',
    schoolGrade: '고2 (이화여고)',
    score: 100,
    simulationTitle: '단진자 주기와 중력가속도 탐구',
    playedAt: '2026-10-06 17:10'
  },
  {
    id: 'lb-2',
    nickname: '빛의마술사_서연',
    schoolGrade: '중3 (대청중)',
    score: 95,
    simulationTitle: '스넬의 법칙과 전반사 실험',
    playedAt: '2026-10-06 17:25'
  },
  {
    id: 'lb-3',
    nickname: '푸리에천재_우진',
    schoolGrade: '고3 (한성과고)',
    score: 95,
    simulationTitle: '푸리에 파동 합성 탐구실',
    playedAt: '2026-10-06 17:40'
  },
  {
    id: 'lb-4',
    nickname: '양자역학꿈나무',
    schoolGrade: '고1 (세화고)',
    score: 90,
    simulationTitle: '단진자 주기와 중력가속도 탐구',
    playedAt: '2026-10-06 18:05'
  },
  {
    id: 'lb-5',
    nickname: '아인슈타인후예',
    schoolGrade: '중2 (역삼중)',
    score: 85,
    simulationTitle: '스넬의 법칙과 전반사 실험',
    playedAt: '2026-10-06 18:30'
  }
];
