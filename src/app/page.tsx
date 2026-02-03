'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import FeatureCard from '@/components/FeatureCard';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function Home() {
  const { isLoggedIn } = useAuth();

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <main className="flex-grow pt-20 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
              <span className="inline-block py-1 px-4 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-wider mb-6 border border-blue-100">
                AI-POWERED CAREER NAVIGATION
              </span>
              
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-6">
                用數據理解自己，<br />打造更強大的
                <span className="text-blue-600 relative inline-block ml-2">
                  未來履歷
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </span>
                。
              </h1>
              
              <p className="text-lg text-slate-500 mb-10 leading-relaxed">
                整合 Holland 職涯興趣、Gallup 天賦優勢與大數據學程分析。<br />
                不只告訴你適合什麼，更直接為你生成履歷與行動計畫。
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2"
                >
                  開始探索旅程
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Module Cards */}
            <div id="modules" className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Brand Test Card */}
              <FeatureCard
                href="/brand-test"
                color="blue"
                delay={0.1}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
                title="個人品牌測驗"
                description="結合 Gallup Strengths 與 Holland 興趣分析，找出您的天賦優勢區。"
                features={[
                  'Top 5 天賦分析',
                  '六維能力雷達圖',
                  'AI 履歷草稿生成'
                ]}
                linkText="立即開始"
              />

              {/* Career Fit Card */}
              <FeatureCard
                href="/career-fit"
                color="teal"
                delay={0.2}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
                title="履歷健檢中心"
                description="輸入您的修課紀錄與經歷，系統自動計算履歷健康指數與競爭力。"
                features={[
                  '科系契合度診斷',
                  '必修/選修學分盤點',
                  '30/60/90 行動計畫'
                ]}
                linkText="進入健檢"
              />

              {/* Coming Soon Card */}
              <FeatureCard
                href="#"
                color="purple"
                delay={0.3}
                disabled={true}
                comingSoon={true}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                }
                title="系別推薦實驗室"
                description="不確定要選資工還是資管？讓 AI 根據你的特質推薦最適合的戰場。"
                features={[
                  '跨領域潛力分析',
                  '轉系/輔系評估',
                  '畢業出路預測'
                ]}
              />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
