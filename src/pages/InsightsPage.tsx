import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  Award,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  Send,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api';
import { useSales } from '../contexts/SalesContext';
import { BusinessInsights } from '../types';

export const InsightsPage: React.FC = () => {
  const { dataVersion } = useSales();
  const [insights, setInsights] = useState<BusinessInsights | null>(null);
  const [aiReport, setAiReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<
    { sender: 'user' | 'assistant'; text: string }[]
  >([
    {
      sender: 'assistant',
      text: 'Hello! I am your SalesPredict AI Data Analyst. Ask me any analytical question about your uploaded revenue, regional performance, margins, or predictive trends.',
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    loadInsights();
  }, [dataVersion]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const res = await api.getInsights();
      setInsights(res);
      // Auto-fetch Gemini recommendations
      fetchAIRecommendations();
    } catch (err) {
      console.error('Failed to load insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIRecommendations = async () => {
    try {
      setAiLoading(true);
      const res = await api.getAIRecommendations();
      setAiReport(res);
    } catch (err) {
      console.error('Failed to load AI recommendations:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || chatLoading) return;

    const userQ = question.trim();
    setChatHistory((prev) => [...prev, { sender: 'user', text: userQ }]);
    setQuestion('');
    setChatLoading(true);

    try {
      const res = await api.askQuestion(userQ);
      setChatHistory((prev) => [...prev, { sender: 'assistant', text: res.answer }]);
    } catch (err: any) {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: `Analysis error: ${err.message || 'Could not query dataset'}.`,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              AI Strategic Insights &amp; Advisory
            </h1>
            <span className="text-xs text-purple-400 font-mono">
              Powered by Gemini 3.8 Flash
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Grounded intelligence engine: combines rule-based statistical guarantees with natural-language executive briefings
          </p>
        </div>

        <button
          onClick={fetchAIRecommendations}
          disabled={aiLoading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm shadow-purple-500/20"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${aiLoading ? 'animate-spin' : ''}`} />
          <span>Regenerate Strategic Briefing</span>
        </button>
      </div>

      {/* 6 Rule-Based Grounded Insights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Best Product */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Highest Revenue Driver</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-base font-bold text-white truncate">
            {insights?.topRevenueProduct?.name || 'Loading...'}
          </div>
          <div className="text-xs text-slate-400 font-mono tabular-nums">
            Total Revenue: <span className="text-cyan-400 font-bold">${insights?.topRevenueProduct?.revenue.toLocaleString()}</span>
          </div>
        </div>

        {/* Highest Margin Category */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Most Profitable Category</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base font-bold text-white truncate">
            {insights?.topProfitCategory?.name || 'Loading...'}
          </div>
          <div className="text-xs text-slate-400 font-mono tabular-nums">
            Margin: <span className="text-emerald-400 font-bold">{insights?.topProfitCategory?.margin}%</span> (${insights?.topProfitCategory?.profit.toLocaleString()} profit)
          </div>
        </div>

        {/* Best Region */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Top Performing Region</span>
            <Award className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-base font-bold text-white truncate">
            {insights?.bestRegion?.name || 'Loading...'}
          </div>
          <div className="text-xs text-slate-400 font-mono tabular-nums">
            Revenue: <span className="text-blue-400 font-bold">${insights?.bestRegion?.revenue.toLocaleString()}</span>
          </div>
        </div>

        {/* Peak Month */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Historical Peak Month</span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-base font-bold text-white font-mono">
            {insights?.peakSalesMonth?.month || 'Loading...'}
          </div>
          <div className="text-xs text-slate-400 font-mono tabular-nums">
            Peak Volume: <span className="text-purple-400 font-bold">${insights?.peakSalesMonth?.revenue.toLocaleString()}</span>
          </div>
        </div>

        {/* Growth Velocity */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Sales Trend Velocity</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base font-bold text-white font-mono">
            {insights?.salesTrend || 'Stable'}
          </div>
          <div className="text-xs text-slate-400">
            Based on MoM autoregressive acceleration
          </div>
        </div>

        {/* Inventory Attention Item */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Requires Strategy Attention</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-base font-bold text-white truncate">
            {insights?.lowPerformingProduct?.name || 'None identified'}
          </div>
          <div className="text-xs text-amber-400/90">
            Low turnover catalog item
          </div>
        </div>
      </div>

      {/* Row 2: Gemini Strategic Briefing Card */}
      <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-900/80 to-purple-950/20 border border-slate-800 rounded-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Executive Strategy Briefing
              </h3>
              <p className="text-xs text-slate-400">
                Synthesized by Gemini 3.8 Flash from verified SQLite database aggregates
              </p>
            </div>
          </div>
          <div className="text-[11px] font-mono text-purple-300">
            Grounded Context Guardrails Active
          </div>
        </div>

        {aiLoading ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-purple-400" />
            <span>Analyzing statistical indicators and composing strategic advice...</span>
          </div>
        ) : aiReport ? (
          <div className="space-y-5">
            {/* Executive Summary */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
              <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider font-mono">
                Executive Summary
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                {aiReport.data?.executiveSummary || aiReport.summary || 'Strong sales momentum.'}
              </p>
            </div>

            {/* Strategic Recommendations */}
            <div className="space-y-3">
              <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider font-mono">
                High-Impact Strategic Recommendations
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(
                  aiReport.data?.strategicRecommendations ||
                  aiReport.recommendations || [
                    'Scale top performing lines.',
                    'Optimize catalog pricing.',
                  ]
                ).map((rec: string, i: number) => (
                  <div
                    key={i}
                    className="p-3.5 bg-slate-950/40 border border-slate-800/80 rounded-xl flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-300 leading-relaxed">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Factors & Growth Catalysts if returned */}
            {aiReport.data?.riskFactors && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-950/40 border border-rose-950/40 rounded-xl space-y-2">
                  <div className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Risk Factors &amp; Concentration</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    {aiReport.data.riskFactors.map((rf: string, idx: number) => (
                      <li key={idx}>{rf}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-slate-950/40 border border-emerald-950/40 rounded-xl space-y-2">
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Quarterly Growth Catalysts</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    {aiReport.data.growthCatalysts?.map((gc: string, idx: number) => (
                      <li key={idx}>{gc}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Row 3: Interactive Ask-Your-Data Chat Box */}
      <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">Ask Your Data (Conversational AI)</h3>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl h-64 overflow-y-auto space-y-3">
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="flex justify-start">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center gap-2">
                <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
                <span>Computing query against sales database...</span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleAsk} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Which region is generating the highest profits, and what is its growth trend?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={chatLoading || !question.trim()}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
