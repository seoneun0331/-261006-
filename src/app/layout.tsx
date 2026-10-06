import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '김선은시뮬레이션(시험)(261006) - 인터랙티브 교육용 교구',
  description: '중·고등학교 교사와 학생을 위한 인터랙티브 시뮬레이션 및 실험 교구 플랫폼. 단진자, 스넬의 법칙, 푸리에 파동 합성 등 실감형 과학 교구와 실시간 의견 나눔터.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
