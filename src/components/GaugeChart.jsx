import { useEffect, useState } from 'react';

export default function GaugeChart({ score, maxScore = 100 }) {
    const [animatedScore, setAnimatedScore] = useState(0);

    // Get color based on score
    const getColor = (s) => {
        if (s >= 80) return '#2563eb';
        if (s >= 60) return '#f59e0b';
        return '#64748b';
    };

    // Animate score on mount/change
    useEffect(() => {
        let start = 0;
        const timer = setInterval(() => {
            start++;
            setAnimatedScore(start);
            if (start >= score) {
                clearInterval(timer);
                setAnimatedScore(score);
            }
        }, 10);
        return () => clearInterval(timer);
    }, [score]);

    const strokeDasharray = `${score}, 100`;

    return (
        <div className="relative w-40 h-40 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="circular-chart w-full h-full">
                {/* Background circle */}
                <path
                    className="circle-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Animated circle */}
                <path
                    className="circle"
                    stroke={getColor(score)}
                    strokeDasharray={strokeDasharray}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-800 tracking-tighter">
                    {animatedScore}
                </span>
                <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                    Fit Score
                </span>
            </div>
        </div>
    );
}
