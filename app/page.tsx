/**
 * Main Page - Kaldi Shopping
 * 
 * Split-screen with voice AI and product marketplace
 * Features: Language switching, category filtering, swipeable product details
 */

'use client';

import { useEffect, useState } from 'react';
import { useProducts } from '@/lib/useProducts';
import { useCart } from '@/lib/useCart';
import { useLanguage } from '@/lib/languageContext';
import VoiceAssistant from './components/VoiceAssistant';
import ProductGrid from './components/ProductGrid';
import ProductDetail from './components/ProductDetail';
import CategoryTabs from './components/CategoryTabs';
import LanguageSwitcher from './components/LanguageSwitcher';
import { CLIENT_TOOL_EVENTS } from '@/lib/clientTools';
import { Product, ProductCategory } from '@/lib/types';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const { t } = useLanguage();
  
  // Product state
  const {
    filteredProducts,
    activeCategory,
    isLoading,
    error,
    setCategory,
    nextProduct,
    previousProduct,
  } = useProducts();

  // Cart state
  const {
    cart,
    itemCount,
    addToCart,
    removeFromCart,
    clearCart,
  } = useCart();

  // UI state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  /**
   * Voice command event listeners
   */
  useEffect(() => {
    const handleProductNavigate = (event: Event) => {
      const customEvent = event as CustomEvent<{ direction: 'next' | 'previous' }>;
      const { direction } = customEvent.detail;
      
      if (direction === 'next') {
        if (selectedProduct) {
          const currentIndex = filteredProducts.findIndex(p => p.id === selectedProduct.id);
          if (currentIndex < filteredProducts.length - 1) {
            setSelectedProduct(filteredProducts[currentIndex + 1]);
          }
        } else {
          nextProduct();
        }
      } else {
        if (selectedProduct) {
          const currentIndex = filteredProducts.findIndex(p => p.id === selectedProduct.id);
          if (currentIndex > 0) {
            setSelectedProduct(filteredProducts[currentIndex - 1]);
          }
        } else {
          previousProduct();
        }
      }
    };

    const handleCategoryFilter = (event: Event) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const customEvent = event as CustomEvent<{ category: any }>;
      const { category } = customEvent.detail;
      setCategory(category as ProductCategory | 'all');
      setSelectedProduct(null);
      setHasInteracted(true); // Mark as interacted when filtering
    };

    const handleCartUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{
        action: 'add' | 'remove' | 'clear';
        productId?: number;
        quantity?: number;
      }>;
      const { action, productId, quantity } = customEvent.detail;

      if (action === 'add' && selectedProduct) {
        addToCart(selectedProduct, quantity || 1);
      } else if (action === 'remove' && productId) {
        removeFromCart(productId);
      } else if (action === 'clear') {
        clearCart();
      }
    };

    // Handle read product details - show the product card
    const handleReadProduct = (event: Event) => {
      const customEvent = event as CustomEvent<{ productId: number }>;
      const { productId } = customEvent.detail;
      
      console.log('[Page] Voice command: Read product details', productId);
      
      // If productId is 0, use first product from filtered list
      if (productId === 0 && filteredProducts.length > 0) {
        const currentProduct = filteredProducts[0];
        setSelectedProduct(currentProduct);
        setHasInteracted(true);
      } else {
        // Find product by ID
        const product = filteredProducts.find(p => p.id === productId);
        if (product) {
          setSelectedProduct(product);
          setHasInteracted(true);
        }
      }
    };

    // Handle close product - close the product detail card
    const handleCloseProduct = () => {
      console.log('[Page] Voice command: Close product');
      setSelectedProduct(null);
    };

    // Handle open cart - open the cart overlay
    const handleOpenCart = () => {
      console.log('[Page] Voice command: Open cart');
      setShowCart(true);
    };

    window.addEventListener(CLIENT_TOOL_EVENTS.PRODUCT_NAVIGATE, handleProductNavigate);
    window.addEventListener(CLIENT_TOOL_EVENTS.CATEGORY_FILTER, handleCategoryFilter);
    window.addEventListener(CLIENT_TOOL_EVENTS.CART_UPDATE, handleCartUpdate);
    window.addEventListener(CLIENT_TOOL_EVENTS.READ_PRODUCT, handleReadProduct);
    window.addEventListener(CLIENT_TOOL_EVENTS.CLOSE_PRODUCT, handleCloseProduct);
    window.addEventListener(CLIENT_TOOL_EVENTS.OPEN_CART, handleOpenCart);

    return () => {
      window.removeEventListener(CLIENT_TOOL_EVENTS.PRODUCT_NAVIGATE, handleProductNavigate);
      window.removeEventListener(CLIENT_TOOL_EVENTS.CATEGORY_FILTER, handleCategoryFilter);
      window.removeEventListener(CLIENT_TOOL_EVENTS.CART_UPDATE, handleCartUpdate);
      window.removeEventListener(CLIENT_TOOL_EVENTS.READ_PRODUCT, handleReadProduct);
      window.removeEventListener(CLIENT_TOOL_EVENTS.CLOSE_PRODUCT, handleCloseProduct);
      window.removeEventListener(CLIENT_TOOL_EVENTS.OPEN_CART, handleOpenCart);
    };
  }, [selectedProduct, filteredProducts, nextProduct, previousProduct, setCategory, addToCart, removeFromCart, clearCart]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setHasInteracted(true);
  };

  const handleNextProduct = () => {
    if (!selectedProduct) return;
    const currentIndex = filteredProducts.findIndex(p => p.id === selectedProduct.id);
    if (currentIndex < filteredProducts.length - 1) {
      setSelectedProduct(filteredProducts[currentIndex + 1]);
    }
  };

  const handlePreviousProduct = () => {
    if (!selectedProduct) return;
    const currentIndex = filteredProducts.findIndex(p => p.id === selectedProduct.id);
    if (currentIndex > 0) {
      setSelectedProduct(filteredProducts[currentIndex - 1]);
    }
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      addToCart(selectedProduct, 1);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  const currentIndex = selectedProduct ? filteredProducts.findIndex(p => p.id === selectedProduct.id) : -1;
  const hasNext = currentIndex < filteredProducts.length - 1;
  const hasPrevious = currentIndex > 0;

  return (
    <div className="h-screen w-screen overflow-hidden flex">
      {/* Left Side - Voice AI */}
      <div className="w-1/2 h-full bg-black flex flex-col items-center justify-center relative">
        <div className="absolute top-8 left-8 z-20">
          <h1 className="text-2xl font-bold holographic-text">{t('app.title')}</h1>
          <p className="text-sm text-gray-400 mt-1">{t('app.subtitle')}</p>
        </div>
        
        <VoiceAssistant 
          showDebugMessages={true}
          currentProducts={filteredProducts}
          selectedProduct={selectedProduct}
          activeCategory={activeCategory}
          cartItems={cart.items}
          cartSubtotal={cart.subtotal}
        />
      </div>

      {/* Right Side - Product Marketplace */}
      <div className="w-1/2 h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col relative">
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }} />
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-black/50 backdrop-blur-sm">
          <LanguageSwitcher />
          
          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
            onClick={() => setShowCart(!showCart)}
          >
            <ShoppingCart size={24} />
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-cyan-500 text-white px-2 animate-pulse">
                {itemCount}
              </Badge>
            )}
          </Button>
        </div>

        {!hasInteracted ? (
          /* Empty State - Before Interaction */
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8">
            <div className="text-center space-y-6 max-w-md">
              {/* Animated Icon */}
              <div className="relative mx-auto w-32 h-32">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse-slow" />
                <div className="relative w-full h-full rounded-full border-2 border-cyan-500/30 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black animate-glow">
                  <ShoppingCart size={48} className="text-cyan-400" />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold holographic-text">
                  {t('app.title')}
                </h2>
                <p className="text-lg text-gray-300">
                  Start talking to the AI assistant
                </p>
                <p className="text-sm text-cyan-400/70">
                  Say &quot;Show me electronics&quot; or click a category below
                </p>
              </div>

              {/* Decorative elements */}
              <div className="flex items-center justify-center gap-2 mt-8">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-100" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-200" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>

            {/* Category Tabs at Bottom */}
            <div className="absolute bottom-8 left-0 right-0 px-6">
              <CategoryTabs
                activeCategory={activeCategory}
                onCategoryChange={(cat) => {
                  setCategory(cat);
                  setHasInteracted(true);
                }}
              />
            </div>
          </div>
        ) : (
          /* Product View - After Interaction */
          <>
            {/* Category Tabs */}
            <div className="relative z-10 px-6 py-4 border-b border-cyan-500/20 bg-black/30 backdrop-blur-sm">
              <CategoryTabs
                activeCategory={activeCategory}
                onCategoryChange={setCategory}
              />
            </div>

            {/* Product Grid */}
            <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar">
              <ProductGrid
                products={filteredProducts}
                onProductClick={handleProductClick}
              />
            </div>
          </>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onNext={handleNextProduct}
          onPrevious={handlePreviousProduct}
          onAddToCart={handleAddToCart}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
        />
      )}
    </div>
  );
}
