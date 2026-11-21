import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Sparkles, 
  PlusCircle, 
  LogOut,
  Menu, 
  X,
  Compass,
  LogIn,
  Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

interface NavbarProps {
  onOpenAIBroker: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAIBroker }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { favoriteCount } = useFavorites();

  const handleProtectedNavigation = (targetPath: string) => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(targetPath)}`);
    } else {
      navigate(targetPath);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-navy-900/95 backdrop-blur-md border-b border-navy-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo (Always takes back to Home) */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-gold-600 to-gold-400 flex items-center justify-center text-navy-950 font-bold shadow-lg shadow-gold-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-navy-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold tracking-tight text-white">Ray<span className="text-gold-400">Live</span></span>
                <span className="text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-400 border border-gold-500/30">PropTech</span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wide">Find. Value. Transact.</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleProtectedNavigation('/explore?type=BUY')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                location.search.includes('BUY') ? 'bg-navy-800 text-gold-400' : 'text-slate-300 hover:text-white hover:bg-navy-800/60'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => handleProtectedNavigation('/explore?type=RENT')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                location.search.includes('RENT') ? 'bg-navy-800 text-gold-400' : 'text-slate-300 hover:text-white hover:bg-navy-800/60'
              }`}
            >
              Rent
            </button>
            <button
              onClick={() => handleProtectedNavigation('/explore?type=COMMERCIAL')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                location.search.includes('COMMERCIAL') ? 'bg-navy-800 text-gold-400' : 'text-slate-300 hover:text-white hover:bg-navy-800/60'
              }`}
            >
              Commercial
            </button>
            <button
              onClick={() => handleProtectedNavigation('/explore')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                location.pathname === '/explore' && !location.search ? 'bg-navy-800 text-gold-400' : 'text-slate-300 hover:text-white hover:bg-navy-800/60'
              }`}
            >
              <Compass className="w-4 h-4 text-slate-400" />
              Explore All
            </button>
            <button
              onClick={() => handleProtectedNavigation('/agents')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                location.pathname === '/agents' ? 'bg-navy-800 text-gold-400' : 'text-slate-300 hover:text-white hover:bg-navy-800/60'
              }`}
            >
              Verified Agents
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            
            {/* Saved / Favorites Button with Counter Badge */}
            <button
              onClick={() => handleProtectedNavigation('/favorites')}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                location.pathname === '/favorites' 
                  ? 'bg-navy-800 text-rose-400' 
                  : 'text-slate-300 hover:text-white hover:bg-navy-800/60'
              }`}
              title="Saved Properties"
            >
              <Heart className={`w-4 h-4 ${favoriteCount > 0 ? 'text-rose-400 fill-rose-400' : 'text-slate-400'}`} />
              <span className="hidden lg:inline text-xs font-semibold">Saved</span>
              {favoriteCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white leading-tight shadow-sm">
                  {favoriteCount}
                </span>
              )}
            </button>

            {/* AI Broker Button */}
            <button
              onClick={onOpenAIBroker}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-amber-500/15 via-gold-500/20 to-amber-500/15 border border-gold-500/40 text-gold-300 hover:text-gold-200 hover:border-gold-400 shadow-sm transition-all group cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-gold-400 group-hover:rotate-12 transition-transform" />
              <span>RayBroker AI</span>
              <span className="text-[10px] bg-gold-400 text-navy-950 font-bold px-1.5 py-0.2 rounded-full">24/7</span>
            </button>

            {/* List Property CTA */}
            <button
              onClick={() => handleProtectedNavigation('/sell')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-white text-navy-950 hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-navy-900" />
              <span>List Property</span>
            </button>

            {/* Authentication Button: Login / Signup in top right corner */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-navy-800 hover:bg-navy-750 border border-navy-700 transition-colors text-left cursor-pointer"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover bg-navy-950 border border-gold-500/30"
                  />
                  <div className="pr-1 text-xs leading-tight hidden lg:block">
                    <p className="font-bold text-white truncate max-w-[100px]">{user.name}</p>
                    <span className="text-[10px] text-gold-400 uppercase font-semibold">{user.role}</span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-navy-950 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate('/favorites');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span>Saved Homes</span>
                      </div>
                      {favoriteCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                          {favoriteCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate('/bookings');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                    >
                      <Compass className="w-4 h-4 text-gold-600" />
                      <span>My Scheduled Tours</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 text-navy-950 font-bold text-sm shadow-md shadow-gold-500/20 transition-all transform active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Login / Signup</span>
              </Link>
            )}

          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleProtectedNavigation('/favorites')}
              className="p-2 rounded-lg bg-navy-800 text-slate-300 hover:text-white relative"
              title="Saved Properties"
            >
              <Heart className={`w-4 h-4 ${favoriteCount > 0 ? 'text-rose-400 fill-rose-400' : ''}`} />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </button>

            {!isAuthenticated ? (
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg bg-gold-500 text-navy-950 font-bold text-xs flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
            ) : (
              <button
                onClick={logout}
                className="p-2 rounded-lg bg-navy-800 text-slate-300 hover:text-white"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-navy-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-950 border-b border-navy-800 px-4 pt-2 pb-6 space-y-2">
          <button 
            onClick={() => { setMobileMenuOpen(false); handleProtectedNavigation('/favorites'); }}
            className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-navy-800"
          >
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Saved Properties</span>
            </div>
            {favoriteCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white">
                {favoriteCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => { setMobileMenuOpen(false); handleProtectedNavigation('/explore?type=BUY'); }}
            className="w-full text-left block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-navy-800"
          >
            Buy Properties
          </button>
          <button 
            onClick={() => { setMobileMenuOpen(false); handleProtectedNavigation('/explore?type=RENT'); }}
            className="w-full text-left block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-navy-800"
          >
            Rent Properties
          </button>
          <button 
            onClick={() => { setMobileMenuOpen(false); handleProtectedNavigation('/explore?type=COMMERCIAL'); }}
            className="w-full text-left block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-navy-800"
          >
            Commercial Properties
          </button>
          <button 
            onClick={() => { setMobileMenuOpen(false); handleProtectedNavigation('/explore'); }}
            className="w-full text-left block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-navy-800"
          >
            Explore All Listings
          </button>
          <button 
            onClick={() => { setMobileMenuOpen(false); handleProtectedNavigation('/agents'); }}
            className="w-full text-left block px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:bg-navy-800"
          >
            Verified Agents
          </button>
          <div className="pt-2">
            <button
              onClick={() => { setMobileMenuOpen(false); handleProtectedNavigation('/sell'); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold bg-gold-500 text-navy-950 hover:bg-gold-400"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Your Property</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
