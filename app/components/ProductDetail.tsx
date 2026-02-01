/**
 * ProductDetail Component
 * Expandable product view with swipe navigation
 */

'use client';

import { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/currency';
import { useLanguage } from '@/lib/languageContext';
import { Star, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onAddToCart: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export default function ProductDetail({
  product,
  onClose,
  onNext,
  onPrevious,
  onAddToCart,
  hasNext,
  hasPrevious,
}: ProductDetailProps) {
  const { t } = useLanguage();
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Swipe detection
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && hasNext) {
      onNext();
    }
    if (isRightSwipe && hasPrevious) {
      onPrevious();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card 
        className="w-full max-w-4xl h-[85vh] flex flex-col bg-gradient-to-br from-gray-900 to-black border-cyan-500/30 relative overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white hover:bg-cyan-500/20"
          onClick={onClose}
        >
          <X size={20} />
        </Button>

        {/* Main Content - Two Column Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column - Product Image */}
          <div className="w-1/2 relative bg-white/5 backdrop-blur-sm p-6 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.title}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Navigation Arrows */}
            {hasPrevious && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-900/80 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                onClick={onPrevious}
              >
                <ChevronLeft size={24} />
              </Button>
            )}
            {hasNext && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-900/80 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                onClick={onNext}
              >
                <ChevronRight size={24} />
              </Button>
            )}

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50" />
          </div>

          {/* Right Column - Product Details */}
          <div className="w-1/2 p-6 flex flex-col justify-between">
            {/* Top Section */}
            <div className="space-y-3">
              {/* Category Badge */}
              <Badge variant="secondary" className="text-xs bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                {product.category}
              </Badge>

              {/* Title */}
              <h2 className="text-xl font-bold text-white line-clamp-2">{product.title}</h2>

              {/* Rating */}
              <div className="flex items-center gap-2">
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
                  {product.rating.rate} ({product.rating.count} {t('product.reviews')})
                </span>
              </div>

              <Separator className="bg-cyan-500/20" />

              {/* Description */}
              <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-gray-800">
                <p className="text-sm text-gray-300 leading-relaxed">{product.description}</p>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="space-y-4">
              <Separator className="bg-cyan-500/20" />

              {/* Price */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{t('product.price')}</span>
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500/20 blur-lg" />
                  <span className="relative text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-5 text-base font-semibold"
                onClick={onAddToCart}
              >
                {t('product.addToCart')}
              </Button>

              {/* Swipe Hint */}
              <p className="text-xs text-center text-gray-500">
                Swipe left/right to see more products
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
