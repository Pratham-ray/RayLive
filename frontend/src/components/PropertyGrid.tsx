import React from 'react';
import { Property } from '../types/property';
import { PropertyCard } from './PropertyCard';
import { SlidersHorizontal, Home } from 'lucide-react';

interface PropertyGridProps {
  properties: Property[];
  sortBy: string;
  onSortChange: (sort: string) => void;
  onAskAIBroker: (property: Property) => void;
  onOpenFilterDrawer?: () => void;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  sortBy,
  onSortChange,
  onAskAIBroker,
  onOpenFilterDrawer
}) => {
  return (
    <div className="w-full">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-navy-950">
            Real Estate Properties
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Found <span className="font-bold text-slate-800">{properties.length}</span> verified listings matching your preferences
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {onOpenFilterDrawer && (
            <button
              onClick={onOpenFilterDrawer}
              className="sm:hidden flex-1 py-2 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid List */}
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onAskAIBroker={onAskAIBroker}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
            <Home className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No matching properties found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
            Try adjusting your budget, selecting another city, or resetting some filters to see more listings.
          </p>
        </div>
      )}

    </div>
  );
};
