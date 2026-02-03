import { useEffect, useState } from 'react';
import Chip from '../components/Chip';
import RadarChart from '../components/RadarChart';
import { CAREER_MAP, DB, HOLLAND_CODES, HOLLAND_TOOLTIP, TRAITS_V6 } from '../data/careerData';

export default function CareerFitProPage() {
    // Auth State
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('s1123001');
    const [password, setPassword] = useState('password');
    const [loginLoading, setLoginLoading] = useState(false);

    // App State
    const [dept, setDept] = useState('資管');
    const [grade, setGrade] = useState('三上');
    const [classId, setClassId] = useState('B');
    const [name, setName] = useState('');
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [selectedExp, setSelectedExp] = useState([]);
    const [selectedCert, setSelectedCert] = useState([]);
    const [selectedHolland, setSelectedHolland] = useState([]);
    const [results, setResults] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Check login on mount
    useEffect(() => {
        const token = localStorage.getItem('cf_token');
        if (token) {
            setIsLoggedIn(true);
            setUsername(localStorage.getItem('cf_user') || 'Guest');
        }
    }, []);

    // Login handler
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginLoading(true);

        // Simulate API latency
        setTimeout(() => {
            const token = 'jwt_' + Math.random().toString(36).substr(2);
            localStorage.setItem('cf_token', token);
            localStorage.setItem('cf_user', username);
            setIsLoggedIn(true);
            setLoginLoading(false);
        }, 800);
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('cf_token');
        localStorage.removeItem('cf_user');
        setIsLoggedIn(false);
        window.location.reload();
    };

    // Get courses from DB
    const getCourses = () => {
        try {
            return DB[dept]?.[classId]?.[grade] || [];
        } catch (e) {
            return [];
        }
    };

    // Toggle handlers
    const toggleCourse = (courseName, checked) => {
        setSelectedCourses(prev =>
            checked ? [...prev, courseName] : prev.filter(c => c !== courseName)
        );
    };

    const toggleExp = (exp, checked) => {
        setSelectedExp(prev =>
            checked ? [...prev, exp] : prev.filter(e => e !== exp)
        );
    };

    const toggleCert = (cert, checked) => {
        setSelectedCert(prev =>
            checked ? [...prev, cert] : prev.filter(c => c !== cert)
        );
    };

    const toggleHolland = (code, checked) => {
        setSelectedHolland(prev =>
            checked ? [...prev, code] : prev.filter(c => c !== code)
        );
    };

    // Toast
    const toast = (msg) => {
        setToastMessage(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    // Calculate
    const calculate = () => {
        const courses = getCourses();
        const reqTotal = courses.filter(c => c.type === 'req').length;
        const reqChecked = courses.filter(c => c.type === 'req' && selectedCourses.includes(c.name)).length;
        const optChecked = courses.filter(c => c.type === 'opt' && selectedCourses.includes(c.name)).length;

        const scores = {};

        // Academic: Required % + bonus for electives
        let acadBase = reqTotal > 0 ? (reqChecked / reqTotal) * 80 : 0;
        scores.academic = Math.min(100, Math.round(acadBase + (optChecked * 5)));

        // Practical
        scores.practical = Math.min(100, selectedExp.length * 25);

        // Skill
        scores.skill = selectedCert.includes('A') || selectedCert.includes('A級') ? 100 :
            (selectedCert.includes('B') || selectedCert.includes('B級') ? 70 : 30);

        // Match
        const targetTraits = TRAITS_V6[dept]?.holland || [];
        const overlap = selectedHolland.filter(h => targetTraits.includes(h)).length;
        scores.match = overlap >= 2 ? 95 : (overlap === 1 ? 70 : 45);

        // Soft
        scores.soft = (selectedExp.includes('社團') || selectedExp.includes('社團幹部') || selectedExp.includes('競賽')) ? 90 : 60;

        // Total
        const total = Math.round(
            scores.academic * 0.25 +
            scores.practical * 0.2 +
            scores.skill * 0.2 +
            scores.match * 0.2 +
            scores.soft * 0.15
        );

        // Strengths/Weaknesses
        const strengths = [];
        const weaknesses = [];

        if (scores.academic > 80) strengths.push('必修課程完成度高，學術基礎穩固');
        else weaknesses.push('必修學分有缺口，請優先確認修課計畫');

        if (scores.practical > 50) strengths.push('具備實務/實習經驗，就業競爭力強');
        else weaknesses.push('缺乏專題或實習經歷，建議參加黑客松或 Side Project');

        setResults({
            total,
            scores,
            deptInfo: TRAITS_V6[dept],
            careers: CAREER_MAP[dept] || [],
            strengths,
            weaknesses
        });

        toast('分析完成！');
    };

    // Reset
    const reset = () => {
        if (confirm('重置將清除所有暫存資料，確定嗎？')) {
            setSelectedCourses([]);
            setSelectedExp([]);
            setSelectedCert([]);
            setSelectedHolland([]);
            setResults(null);
        }
    };

    // Login Overlay
    const renderLoginOverlay = () => (
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-400 ${isLoggedIn ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            style={{ background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(12px)' }}>
            <div className="bg-white p-10 rounded-3xl max-w-[380px] w-full shadow-2xl text-center">
                <div className="text-6xl mb-3">🎓</div>
                <h2 className="text-2xl font-extrabold text-blue-800 mb-2">CareerFit Pro</h2>
                <p className="text-slate-400 mb-6 text-sm">學生職涯履歷健檢系統 v6.0</p>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="學號 (User)"
                        className="w-full p-3.5 mb-2 border border-slate-300 rounded-lg bg-slate-50 text-base focus:border-blue-600 focus:bg-white focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] outline-none transition"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="密碼 (any)"
                        className="w-full p-3.5 mb-2 border border-slate-300 rounded-lg bg-slate-50 text-base focus:border-blue-600 focus:bg-white focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] outline-none transition"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loginLoading}
                        className="w-full mt-5 p-3.5 bg-blue-600 text-white rounded-lg font-bold text-base hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loginLoading ? '驗證中...' : '進入系統'}
                    </button>
                </form>
            </div>
        </div>
    );

    return (
        <>
            {renderLoginOverlay()}

            <div className={`max-w-[1180px] mx-auto p-5 transition-all ${!isLoggedIn ? 'blur-sm' : ''}`}>
                {/* Header */}
                <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-5 rounded-xl shadow-lg mb-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-extrabold">CareerFit Pro</h1>
                            <div className="text-sm opacity-90 mt-1">履歷健檢與職涯導航 (Full Stack Ver.)</div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 py-1.5 pl-4 pr-1.5 rounded-full">
                            <span className="text-sm font-medium">{username}</span>
                            <button
                                onClick={logout}
                                className="bg-white text-blue-600 px-3 py-1.5 rounded-full text-sm font-bold hover:bg-blue-50 transition"
                            >
                                登出
                            </button>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-5">
                    {/* Main Form */}
                    <main className="space-y-4">
                        {/* Basic Info Card */}
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-base font-bold">📝 修課與班級資料</h2>
                                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">已同步教務處資料庫</span>
                            </div>

                            <div className="grid grid-cols-4 gap-3 mb-4">
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
                                        {Object.keys(DB).map(d => (
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
                                        {['一上', '一下', '二上', '二下', '三上', '三下', '四上', '四下'].map(g => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">班級</label>
                                    <select
                                        value={classId}
                                        onChange={(e) => { setClassId(e.target.value); setSelectedCourses([]); }}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                    >
                                        <option value="A">A 班</option>
                                        <option value="B">B 班</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">本學期課程 (紅色標籤為必修)</label>
                                <div>
                                    <h4 className="text-sm font-bold text-blue-600 mb-2">
                                        {dept} {grade} ({classId}班) 課程清單
                                    </h4>
                                    {getCourses().length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {getCourses().map(course => (
                                                <Chip
                                                    key={course.name}
                                                    label={course.name}
                                                    value={course.name}
                                                    checked={selectedCourses.includes(course.name)}
                                                    onChange={toggleCourse}
                                                    badge={course.type === 'req' ? '必' : null}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-slate-400 text-sm italic py-2">
                                            ⚠️ 此學期/班級尚未建立課程資料，請切換至「三上」查看範例。
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Experience Card */}
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                            <h2 className="text-base font-bold mb-3">🚀 經歷與特質加權</h2>

                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-2">實作與經歷</label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { v: '競賽', t: '🏆 競賽得獎' },
                                        { v: '社團', t: '👥 社團幹部' },
                                        { v: '專題', t: '💻 專題實作' },
                                        { v: '實習', t: '💼 企業實習' }
                                    ].map(item => (
                                        <Chip
                                            key={item.v}
                                            label={item.t}
                                            value={item.v}
                                            checked={selectedExp.includes(item.v)}
                                            onChange={toggleExp}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-2">專業證照</label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { v: 'A', t: '🥇 國際/高階 (A級)' },
                                        { v: 'B', t: '🥈 國內/基礎 (B級)' },
                                        { v: 'N', t: '無證照' }
                                    ].map(item => (
                                        <Chip
                                            key={item.v}
                                            label={item.t}
                                            value={item.v}
                                            checked={selectedCert.includes(item.v)}
                                            onChange={toggleCert}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-2">Holland 興趣代碼</label>
                                <div className="flex flex-wrap gap-2">
                                    {HOLLAND_CODES.map(code => (
                                        <Chip
                                            key={code}
                                            label={`${code} ${HOLLAND_TOOLTIP[code]}`}
                                            value={code}
                                            checked={selectedHolland.includes(code)}
                                            onChange={toggleHolland}
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
                                                    results.scores.academic,
                                                    results.scores.practical,
                                                    results.scores.skill,
                                                    results.scores.match,
                                                    results.scores.soft
                                                ]}
                                            />
                                        </div>
                                    </div>

                                    {/* Dept Match */}
                                    <div>
                                        <h3 className="font-bold mb-2">🎯 職涯適配分析</h3>
                                        <div className="p-3 bg-sky-50 rounded-lg border border-sky-200 text-sm mb-2">
                                            <strong>{dept} 重點特色：</strong> {results.deptInfo?.focus}<br />
                                            <strong>適性代碼：</strong> {results.deptInfo?.holland?.join('')}
                                            (你的吻合度:
                                            <span style={{ color: results.scores.match >= 80 ? 'green' : 'inherit' }}>
                                                {results.scores.match >= 80 ? '高' : '一般'}
                                            </span>
                                            )
                                        </div>
                                        <ul className="space-y-1">
                                            {results.careers.map(c => (
                                                <li key={c} className="result-item good text-sm">{c}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Strengths/Weaknesses */}
                                    <div>
                                        <h3 className="font-bold mb-2">✅ 優勢 / ❌ 待補足</h3>
                                        <ul className="space-y-1">
                                            {results.strengths.map((s, i) => (
                                                <li key={i} className="result-item good text-sm">{s}</li>
                                            ))}
                                            {results.weaknesses.map((w, i) => (
                                                <li key={i} className="result-item warn text-sm">{w}</li>
                                            ))}
                                        </ul>
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
        </>
    );
}
