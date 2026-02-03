'use client';

import Link from 'next/link';
import React from 'react';

interface FeatureCardProps {
  href: string;
  color?: 'blue' | 'teal' | 'purple' | 'green';
  delay?: number;
  disabled?: boolean;
  comingSoon?: boolean;
  icon?: React.ReactNode;
  title: string;
  description: string;
  features?: string[];
  linkText?: string;
}

const colorVariants = {
  blue: {
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    button: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    highlight: 'text-blue-600 dark:text-blue-400',
  },
  teal: {
    bg: 'bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20',
    border: 'border-teal-200 dark:border-teal-800',
    icon: 'text-teal-600 dark:text-teal-400',
    button: 'bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600',
    badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
    highlight: 'text-teal-600 dark:text-teal-400',
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
    border: 'border-purple-200 dark:border-purple-800',
    icon: 'text-purple-600 dark:text-purple-400',
    button: 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    highlight: 'text-purple-600 dark:text-purple-400',
  },
  green: {
    bg: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
    border: 'border-green-200 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400',
    button: 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    highlight: 'text-green-600 dark:text-green-400',
  },
};

export default function FeatureCard({
  href,
  color = 'blue',
  delay = 0,
  disabled = false,
  comingSoon = false,
  icon,
  title,
  description,
  features = [],
  linkText = 'Learn More',
}: FeatureCardProps) {
  const variant = colorVariants[color];

  const content = (
    <div
      className={`relative h-full p-8 rounded-2xl border transition-all duration-300 ${variant.bg} ${variant.border} ${!disabled ? 'hover:shadow-2xl hover:-translate-y-2 backdrop-blur-sm' : 'opacity-60'}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {comingSoon && (
        <div className="absolute top-4 right-4">
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${variant.badge}`}>
            Coming Soon
          </span>
        </div>
      )}

      {/* Icon */}
      <div className={`mb-6 inline-flex p-3 rounded-lg ${variant.bg}`}>
        <div className={`text-3xl ${variant.icon}`}>{icon}</div>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
        {description}
      </p>

      {/* Features List */}
      {features.length > 0 && (
        <ul className="space-y-3 mb-8">
          {features.map((feature, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 text-slate-600 dark:text-slate-400 text-sm"
            >
              <svg
                className="w-5 h-5 text-slate-400 dark:text-slate-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      )}

      {/* CTA Text (not a button to avoid interfering with Link) */}
      {!disabled && !comingSoon && (
        <div
          className={`inline-flex items-center ${variant.highlight} font-bold text-sm`}
        >
          {linkText} →
        </div>
      )}
    </div>
  );

  if (disabled || comingSoon) {
    return <div className="animate-fade-in-up">{content}</div>;
  }

  return (
    <Link href={href} className="animate-fade-in-up block no-underline">
      {content}
    </Link>
  );
}
