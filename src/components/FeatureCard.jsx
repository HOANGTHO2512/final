import { Link } from 'react-router-dom';

export default function FeatureCard({
    href,
    icon,
    title,
    description,
    features = [],
    linkText = '立即開始',
    color = 'blue',
    disabled = false,
    comingSoon = false,
    delay = 0
}) {
    const colorClasses = {
        blue: {
            bg: 'bg-blue-50',
            icon: 'bg-blue-600 shadow-blue-500/30',
            bullet: 'bg-blue-400',
            text: 'text-blue-600',
            hover: 'group-hover:text-blue-600'
        },
        teal: {
            bg: 'bg-teal-50',
            icon: 'bg-teal-500 shadow-teal-500/30',
            bullet: 'bg-teal-400',
            text: 'text-teal-600',
            hover: 'group-hover:text-teal-600'
        },
        purple: {
            bg: 'bg-purple-50',
            icon: 'bg-purple-600 shadow-purple-500/30',
            bullet: 'bg-purple-400',
            text: 'text-purple-600',
            hover: 'group-hover:text-purple-600'
        }
    };

    const colors = colorClasses[color] || colorClasses.blue;

    const cardContent = (
        <>
            {/* Background decoration */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${colors.bg} rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`}></div>

            {/* Coming soon overlay */}
            {comingSoon && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        即將推出
                    </span>
                </div>
            )}

            {/* Icon */}
            <div className={`w-12 h-12 ${colors.icon} rounded-xl flex items-center justify-center text-white mb-6 relative z-10 shadow-lg`}>
                {icon}
            </div>

            {/* Title */}
            <h3 className={`text-xl font-bold text-slate-900 mb-3 transition-colors ${colors.hover}`}>
                {title}
            </h3>

            {/* Description */}
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                {description}
            </p>

            {/* Features list */}
            {features.length > 0 && (
                <ul className="space-y-2 mb-6">
                    {features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-xs text-slate-500">
                            <span className={`w-1.5 h-1.5 ${colors.bullet} rounded-full mr-2`}></span>
                            {feature}
                        </li>
                    ))}
                </ul>
            )}

            {/* Link */}
            <span className={`inline-flex items-center ${colors.text} font-bold text-sm group-hover:translate-x-1 transition-transform`}>
                {comingSoon ? '敬請期待' : linkText}
                {!comingSoon && (
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                )}
            </span>
        </>
    );

    const baseClasses = `feature-card block p-8 rounded-3xl group relative overflow-hidden animate-fade-in-up ${disabled ? 'opacity-75 grayscale hover:grayscale-0 cursor-not-allowed' : ''}`;

    if (disabled || comingSoon) {
        return (
            <div className={baseClasses} style={{ animationDelay: `${delay}s` }}>
                {cardContent}
            </div>
        );
    }

    return (
        <Link to={href} className={baseClasses} style={{ animationDelay: `${delay}s` }}>
            {cardContent}
        </Link>
    );
}
