/**
 * ProductGrid Component
 * Displays products in a grid layout with premium dark theme
 */

'use client';

import { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/currency';
import { Star } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function ProductGrid({ products, onProductClick }: ProductGridProps) {

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <p>No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
      {products.map((product) => (
        <Card
          key={product.id}
          className="cursor-pointer hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 overflow-hidden group bg-gradient-to-br from-gray-900 to-black border-cyan-500/30"
          onClick={() => onProductClick(product)}
        >
          {/* Product Image */}
          <div className="relative aspect-square bg-white/5 backdrop-blur-sm p-4">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
            />
            {/* Rating Badge */}
            <Badge className="absolute top-2 right-2 bg-cyan-500/80 text-white border-cyan-400">
              <Star size={12} className="fill-white mr-1" />
              {product.rating.rate}
            </Badge>
            
            {/* Holographic glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>

          {/* Product Info */}
          <div className="p-3 space-y-2 bg-gradient-to-b from-gray-900/50 to-black/50 backdrop-blur-sm">
            <h3 className="text-sm font-medium line-clamp-2 min-h-[2.5rem] text-white">
              {product.title}
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {formatPrice(product.price)}
              </p>
            </div>
          </div>

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-cyan-500/50" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-cyan-500/50" />
        </Card>
      ))}
    </div>
  );
}
