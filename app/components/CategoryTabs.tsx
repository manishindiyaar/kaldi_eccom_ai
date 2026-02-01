/**
 * CategoryTabs Component
 * Category filter tabs
 */

'use client';

import { ProductCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/languageContext';

interface CategoryTabsProps {
  activeCategory: ProductCategory | 'all';
  onCategoryChange: (category: ProductCategory | 'all') => void;
}

export default function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  const { t } = useLanguage();

  const categories: Array<{ value: ProductCategory | 'all'; label: string }> = [
    { value: 'all', label: t('categories.all') },
    { value: 'electronics', label: t('categories.electronics') },
    { value: 'jewelery', label: t('categories.jewelery') },
    { value: "men's clothing", label: t('categories.mens') },
    { value: "women's clothing", label: t('categories.womens') },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category.value}
          variant={activeCategory === category.value ? 'default' : 'outline'}
          className={`whitespace-nowrap transition-all ${
            activeCategory === category.value
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-cyan-400'
              : 'bg-gray-900/50 text-gray-400 border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/50'
          }`}
          onClick={() => onCategoryChange(category.value)}
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
}
