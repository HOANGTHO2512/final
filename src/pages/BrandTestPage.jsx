import { useState } from 'react';
import { Link } from 'react-router-dom';
import GaugeChart from '../components/GaugeChart';
import RadarChart from '../components/RadarChart';
import { useAuth } from '../context/AuthContext';
import { DATA, QUESTIONS } from '../data/quizData';

export default function BrandTestPage() {
    const { syncQuizData } = useAuth();
    const [view, setView] = useState('landing'); // landing, quiz, result
    const [answers, setAnswers] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [results, setResults] = useState(null);
    const pageSize = 5;

    // Start Quiz
    const startQuiz = () => {
        setAnswers({});
        setCurrentPage(0);
        setView('quiz');
    };

    // Load Demo
    const loadDemo = () => {
        const demoAnswers = {};
        QUESTIONS.forEach((q, i) => {
            demoAnswers[i] = Math.floor(Math.random() * 3) + 3;
        });
        setAnswers(demoAnswers);
        calculateResults(demoAnswers);
    };

    // Answer question
    const answer = (idx, val) => {
        setAnswers(prev => ({ ...prev, [idx]: val }));
    };

    // Navigate pages
    const goNextPage = () => {
        const start = currentPage * pageSize;
        const end = Math.min(start + pageSize, QUESTIONS.length);

        // Check if all questions on current page are answered
        for (let i = start; i < end; i++) {
            if (!answers[i]) {
                alert(`請完成第 ${i + 1} 題`);
                return;
            }
        }

        if (end >= QUESTIONS.length) {
            calculateResults(answers);
        } else {
            setCurrentPage(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const goPrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    // Calculate Results
    const calculateResults = (ans) => {
        let sScores = {}, hScores = {};
        QUESTIONS.forEach((q, i) => {
            const val = ans[i] || 3;
            if (q.cat === 's') {
                sScores[q.m] = (sScores[q.m] || 0) + val;
            } else {
                hScores[q.m] = (hScores[q.m] || 0) + val;
            }
        });

        // Find best department match
        let bestDept = '', maxFit = 0;
        for (let d in DATA.weights) {
            let wSum = 0, maxWSum = 0;
            for (let k in DATA.weights[d].holland) {
                const w = DATA.weights[d].holland[k];
                if (w > 0) {
                    wSum += (hScores[k] || 0) * w;
                    maxWSum += (QUESTIONS.filter(q => q.cat === 'h' && q.m === k).length * 5) * w;
                }
            }
            for (let k in DATA.weights[d].strengths) {
                const w = DATA.weights[d].strengths[k];
                if (w > 0) {
                    wSum += (sScores[k] || 0) * w;
                    maxWSum += (QUESTIONS.filter(q => q.cat === 's' && q.m === k).length * 5) * w;
                }
            }
            const fit = maxWSum > 0 ? Math.round((wSum / maxWSum) * 100) : 0;
            if (fit > maxFit) {
                maxFit = fit;
                bestDept = d;
            }
        }

        // Calculate radar data
        const radarData = DATA.radarMap.map(dim => {
            let sum = 0, count = 0;
            dim.keys.forEach(k => {
                sum += (k.length > 1 ? (sScores[k] || 0) : (hScores[k] || 0));
                count += QUESTIONS.filter(q => q.m === k).length;
            });
            return count > 0 ? Math.round((sum / (count * 5)) * 100) : 0;
        });

        // Get Holland code
        const maxHScores = QUESTIONS.filter(q => q.cat === 'h').reduce((acc, curr) => {
            acc[curr.m] = (acc[curr.m] || 0) + 5;
            return acc;
        }, {});
        const topH = Object.entries(hScores).sort((a, b) => b[1] - a[1]);
        const hCode = topH.slice(0, 3).map(x => x[0]).join('');

        // Get top strengths
        const topS = Object.entries(sScores).sort((a, b) => b[1] - a[1]).slice(0, 5);

        // Sync Holland code for other modules
        syncQuizData(hCode);

        // Generate resume draft
        const sNames = topS.map(s => DATA.strengthsInfo[s[0]]).join('、');
        const topRadar = DATA.radarMap[radarData.indexOf(Math.max(...radarData))].name;
        const resumeDraft = `【自我介紹草稿】

我是〇〇〇，一位熱愛${bestDept}領域的探索者。經由專業測評分析，我的核心優勢在於「${sNames}」，這讓我在面對${bestDept}的挑戰時，能夠發揮${DATA.strengthsInfo[topS[0][0]]}特質，${bestDept.includes('資工') ? '有效解決技術難題' : '有效整合資源與溝通'}。

我的 Holland 職業興趣代碼為 ${hCode}，這代表我具備${DATA.hollandInfo[hCode[0]].n}的傾向。在專業能力上，我的「${topRadar}」尤為突出，這將有助於我在團隊中擔任關鍵角色。

未來，我希望能將這些特質轉化為具體的專案成果，為團隊創造價值。`;

        const aiPrompt = `你是一位專業職涯顧問。請根據以下數據為我優化履歷：
1. 目標：${bestDept}
2. 特質：${hCode} (${sNames})
3. 優勢：${topRadar}能力極強
請幫我寫一段約 200 字、語氣自信的申請動機，並提供 3 個量化成果範例。`;

        setResults({
            bestDept,
            maxFit,
            radarData,
            hCode,
            topH,
            topS,
            maxHScores,
            hScores,
            resumeDraft,
            aiPrompt
        });
        setView('result');
        window.scrollTo(0, 0);
    };

    // Copy text to clipboard
    const copyText = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('已複製內容！');
        });
    };

    // Render current quiz page
    const renderQuiz = () => {
        const start = currentPage * pageSize;
        const end = Math.min(start + pageSize, QUESTIONS.length);
        const pageQs = QUESTIONS.slice(start, end);
        const answeredCount = Object.keys(answers).length;
        const progress = Math.min(100, Math.round((answeredCount / QUESTIONS.length) * 100));

        return (
            <div className="min-h-screen bg-white">
                {/* Progress Bar */}
                <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
                    <div className="max-w-3xl mx-auto px-4 py-3">
                        <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                            <span>PROGRESS</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Questions */}
                <div className="max-w-3xl mx-auto px-4 py-8 pb-24">
                    {pageQs.map((q, i) => {
                        const idx = start + i;
                        const val = answers[idx] || 0;
                        return (
                            <div
                                key={idx}
                                className="mb-8 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm animate-fade-in-up"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <h3 className="font-bold text-lg text-slate-800 mb-4">
                                    {idx + 1}. {q.t}
                                </h3>
                                <div className="flex justify-between gap-2">
                                    {[1, 2, 3, 4, 5].map(v => (
                                        <label key={v} className="flex-1 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name={`q${idx}`}
                                                value={v}
                                                checked={val === v}
                                                onChange={() => answer(idx, v)}
                                                className="hidden"
                                            />
                                            <div className={`h-12 rounded-lg flex items-center justify-center font-bold transition-all 
                        ${val === v
                                                    ? 'bg-blue-600 text-white border-blue-600 scale-105 shadow-lg shadow-blue-500/20'
                                                    : 'bg-slate-50 border border-slate-200 text-slate-400 group-hover:border-blue-300'
                                                }`}
                                            >
                                                {v}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
                                    <span>不符合 (1)</span>
                                    <span>非常符合 (5)</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Navigation */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg">
                    <div className="max-w-3xl mx-auto flex justify-between gap-4">
                        <button
                            onClick={goPrevPage}
                            disabled={currentPage === 0}
                            className="px-6 py-2 border-2 border-slate-200 text-slate-500 rounded-full font-bold hover:bg-slate-50 transition disabled:opacity-50"
                        >
                            上一頁
                        </button>
                        <button
                            onClick={goNextPage}
                            className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition shadow-md"
                        >
                            {end >= QUESTIONS.length ? '查看報告' : '下一頁'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Render results
    const renderResults = () => {
        if (!results) return null;

        const { bestDept, maxFit, radarData, hCode, topH, topS, maxHScores, hScores, resumeDraft, aiPrompt } = results;
        const topHCode = hCode[0];
        const platformInfo = DATA.platforms[topHCode];
        const topStrengthKey = topS[0][0];
        const actionInfo = DATA.actionCards[topStrengthKey];

        return (
            <div className="min-h-screen bg-[#f8fafc] py-8 px-4">
                {/* Action Buttons */}
                <div className="max-w-5xl mx-auto mb-6 flex justify-end gap-3 no-print">
                    <button
                        onClick={() => window.print()}
                        className="bg-slate-800 text-white px-5 py-2 rounded-lg font-bold shadow hover:bg-slate-700 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        下載完整報告
                    </button>
                </div>

                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Header Card */}
                    <div className="lg:col-span-12 glass-panel rounded-3xl p-8 text-center relative overflow-hidden animate-fade-in-up">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                        <h2 className="text-xl font-bold text-slate-800 mb-1">My Brand Canvas 品牌定位報告</h2>
                        <span className="text-xs font-mono text-slate-400">{new Date().toLocaleDateString('zh-TW')}</span>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-10 mt-6">
                            <GaugeChart score={maxFit} />
                            <div className="text-left">
                                <div className="mb-4">
                                    <div className="text-sm font-bold text-slate-400 uppercase tracking-wide">Best Fit Career</div>
                                    <div className="text-3xl md:text-4xl font-black text-blue-700 mt-1">{bestDept}</div>
                                </div>
                                <div className="text-sm text-slate-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 inline-block">
                                    與您的特質契合度高達 <span className="font-bold text-blue-700">{maxFit}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Left Column */}
                    <div className="lg:col-span-5 space-y-6 animate-fade-in-up delay-100">
                        {/* Radar */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                <span className="w-2 h-6 bg-blue-500 rounded-full"></span>六維能力雷達
                            </h3>
                            <RadarChart
                                labels={DATA.radarMap.map(d => d.name)}
                                data={radarData}
                            />
                        </div>

                        {/* Holland */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                <span className="w-2 h-6 bg-orange-500 rounded-full"></span>Holland 興趣光譜
                            </h3>
                            <div className="flex items-baseline gap-3 mb-4">
                                <span className="text-4xl font-black text-slate-800 tracking-widest">{hCode}</span>
                            </div>
                            <div className="space-y-3">
                                {topH.map(h => {
                                    const info = DATA.hollandInfo[h[0]];
                                    const max = maxHScores[h[0]] || 10;
                                    const pct = (h[1] / max) * 100;
                                    return (
                                        <div key={h[0]} className="flex items-center text-sm">
                                            <span className="w-8 font-bold" style={{ color: info.c }}>{h[0]}</span>
                                            <div className="flex-1 h-2 bg-slate-100 rounded-full mx-2 overflow-hidden">
                                                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: info.c }}></div>
                                            </div>
                                            <span className="w-6 text-right text-slate-400">{h[1]}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Platform */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                <span className="w-2 h-6 bg-pink-500 rounded-full"></span>社群經營策略
                            </h3>
                            <div className="p-4 bg-pink-50 rounded-xl border border-pink-100">
                                <h4 className="font-bold text-pink-800 mb-1">{platformInfo.name}</h4>
                                <p className="text-xs text-pink-600">{platformInfo.desc}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-7 space-y-6 animate-fade-in-up delay-200">
                        {/* Radar Details */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                <span className="w-2 h-6 bg-teal-500 rounded-full"></span>能力維度量化分析
                            </h3>
                            <div className="space-y-4">
                                {radarData.map((score, i) => {
                                    const dim = DATA.radarMap[i];
                                    const meaning = score < 50
                                        ? DATA.radarBenchmarks[dim.name].low
                                        : (score < 75 ? DATA.radarBenchmarks[dim.name].mid : DATA.radarBenchmarks[dim.name].high);
                                    const color = score >= 75 ? 'text-green-600' : (score >= 50 ? 'text-blue-600' : 'text-slate-500');
                                    return (
                                        <div key={i} className="flex items-start justify-between border-b border-slate-50 pb-2 last:border-0">
                                            <div className="w-1/3">
                                                <span className="block font-bold text-slate-700 text-sm">{dim.name}</span>
                                                <span className={`text-2xl font-black ${color}`}>{score}</span>
                                                <span className="text-xs text-slate-400">/100</span>
                                            </div>
                                            <div className="w-2/3 pl-4 border-l border-slate-100">
                                                <p className="text-xs text-slate-500 leading-relaxed">{meaning}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Strengths */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                <span className="w-2 h-6 bg-purple-500 rounded-full"></span>Top 5 天賦優勢
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {topS.map((s, i) => (
                                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                                        <span className="font-bold text-slate-700">#{i + 1} {DATA.strengthsInfo[s[0]]}</span>
                                        <span className="text-xs bg-white px-2 py-1 rounded text-slate-400 font-mono">{s[0]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                <span className="w-2 h-6 bg-yellow-500 rounded-full"></span>品牌行動卡片 (Action Card)
                            </h3>
                            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-sm text-slate-700 space-y-2">
                                <p><strong>📚 推薦書籍：</strong>{actionInfo.book}</p>
                                <p><strong>🛠️ 必修技能：</strong>{actionInfo.skill}</p>
                            </div>
                        </div>

                        {/* Resume Generator */}
                        <div className="bg-slate-900 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden no-print">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-[60px] opacity-20"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-xl">🚀 履歷生成器</h3>
                                </div>

                                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 max-h-60 overflow-y-auto mb-4">
                                    <pre className="whitespace-pre-wrap font-sans text-sm text-slate-300 leading-relaxed">
                                        {resumeDraft}
                                    </pre>
                                </div>
                                <button
                                    onClick={() => copyText(resumeDraft)}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition"
                                >
                                    📋 複製履歷草稿
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Restart */}
                <div className="text-center pt-8 pb-12 no-print">
                    <button
                        onClick={() => { setView('landing'); setAnswers({}); setResults(null); }}
                        className="text-sm text-slate-400 hover:text-slate-600 underline"
                    >
                        重新開始測驗
                    </button>
                </div>
            </div>
        );
    };

    // Landing View
    if (view === 'landing') {
        return (
            <div className="flex-grow flex flex-col relative hero-bg min-h-screen">
                <nav className="w-full px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
                    <Link to="/" className="text-2xl font-black tracking-tighter text-blue-700 flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>CareerDNA
                    </Link>
                    <button
                        onClick={loadDemo}
                        className="text-sm text-gray-400 hover:text-blue-600 transition font-medium"
                    >
                        Demo Mode
                    </button>
                </nav>

                <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-12">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-xs font-bold tracking-wider mb-2 animate-fade-in-up">
                            PERSONAL BRANDING SYSTEM
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight animate-fade-in-up delay-100">
                            探索你的<br /><span className="gradient-text">職涯基因序列</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto animate-fade-in-up delay-200">
                            結合 Holland 興趣與 Gallup 優勢。<br />
                            一鍵生成：科系定位、履歷草稿、經營策略。
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 animate-fade-in-up delay-300">
                            <button
                                onClick={startQuiz}
                                className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                            >
                                開始免費測評
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (view === 'quiz') return renderQuiz();
    if (view === 'result') return renderResults();

    return null;
}
