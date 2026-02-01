/**
 * ProductCard Component - Sci-Fi Edition
 * Futuristic product display with holographic effects and seller tags
 */

'use client';

import { Product, getProductTag } from '@/lib/types';
import { Star, TrendingUp, Award } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const tag = getProductTag(product);
  
  return (
    <div className={`relative group ${className}`}>
      {/* Holographic Border Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl opacity-30 group-hover:opacity-50 blur transition-all duration-300" />
      
      {/* Main Card */}
      <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-cyan-500/30 backdrop-blur-sm overflow-hidden">
        {/* Scan Lines Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6, 182, 212, 0.1) 2px, rgba(6, 182, 212, 0.1) 4px)'
          }} />
        </div>

        {/* Top Badges Row */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-2">
          {/* Trending Tag */}
          {tag && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-sm font-bold text-xs uppercase tracking-wider animate-pulse ${
              tag === 'BESTSELLER' 
                ? 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border border-yellow-500/50 text-yellow-300'
                : 'bg-gradient-to-r from-red-500/30 to-pink-500/30 border border-red-500/50 text-red-300'
            }`}>
              {tag === 'BESTSELLER' ? (
                <>
                  <Award size={14} className="animate-pulse" />
                  <span>BESTSELLER</span>
                </>
              ) : (
                <>
                  <TrendingUp size={14} className="animate-pulse" />
                  <span>HOT</span>
                </>
              )}
            </div>
          )}
          
          {/* Category Badge */}
          <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-xs text-cyan-400 font-medium backdrop-blur-sm uppercase tracking-wider ml-auto">
            {product.category}
          </span>
        </div>

        {/* Product Image with Holographic Effect */}
        <div className="relative mb-6 mt-8 group-hover:scale-105 transition-transform duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl blur-xl" />
          <div className="relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-64 object-contain"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-4 relative z-10">
          {/* Title */}
          <h3 className="text-lg font-semibold text-white line-clamp-2 min-h-[3.5rem]">
            {product.title}
          </h3>

          {/* Rating with Demand Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.floor(product.rating.rate)
                      ? 'fill-cyan-400 text-cyan-400'
                      : 'text-gray-600'
                  }
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">
              {product.rating.rate} ({product.rating.count} reviews)
            </span>
          </div>

          {/* Demand Indicator */}
          {tag && (
            <div className="flex items-center gap-2 text-xs">
              <TrendingUp size={12} className="text-green-400" />
              <span className="text-green-400 font-medium">High Demand</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400">Good selling opportunity</span>
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-gray-400 line-clamp-3 min-h-[4.5rem]">
            {product.description}
          </p>

          {/* Price with Glow */}
          <div className="pt-4 border-t border-cyan-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 uppercase tracking-wider">Market Price</span>
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/30 blur-lg" />
                <span className="relative text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  ₹{(product.price * 83).toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-2xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50 rounded-br-2xl" />
      </div>
    </div>
  );
}
