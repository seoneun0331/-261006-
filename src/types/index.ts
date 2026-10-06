export interface Simulation {
  id: string;
  title: string;
  subject: '물리' | '광학' | '파동/수학';
  targetGrade: string;
  author: string;
  description: string;
  learningObjectives: string[];
  teacherNote: string;
  likes: number;
  commentsCount: number;
  createdAt: string;
  type: 'pendulum' | 'optics' | 'wave';
}

export interface Comment {
  id: string;
  simulationId: string;
  studentName: string;
  gradeClass: string;
  content: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  schoolGrade: string;
  score: number;
  simulationTitle: string;
  playedAt: string;
}
