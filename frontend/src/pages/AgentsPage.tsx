import React, { useState, useEffect } from 'react';
import { Agent } from '../types/agent';
import { PropertyAPI } from '../services/api';
import { ShieldCheck, Star, Phone, Mail, Award, CheckCircle2, Building2 } from 'lucide-react';

export const AgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    PropertyAPI.getAgents().then(setAgents);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            RERA Verified Broker Network
          </div>
          <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
            Connect with Top Property Advisors
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Every agent on RayLive is background-verified, licensed by regional RERA authorities, and holds a proven track record of successful transactions.
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between hover:shadow-xl hover:border-gold-500/40 transition-all duration-300"
            >
              <div>
                {/* Avatar & Badges */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <img
                      src={agent.avatarUrl}
                      alt={agent.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-gold-500/30"
                    />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-navy-950">{agent.name}</h3>
                    <p className="text-xs text-slate-500">{agent.agencyName}</p>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{agent.rating}</span>
                      <span className="text-slate-400 font-normal">({agent.totalReviews})</span>
                    </div>
                  </div>
                </div>

                {/* License Tag */}
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-[11px] space-y-1 mb-4">
                  <p className="text-slate-400 font-medium">License / RERA:</p>
                  <p className="font-mono text-slate-700 font-semibold truncate">{agent.licenseNumber}</p>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-2 gap-2 text-center py-2 border-y border-slate-100 mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Listings</span>
                    <p className="text-base font-bold text-navy-950">{agent.activeListingsCount}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Deals Closed</span>
                    <p className="text-base font-bold text-navy-950">{agent.totalDeals}+</p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-600 line-clamp-3 mb-6 leading-relaxed">
                  {agent.bio}
                </p>
              </div>

              {/* Contact Actions */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                <a
                  href={`tel:${agent.phone}`}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
                <a
                  href={`mailto:${agent.email}`}
                  className="py-2.5 px-3 rounded-xl bg-navy-900 hover:bg-navy-850 text-gold-400 font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Message</span>
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
