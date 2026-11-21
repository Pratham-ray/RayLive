import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Sparkles, MapPin, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-slate-400 border-t border-navy-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-navy-900">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gold-500 to-amber-300 flex items-center justify-center text-navy-950 font-bold shadow-md">
                <Building2 className="w-5 h-5 text-navy-950" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">Ray<span className="text-gold-400">Live</span></span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              India's smart real-estate marketplace connecting buyers, tenants, owners, and verified brokers with automated fair-price intelligence and 24/7 AI consultancy.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-300 pt-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% RERA Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span>RayBroker AI</span>
              </div>
            </div>
          </div>

          {/* Quick Links: Buy & Rent */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Discover</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/explore?type=BUY" className="hover:text-gold-400 transition-colors">Buy Residential</Link></li>
              <li><Link to="/explore?type=RENT" className="hover:text-gold-400 transition-colors">Rent Homes & Flats</Link></li>
              <li><Link to="/explore?type=COMMERCIAL" className="hover:text-gold-400 transition-colors">Commercial Offices</Link></li>
              <li><Link to="/explore?propertyType=VILLA" className="hover:text-gold-400 transition-colors">Luxury Villas</Link></li>
              <li><Link to="/explore?propertyType=PENTHOUSE" className="hover:text-gold-400 transition-colors">Penthouses</Link></li>
            </ul>
          </div>

          {/* Top Cities */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Top Hubs</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/explore?city=Bangalore" className="hover:text-gold-400 transition-colors">Bangalore / Bengaluru</Link></li>
              <li><Link to="/explore?city=Mumbai" className="hover:text-gold-400 transition-colors">Mumbai / MMR</Link></li>
              <li><Link to="/explore?city=Gurgaon" className="hover:text-gold-400 transition-colors">Gurgaon / DLF Phase</Link></li>
              <li><Link to="/explore?city=Hyderabad" className="hover:text-gold-400 transition-colors">Hyderabad / Gachibowli</Link></li>
              <li><Link to="/explore?city=Pune" className="hover:text-gold-400 transition-colors">Pune / Koregaon Park</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Support & Office</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                <span>Indiranagar 100ft Road, Bangalore, KA 560038</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>+91 80 4900 1200</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>support@raylive.in</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 RayLive Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">RERA Compliance</span>
            <span className="hover:text-slate-400 cursor-pointer">Sitemap</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
