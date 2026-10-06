-- ============================================================
-- 김선은시뮬레이션(시험)(261006) Supabase 데이터베이스 스키마
-- Region: Seoul (ap-northeast-2)
-- ============================================================

-- 1. 시뮬레이션 / 게시물 테이블 (id, title, content, author, created_at, likes)
CREATE TABLE IF NOT EXISTS simulations (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  target_grade TEXT,
  author TEXT NOT NULL,
  content TEXT,
  description TEXT,
  learning_objectives TEXT[],
  teacher_note TEXT,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  type TEXT DEFAULT 'pendulum'
);

-- 2. 댓글 테이블 (시뮬레이션별 학생 탐구 의견 및 질문)
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  simulation_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  grade_class TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 점수 랭킹 테이블 (id, nickname, score, played_at)
CREATE TABLE IF NOT EXISTS leaderboard (
  id TEXT PRIMARY KEY,
  nickname TEXT NOT NULL,
  school_grade TEXT,
  score INTEGER NOT NULL,
  simulation_title TEXT,
  played_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (RLS) 활성화 및 공용 읽기/쓰기 정책 등록
-- ============================================================

ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on simulations" ON simulations FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on simulations" ON simulations FOR ALL USING (true);

CREATE POLICY "Allow public read access on comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Allow public insert on comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete on comments" ON comments FOR DELETE USING (true);

CREATE POLICY "Allow public read access on leaderboard" ON leaderboard FOR SELECT USING (true);
CREATE POLICY "Allow public insert on leaderboard" ON leaderboard FOR INSERT WITH CHECK (true);

-- ============================================================
-- 초기 데이터 시드 (Initial Seed Data)
-- ============================================================

INSERT INTO simulations (id, title, subject, target_grade, author, description, teacher_note, likes, type)
VALUES 
  ('sim-1', '단진자 주기와 중력가속도 탐구 실험', '물리', '고등학교 물리학 I / 중3 과학', '김선은 교사 (물리과)', '진자의 길이(L)와 중력 가속도(g)를 조절하여 단진자의 왕복 주기 공식 T = 2π√(L/g)를 직접 검증합니다.', '질량을 바꾸어도 주기가 변하지 않는 등시성을 먼저 관찰하게 해 주세요.', 42, 'pendulum'),
  ('sim-2', '스넬의 법칙과 빛의 전반사 광학 실험실', '광학', '고등학교 물리학 I / 중2 빛과파동', '김선은 교사 (물리과)', '매질 1과 2의 굴절률 및 입사각을 변경하며 전반사 현상을 시각적으로 관측합니다.', '밀한 매질에서 소한 매질로 진입할 때의 임계각 순간을 포착하게 지도해 주세요.', 38, 'optics'),
  ('sim-3', '푸리에 파동 합성 및 정상파 탐구실', '파동/수학', '고등학교 물리학 II / 미적분 융합', '김선은 교사 (물리과)', '기본음과 여러 배음의 진폭을 합성하여 사각파, 톱니파 등 다양한 음색의 원리를 분석합니다.', '홀수 배음을 더할수록 각진 사각파로 수렴하는 푸리에 급수의 아름다움을 체험하게 해 주세요.', 51, 'wave')
ON CONFLICT (id) DO NOTHING;
