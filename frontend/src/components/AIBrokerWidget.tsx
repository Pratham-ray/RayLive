import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Building2, 
  Calculator, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { Property } from '../types/property';
import { ChatMessage } from '../types/ai';
import { PropertyAPI } from '../services/api';
import { Link } from 'react-router-dom';

interface AIBrokerWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  targetProperty?: Property | null;
  onClearTargetProperty?: () => void;
}

export const AIBrokerWidget: React.FC<AIBrokerWidgetProps> = ({
  isOpen,
  onClose,
  targetProperty,
  onClearTargetProperty
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize greeting or property deal evaluation
  useEffect(() => {
    if (targetProperty) {
      handleEvaluateTarget(targetProperty);
    } else if (messages.length === 0) {
      // Default welcome message
      const welcomeMsg = PropertyAPI.askAIBroker('hello');
      welcomeMsg.then(res => setMessages([res]));
    }
  }, [targetProperty]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleEvaluateTarget = async (property: Property) => {
    setLoading(true);
    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Is the price fair for ${property.title}?`
    };
    setMessages(prev => [...prev, userMsg]);

    const res = await PropertyAPI.askAIBroker('fair price check', property);
    setMessages(prev => [...prev, res]);
    setLoading(false);
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await PropertyAPI.askAIBroker(textToSend, targetProperty || undefined);
      setMessages(prev => [...prev, reply]);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="bg-navy-900 text-white p-4 border-b border-navy-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gold-500 to-amber-300 flex items-center justify-center text-navy-950 font-bold shadow-md shadow-gold-500/20">
            <Sparkles className="w-5 h-5 text-navy-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base tracking-tight text-white">RayBroker AI</h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Active
              </span>
            </div>
            <p className="text-xs text-slate-400">Personal Real Estate & Price Intelligence Consultant</p>
          </div>
        </div>

        <button
          onClick={() => {
            if (onClearTargetProperty) onClearTargetProperty();
            onClose();
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Target Property Focus Banner if active */}
      {targetProperty && (
        <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2.5 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2 truncate">
            <Building2 className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span className="font-medium truncate">Evaluating: <strong>{targetProperty.title}</strong></span>
          </div>
          <button
            onClick={() => onClearTargetProperty && onClearTargetProperty()}
            className="text-[11px] font-bold text-amber-700 hover:text-amber-900 underline ml-2 whitespace-nowrap"
          >
            Clear
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1">
              {msg.sender === 'user' ? (
                <>
                  <span className="text-[10px] text-slate-400 font-medium">{msg.timestamp}</span>
                  <span className="text-[11px] font-bold text-slate-700">You</span>
                </>
              ) : (
                <>
                  <div className="w-4 h-4 rounded-full bg-gold-500 flex items-center justify-center text-[10px] text-navy-950 font-black">R</div>
                  <span className="text-[11px] font-bold text-navy-900">RayBroker</span>
                  <span className="text-[10px] text-slate-400 font-medium">{msg.timestamp}</span>
                </>
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[90%] rounded-2xl p-4 text-sm shadow-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-navy-900 text-white rounded-tr-none'
                  : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-line prose-sm">{msg.text}</div>

              {/* Financial Breakdown Card if returned */}
              {msg.financials && msg.intent === 'MORTGAGE_CALC' && (
                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="font-bold text-navy-900 flex items-center gap-1.5 border-b border-slate-200 pb-1">
                    <Calculator className="w-3.5 h-3.5 text-gold-600" />
                    Loan Parameters
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Monthly EMI:</span>
                    <strong className="text-navy-950 font-bold">₹{msg.financials.monthlyEMI?.toLocaleString('en-IN')}/mo</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Total Interest:</span>
                    <span>₹{msg.financials.totalInterestPayable?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}

              {/* Deal Evaluation Metric Card */}
              {msg.financials && msg.intent === 'DEAL_EVALUATION' && (
                <div className="mt-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1.5">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5 border-b border-amber-200/80 pb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
                    Micro-Market Benchmark
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Fair Benchmark:</span>
                    <strong className="text-navy-950 font-bold">₹{msg.financials.fairMarketValue?.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Price Variance:</span>
                    <span className={Number(msg.financials.priceVariancePercent) > 0 ? 'text-amber-700 font-bold' : 'text-emerald-700 font-bold'}>
                      {Number(msg.financials.priceVariancePercent) > 0 ? `+${msg.financials.priceVariancePercent}%` : `${msg.financials.priceVariancePercent}%`}
                    </span>
                  </div>
                </div>
              )}

              {/* Embedded Property Recommendations */}
              {msg.recommendedProperties && msg.recommendedProperties.length > 0 && (
                <div className="mt-3 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Recommended Listings:
                  </span>
                  {msg.recommendedProperties.map((p) => (
                    <Link
                      key={p.id}
                      to={`/property/${p.id}`}
                      onClick={() => onClose()}
                      className="block p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{p.title}</h4>
                          <p className="text-[11px] text-slate-500">{p.locality}, {p.city}</p>
                          <p className="text-xs font-black text-amber-700">{p.formattedPrice}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0 mr-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Follow-up suggestions */}
            {msg.suggestions && (
              <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                {msg.suggestions.map((sugg) => (
                  <button
                    key={sugg}
                    onClick={() => handleSend(sugg)}
                    className="text-[11px] font-medium bg-white hover:bg-amber-50 hover:border-amber-300 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition-colors shadow-2xs text-left"
                  >
                    💬 {sugg}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
            <div className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-600 flex items-center justify-center animate-spin">
              <Sparkles className="w-3 h-3" />
            </div>
            <span>RayBroker is analyzing real-time market data...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about properties, fair prices, or EMI..."
            className="flex-1 bg-slate-100 hover:bg-slate-50 focus:bg-white text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:border-gold-500 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-navy-900 text-gold-400 hover:bg-navy-850 disabled:opacity-50 transition-colors shadow-md flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-400 text-center mt-1.5">
          Powered by RayLive Property Intelligence Engine · Instant Fair Price Benchmarking
        </p>
      </div>

    </div>
  );
};
