import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AIBrokerWidget } from './components/AIBrokerWidget';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { BookingsPage } from './pages/BookingsPage';
import { AgentInboxPage } from './pages/AgentInboxPage';
import { SellPropertyPage } from './pages/SellPropertyPage';
import { AgentsPage } from './pages/AgentsPage';
import { LoginPage } from './pages/LoginPage';
import { Property } from './types/property';
import { Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [aiBrokerOpen, setAiBrokerOpen] = useState(false);
  const [targetProperty, setTargetProperty] = useState<Property | null>(null);

  const handleOpenAIBroker = (property?: Property) => {
    if (property) {
      setTargetProperty(property);
    }
    setAiBrokerOpen(true);
  };

  const handleCloseAIBroker = () => {
    setAiBrokerOpen(false);
  };

  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-slate-50 font-sans antialiased text-slate-900 selection:bg-amber-100 selection:text-amber-900">
            
            {/* Navigation Bar */}
            <Navbar onOpenAIBroker={() => handleOpenAIBroker()} />

            {/* Main Content Pages */}
            <main className="flex-1">
              <Routes>
                {/* Home page is the main landing page */}
                <Route path="/" element={<HomePage onOpenAIBroker={handleOpenAIBroker} />} />
                
                {/* Login / Sign Up Page */}
                <Route path="/login" element={<LoginPage />} />
                
                {/* Saved / Favorites Page */}
                <Route path="/favorites" element={<FavoritesPage onOpenAIBroker={handleOpenAIBroker} />} />

                {/* Tour Bookings & Visits */}
                <Route path="/bookings" element={<BookingsPage onOpenAIBroker={handleOpenAIBroker} />} />

                {/* Agent & Owner Lead Inbox */}
                <Route path="/agent-inbox" element={<AgentInboxPage onOpenAIBroker={handleOpenAIBroker} />} />

                {/* Explore & Property Discovery */}
                <Route path="/explore" element={<ExplorePage onOpenAIBroker={handleOpenAIBroker} />} />
                <Route path="/property/:id" element={<PropertyDetailPage onOpenAIBroker={handleOpenAIBroker} />} />
                <Route path="/sell" element={<SellPropertyPage />} />
                <Route path="/agents" element={<AgentsPage />} />
              </Routes>
            </main>

            {/* Footer */}
            <Footer />

            {/* Floating AI Broker Trigger Button (Bottom Right) */}
            {!aiBrokerOpen && (
              <button
                onClick={() => handleOpenAIBroker()}
                className="fixed bottom-6 right-6 z-40 px-3.5 py-2 rounded-full bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-gold-400 border border-gold-400/70 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer ai-glow ai-shine"
                aria-label="Open RayBroker AI Assistant"
              >
                <div className="relative">
                  <Sparkles className="w-4 h-4 text-gold-400 group-hover:rotate-12 transition-transform" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[11px] font-black tracking-tight text-white leading-none">RayBroker AI</p>
                  <p className="text-[9px] text-gold-400 font-semibold leading-tight">Price & Deal Advisor</p>
                </div>
              </button>
            )}

            {/* AI Broker Slide-out Widget */}
            <AIBrokerWidget
              isOpen={aiBrokerOpen}
              onClose={handleCloseAIBroker}
              targetProperty={targetProperty}
              onClearTargetProperty={() => setTargetProperty(null)}
            />

          </div>
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  );
};

export default App;
