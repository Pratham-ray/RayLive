import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: number[];
  isFavorite: (propertyId: number) => boolean;
  toggleFavorite: (propertyId: number) => boolean;
  removeFavorite: (propertyId: number) => void;
  clearFavorites: () => void;
  favoriteCount: number;
  toastMessage: string | null;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Storage key is user-specific if logged in, otherwise guest
  const storageKey = user ? `raylive_favs_${user.email}` : 'raylive_favs_guest';

  // Load favorites whenever active user changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setFavorites(JSON.parse(stored));
      } else {
        setFavorites([]);
      }
    } catch {
      setFavorites([]);
    }
  }, [storageKey]);

  // Persist to localStorage
  const saveFavorites = (newFavs: number[]) => {
    setFavorites(newFavs);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newFavs));
    } catch (err) {
      console.error('Failed to save favorites to localStorage', err);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 2800);
  };

  const isFavorite = (propertyId: number): boolean => {
    return favorites.includes(propertyId);
  };

  const toggleFavorite = (propertyId: number): boolean => {
    const exists = favorites.includes(propertyId);
    let updated: number[];

    if (exists) {
      updated = favorites.filter((id) => id !== propertyId);
      showToast('Removed from your saved properties');
    } else {
      updated = [...favorites, propertyId];
      showToast('Saved to your favorites! ❤️');
    }

    saveFavorites(updated);
    return !exists;
  };

  const removeFavorite = (propertyId: number) => {
    const updated = favorites.filter((id) => id !== propertyId);
    saveFavorites(updated);
    showToast('Removed from your saved properties');
  };

  const clearFavorites = () => {
    saveFavorites([]);
    showToast('Cleared all saved properties');
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        clearFavorites,
        favoriteCount: favorites.length,
        toastMessage,
      }}
    >
      {children}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-navy-950/95 text-white px-5 py-2.5 rounded-2xl shadow-2xl border border-gold-500/30 flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-3 duration-200 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-gold-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
