/**
 * Language Context for Kaldi Shopping
 * Supports English and Hindi
 */

'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    'app.title': 'Kaldi Shopping',
    'app.subtitle': 'Voice-Controlled Marketplace',
    'language': 'Language',
    
    // Categories
    'categories.all': 'All Products',
    'categories.electronics': 'Electronics',
    'categories.jewelery': 'Jewelery',
    'categories.mens': "Men's Clothing",
    'categories.womens': "Women's Clothing",
    
    // Product
    'product.price': 'Price',
    'product.rating': 'Rating',
    'product.reviews': 'reviews',
    'product.addToCart': 'Add to Cart',
    'product.viewDetails': 'View Details',
    
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.total': 'Total',
    'cart.clear': 'Clear Cart',
    'cart.items': 'items',
    
    // Voice
    'voice.ready': 'Click to start',
    'voice.listening': "I'm listening...",
    'voice.speaking': 'Speaking...',
    'voice.connecting': 'Connecting...',
  },
  hi: {
    // Header
    'app.title': 'कल्डी शॉपिंग',
    'app.subtitle': 'वॉइस-कंट्रोल्ड मार्केटप्लेस',
    'language': 'भाषा',
    
    // Categories
    'categories.all': 'सभी उत्पाद',
    'categories.electronics': 'इलेक्ट्रॉनिक्स',
    'categories.jewelery': 'ज्वेलरी',
    'categories.mens': 'पुरुषों के कपड़े',
    'categories.womens': 'महिलाओं के कपड़े',
    
    // Product
    'product.price': 'कीमत',
    'product.rating': 'रेटिंग',
    'product.reviews': 'समीक्षाएं',
    'product.addToCart': 'कार्ट में डालें',
    'product.viewDetails': 'विवरण देखें',
    
    // Cart
    'cart.title': 'शॉपिंग कार्ट',
    'cart.empty': 'आपकी कार्ट खाली है',
    'cart.total': 'कुल',
    'cart.clear': 'कार्ट साफ करें',
    'cart.items': 'आइटम',
    
    // Voice
    'voice.ready': 'शुरू करने के लिए क्लिक करें',
    'voice.listening': 'मैं सुन रहा हूं...',
    'voice.speaking': 'बोल रहा हूं...',
    'voice.connecting': 'कनेक्ट हो रहा है...',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
