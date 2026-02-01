/**
 * Hook for managing product context in voice sessions
 * 
 * Provides dynamic system prompts with current product information
 */

'use client';

import { useMemo } from 'react';
import { Product, ProductCategory, CartItem } from './types';
import { 
  generateSystemPromptWithProducts, 
  generateCartContext 
} from './productContext';
import { KALDI_SYSTEM_PROMPT } from '@/app/jarvis-config';

interface UseProductContextParams {
  currentProducts: Product[];
  selectedProduct: Product | null;
  activeCategory: ProductCategory | 'all';
  cartItems: CartItem[];
  cartSubtotal: number;
}

/**
 * Hook that generates dynamic system prompt with product context
 */
export function useProductContext({
  currentProducts,
  selectedProduct,
  activeCategory,
  cartItems,
  cartSubtotal,
}: UseProductContextParams) {
  const systemPrompt = useMemo(() => {
    let prompt = generateSystemPromptWithProducts(
      KALDI_SYSTEM_PROMPT,
      currentProducts,
      selectedProduct,
      activeCategory
    );

    // Add cart context
    const cartContext = generateCartContext(cartItems, cartSubtotal);
    prompt += cartContext;

    return prompt;
  }, [currentProducts, selectedProduct, activeCategory, cartItems, cartSubtotal]);

  return { systemPrompt };
}
