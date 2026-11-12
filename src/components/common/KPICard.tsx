import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: number; // percentage
  trendLabel?: string;
  isCurrency?: boolean;
  prefix?: string;
  suffix?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel = 'vs last period',
  prefix = '',
  suffix = '',
}) => {
  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;
  const isNeutral = trend !== undefined && trend === 0;

  return (
    <div className="bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 transition-all duration-200">
      <div className="flex items-center justify-between gap-4 mb-3">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-cyan-400">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono tabular-nums">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-300 pt-1 border-t border-slate-800/60">
        {trend !== undefined ? (
          <div className="flex items-center gap-1.5 font-mono tabular-nums">
            {isPositive && (
              <span className="text-emerald-400 font-medium flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                +{trend}%
              </span>
            )}
            {isNegative && (
              <span className="text-rose-400 font-medium flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" />
                {trend}%
              </span>
            )}
            {isNeutral && (
              <span className="text-slate-400 font-medium flex items-center gap-0.5">
                <Minus className="w-3.5 h-3.5" />
                0.0%
              </span>
            )}
            <span className="text-slate-300 font-sans">{trendLabel}</span>
          </div>
        ) : (
          <span className="text-slate-300">{subtitle || 'Historical performance'}</span>
        )}
      </div>
    </div>
  );
};
