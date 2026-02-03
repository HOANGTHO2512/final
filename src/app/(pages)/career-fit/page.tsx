'use client';

import Chip from '@/components/Chip';
import RadarChart from '@/components/RadarChart';
import { useAuth } from '@/context/AuthContext';
import {
  CERT_LIST,
  DEPARTMENTS,
  DEPT_TRAITS,
  EXPERIENCE_LIST,
  HOLLAND_CODES,
  HOLLAND_TOOLTIP
} from '@/data/careerData';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CareerFitPage() {
  const { user, getSyncData } = useAuth();
  const [dept, setDept] = useState('資管');
  const [grade, setGrade] = useState('三上');
  const [name, setName] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedExp, setSelectedExp] = useState<string[]>([]);
  const [selectedCert, setSelectedCert] = useState<string[]>([]);
  const [selectedHolland, setSelectedHolland] = useState<string[]>([]);
  const [results, setResults] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [saving, setSaving] = useState(false);

  // Load user name from auth
  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }

    // Check for synced quiz data
    const syncData = getSyncData();
    if (syncData?.holland) {
      const hCodes = typeof syncData.holland === 'string'
        ? syncData.holland.split('')
        : syncData.holland;
      setSelectedHolland(hCodes);
      toast(`已自動同步 ${hCodes.length} 項 Holland 測驗結果 (${hCodes.join('')})`);
    }
  }, [user, getSyncData]);

  // Get courses for current dept/grade
  const getCourses = () => {
    const deptData = DEPARTMENTS[dept as keyof typeof DEPARTMENTS];
    if (!deptData) return [];
    return (deptData as any)[grade] || [];
  };

  // Toggle handlers
  const toggleCourse = (course: string, checked: boolean) => {
    setSelectedCourses(prev =>
      checked ? [...prev, course] : prev.filter(c => c !== course)
    );
  };

  const toggleExp = (exp: any, checked: boolean) => {
    const expValue = typeof exp === 'string' ? exp : exp.v;
    setSelectedExp(prev =>
      checked ? [...prev, expValue] : prev.filter(e => e !== expValue)
    );
  };

  const toggleCert = (cert: any, checked: boolean) => {
    const certValue = typeof cert === 'string' ? cert : cert.v;
    setSelectedCert(prev =>
      checked ? [...prev, certValue] : prev.filter(c => c !== certValue)
    );
  };

  const toggleHolland = (code: string, checked: boolean) => {
    setSelectedHolland(prev =>
      checked ? [...prev, code] : prev.filter(c => c !== code)
    );
  };

  // Toast notification
  const toast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  // Calculate results
  const calculate = () => {
    const allCourses = getCourses();
    const totalReq = allCourses.length;

    const dims: Record<string, number> = {};

    // Academic: course completion
    dims.academic = totalReq > 0 ? Math.round((selectedCourses.length / totalReq) * 100) : 0;

    // Practical: experience count
    dims.practical = Math.min(selectedExp.length * 30, 100);

    // Skill: certification level
    dims.skill = selectedCert.includes('A級') || selectedCert.includes('A') ? 100 : (selectedCert.includes('B級') || selectedCert.includes('B') ? 70 : 20);

    // Match: Holland overlap
    const traits = DEPT_TRAITS[dept as keyof typeof DEPT_TRAITS]?.holland || [];
    const matchCount = selectedHolland.filter(h => traits.includes(h)).length;
    dims.match = matchCount >= 2 ? 90 : (matchCount === 1 ? 70 : 50);

    // Communication: soft skills
    dims.communication = (selectedExp.some((e: any) => ['社團幹部', '社團', '競賽'].includes(e))) ? 90 : 65;

    // Weighted total
    const weights = { academic: 0.22, practical: 0.20, skill: 0.22, match: 0.18, communication: 0.18 };
    let total = Math.round(
      dims.academic * weights.academic +
      dims.practical * weights.practical +
      dims.skill * weights.skill +
      dims.match * weights.match +
      dims.communication * weights.communication
    );
    total = Math.max(0, Math.min(100, total));

    // Generate action plan based on grade
    let actionPlan = [];
    if (grade.includes('一') || grade.includes('二')) {
      actionPlan = [
        { day: '30 天', action: '探索系上選修，加入一個感興趣的社團或讀書會。' },
        { day: '60 天', action: '維持 GPA，並嘗試接觸基礎程式或設計工具 (Git/Figma)。' },
        { day: '90 天', action: '規劃暑假實習或參加校內外競賽。' }
      ];
    } else {
      actionPlan = [
        { day: '30 天', action: '整理 GitHub/Behance 作品集，盤點缺少的關鍵技能。' },
        { day: '60 天', action: '投遞實習履歷，並完成一個完整的 Side Project。' },
        { day: '90 天', action: '模擬面試練習，建立專業人脈網絡。' }
      ];
    }

    // Strengths and weaknesses
    const strengths = [];
    const weaknesses = [];

    if (dims.academic >= 80) {
      strengths.push('學業基礎穩固，核心課程完成度高。');
    } else {
      weaknesses.push('必修學分缺口較大，建議優先補齊。');
    }

    if (dims.practical >= 50) {
      strengths.push('具備實務經驗，履歴競爭力佳。');
    } else {
      weaknesses.push('缺乏專題或實習經歷，建議參加黑客松或 Side Project。');
    }

    if (dims.skill >= 70) {
      strengths.push('證照或技能基礎良好。');
    } else {
      weaknesses.push('建議取得相關證照或完成技能課程。');
    }

    // Career suggestions
    const careerMap: Record<string, string[]> = {
      '資管': ['PM', '系統分析師'],
      '資工': ['軟體工程師', 'AI工程師'],
      '資傳': ['UI/UX設計師', '數位行銷']
    };

    const resultData = {
      total,
      dims,
      hollandTop: selectedHolland.slice(0, 3).join('') || '未填寫',
      traits: DEPT_TRAITS[dept as keyof typeof DEPT_TRAITS],
      careers: careerMap[dept] || [],
      strengths,
      weaknesses,
      actionPlan
    };

    setResults(resultData);

    // Save to database
    saveResultsToDatabase(resultData);
  };

  const saveResultsToDatabase = async (resultData: any) => {
    console.log('🔍 Starting save process...');
    console.log('User:', user ? '✅ Logged in' : '❌ Not logged in');
    
    if (!user) {
      console.warn('⚠️ User not logged in, skipping save');
      toast('⚠️ 請先登入以儲存測驗結果');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      console.log('Token:', token ? '✅ Found' : '❌ Not found');
      
      if (!token) {
        console.warn('⚠️ No token found in localStorage');
        toast('⚠️ 未找到登入憑證，請重新登入');
        return;
      }

      console.log('📤 Sending data to /api/tests/career-fit...');
      const payload = {
        totalScore: resultData.total,
        dimensions: resultData.dims,
        strengths: resultData.strengths,
        weaknesses: resultData.weaknesses,
        actionPlan: resultData.actionPlan,
        recommendations: resultData.careers,
        answers: {
          dept,
          grade,
          name,
          selectedCourses,
          selectedExp,
          selectedCert,
          selectedHolland
        }
      };
      console.log('Payload:', payload);

      const response = await fetch('/api/tests/career-fit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Test results saved successfully!', data);
        toast(`✅ 履歷健檢結果已自動儲存！ (ID: ${data.resultId})`);
      } else {
        const error = await response.json();
        console.error('❌ Save failed:', error);
        toast(`❌ 儲存失敗: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Save error:', error);
      toast(`❌ 儲存時發生錯誤: ${(error as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  // Reset
  const reset = () => {
    if (typeof window !== 'undefined' && confirm('確定要重置所有資料嗎？')) {
      setSelectedCourses([]);
      setSelectedExp([]);
      setSelectedCert([]);
      setSelectedHolland([]);
      setResults(null);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <div className="max-w-[1180px] mx-auto px-4 py-7">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-5 rounded-xl shadow-lg mb-5">
          <Link href="/" className="text-white/90 hover:text-white text-sm inline-flex items-center mb-2">
            ← 返回首頁
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-extrabold">CareerFit Pro — 履歷健檢中心</h1>
              <div className="text-sm opacity-90 mt-1">已啟用跨模組資料同步 (v5.1)</div>
            </div>
            <div className="text-sm bg-white/15 px-3 py-1.5 rounded-full font-semibold">
              Data Synced
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-5">
          {/* Main Form */}
          <main className="space-y-4">
            {/* Basic Info */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <h2 className="text-base font-bold mb-3">📝 基本資料與課程</h2>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">姓名</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="你的名字"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">系所</label>
                  <select
                    value={dept}
                    onChange={(e) => { setDept(e.target.value); setSelectedCourses([]); }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                  >
                    {Object.keys(DEPARTMENTS).map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">年級</label>
                  <select
                    value={grade}
                    onChange={(e) => { setGrade(e.target.value); setSelectedCourses([]); }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                  >
                    {['一上', '一下', '二上', '二下', '三上', '三下', '四上', '四下', '延畢'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">課程完成 (勾選已修課程)</label>
                <div className="space-y-3">
                  {getCourses().length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {getCourses().map((course: string) => (
                        <Chip
                          key={course}
                          label={course}
                          value={course}
                          checked={selectedCourses.includes(course)}
                          onChange={toggleCourse}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-slate-400 text-sm">(無課程)</div>
                  )}
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <h2 className="text-base font-bold mb-3">🚀 經歷與特質加權</h2>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">實作與經歷</label>
                <div className="flex flex-wrap gap-2">
                  {EXPERIENCE_LIST.map((item: any, idx: number) => (
                    <Chip
                      key={`exp-${idx}-${item.v}`}
                      label={item.t || item}
                      value={item.v || item}
                      checked={selectedExp.includes(item.v || item)}
                      onChange={(val, checked) => toggleExp(item, checked)}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">專業證照</label>
                <div className="flex flex-wrap gap-2">
                  {CERT_LIST.map((item: any, idx: number) => (
                    <Chip
                      key={`cert-${idx}-${item.v}`}
                      label={item.t || item}
                      value={item.v || item}
                      checked={selectedCert.includes(item.v || item)}
                      onChange={(val, checked) => toggleCert(item, checked)}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Holland 興趣代碼 (品牌經營區)</label>
                <p className="text-xs text-slate-400 mb-2">*系統將自動同步個人品牌測驗結果</p>
                <div className="flex flex-wrap gap-2">
                  {HOLLAND_CODES.map((code: string) => (
                    <Chip
                      key={code}
                      label={`${code} ${HOLLAND_TOOLTIP[code as keyof typeof HOLLAND_TOOLTIP]}`}
                      value={code}
                      checked={selectedHolland.includes(code)}
                      onChange={(val, checked) => toggleHolland(val, checked)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={calculate}
                  className="bg-blue-600 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition shadow"
                >
                  📊 計算履歷健康指數
                </button>
                <button
                  onClick={reset}
                  className="bg-white border border-slate-200 text-slate-500 px-4 py-2.5 rounded-lg font-bold hover:bg-slate-50 transition"
                >
                  重置
                </button>
              </div>
            </div>
          </main>

          {/* Sidebar Results */}
          <aside>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 sticky top-5">
              {/* Gauge */}
              <div className="text-center mb-4">
                <div className="flex justify-center">
                  <div className="w-56 h-28 relative">
                    <svg className="w-full h-full" viewBox="0 0 200 120">
                      <defs>
                        <linearGradient id="g2" x1="0%" x2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#2563eb" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M20 100 A 80 80 0 0 1 180 100"
                        stroke="#e6eef8"
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path
                        d="M20 100 A 80 80 0 0 1 180 100"
                        stroke="url(#g2)"
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={results ? `${(results.total / 100) * 251.2} 251.2` : '0 251.2'}
                        style={{ transition: 'stroke-dasharray 0.9s cubic-bezier(0.2, 0.9, 0.2, 1)' }}
                      />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-4xl font-extrabold text-slate-800">{results?.total || 0}</div>
                  <div className="text-sm text-slate-400">總分 (100分制)</div>
                </div>
              </div>

              {!results ? (
                <div className="text-center text-slate-400 py-4 text-sm">
                  <p>請確認左側修課與經歷資料<br />系統將進行多維度評分</p>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in-up">
                  {/* Radar */}
                  <div>
                    <h3 className="font-bold mb-2">📊 五力健檢雷達圖</h3>
                    <div className="h-48">
                      <RadarChart
                        labels={['學業完成', '實務經歷', '專業技能', '適性契合', '軟實力']}
                        data={[
                          results.dims.academic,
                          results.dims.practical,
                          results.dims.skill,
                          results.dims.match,
                          results.dims.communication
                        ]}
                      />
                    </div>
                  </div>

                  {/* Dept Match */}
                  <div>
                    <h3 className="font-bold mb-2">🎯 職涯適配分析</h3>
                    <div className="p-3 bg-sky-50 rounded-lg border border-sky-200 text-sm mb-2">
                      <strong>{dept} 重點特色：</strong> {results.traits?.focus}<br />
                      <strong>適性代碼：</strong> {results.traits?.holland?.join('')}
                      (你的吻合度:
                      <span style={{ color: results.dims.match >= 80 ? 'green' : 'inherit' }}>
                        {results.dims.match >= 80 ? '高' : '一般'}
                      </span>
                      )
                    </div>
                    <ul className="space-y-1">
                      {results.careers.map((c: string) => (
                        <li key={c} className="text-sm text-green-700">✓ {c}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Strengths/Weaknesses */}
                  <div>
                    <h3 className="font-bold mb-2">✅ 優勢 / ❌ 待補足</h3>
                    <ul className="space-y-1">
                      {results.strengths.map((s: string, i: number) => (
                        <li key={i} className="text-sm text-green-700">✓ {s}</li>
                      ))}
                      {results.weaknesses.map((w: string, i: number) => (
                        <li key={i} className="text-sm text-orange-600">✗ {w}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Plan */}
                  <div>
                    <h3 className="font-bold mb-2">📅 30/60/90 天行動計畫</h3>
                    <div className="border-l-2 border-slate-200 pl-4 space-y-3">
                      {results.actionPlan.map((item: any, i: number) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-6 top-1 w-2 h-2 bg-blue-600 rounded-full shadow"></div>
                          <strong>{item.day}：</strong>{item.action}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                  >
                    📄 下載完整報告 (PDF)
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-lg shadow-xl z-[10000] flex items-center gap-2">
          ✅ {toastMessage}
        </div>
      )}
    </div>
  );
}
