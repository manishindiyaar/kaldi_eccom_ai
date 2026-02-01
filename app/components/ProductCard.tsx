/**
 * ProductCard Component
 * 
 * Displays a single product with image, title, price, category, and rating.
 * Features premium styling with hover effects and smooth animations.
 * 
 * Requirements:
 * - 4.3: Display product image, title, price, category, and rating
 * - 7.4: Display product images with proper aspect ratio and high quality rendering
 * - 7.6: Provide subtle visual feedback when hovering over interactive elements
 */

'use client';

import { Product } from '@/lib/types';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  // Format price to 2 decimal places
  const formattedPrice = `$${product.price.toFixed(2)}`;
  
  // Format category for display (capitalize first letter of each word)
  const formattedCategory = product.category
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Generate star rating display
  const renderStars = () => {
    const fullStars = Math.floor(product.rating.rate);
    const hasHalfStar = product.rating.rate % 1 >= 0.5;
    const stars = [];

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="w-4 h-4 fill-[var(--accent)] text-[var(--accent)]"
        />
      );
    }

    // Half star
    if (hasHalfStar && fullStars < 5) {
      stars.push(
        <div key="half" className="relative w-4 h-4">
          <Star className="w-4 h-4 text-[var(--accent)]" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-4 h-4 fill-[var(--accent)] text-[var(--accent)]" />
          </div>
        </div>
      );
    }

    // Empty stars
    const emptyStars = 5 - Math.ceil(product.rating.rate);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className="w-4 h-4 text-gray-600"
        />
      );
    }

    return stars;
  };

  return (
    <div
      className={`
        group relative w-full max-w-2xl mx-auto
        bg-[var(--card-bg)] border border-[var(--card-border)]
        rounded-2xl overflow-hidden
        transition-all duration-300 ease-in-out
        hover:border-[var(--primary)] hover:shadow-lg hover:shadow-[var(--primary-glow)]
        hover:scale-[1.02]
        ${className}
      `}
    >
      {/* Product Image Container */}
      <div className="relative w-full aspect-square bg-white/5 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="
            w-full h-full object-contain p-8
            transition-transform duration-300 ease-in-out
            group-hover:scale-110
          "
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="
            px-3 py-1 text-xs font-semibold
            bg-[var(--primary)]/20 text-[var(--primary)]
            border border-[var(--primary)]/30
            rounded-full backdrop-blur-sm
            transition-all duration-300
            group-hover:bg-[var(--primary)]/30 group-hover:border-[var(--primary)]
          ">
            {formattedCategory}
          </span>
        </div>

        {/* Hover Overlay Effect */}
        <div className="
          absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] via-transparent to-transparent
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
        " />
      </div>

      {/* Product Details */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="
          text-xl font-semibold text-[var(--foreground)]
          line-clamp-2 min-h-[3.5rem]
          transition-colors duration-300
          group-hover:text-[var(--primary)]
        ">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {renderStars()}
          </div>
          <span className="text-sm text-[var(--foreground-muted)]">
            {product.rating.rate.toFixed(1)}
          </span>
          <span className="text-xs text-[var(--foreground-muted)]">
            ({product.rating.count} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="
            text-3xl font-bold text-[var(--accent)]
            transition-all duration-300
            group-hover:text-[var(--accent-light)] group-hover:scale-105
          ">
            {formattedPrice}
          </span>
        </div>

        {/* Decorative Bottom Border */}
        <div className="
          h-1 w-0 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]
          rounded-full
          transition-all duration-300 ease-out
          group-hover:w-full
        " />
      </div>

      {/* Glow Effect on Hover */}
      <div className="
        absolute inset-0 rounded-2xl
        opacity-0 group-hover:opacity-100
        transition-opacity duration-300
        pointer-events-none
        bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-[var(--accent)]/5
      " />
    </div>
  );
}
