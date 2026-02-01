/**
 * Main Page - Jarvis Shopping Assistant
 * 
 * This is the main application page that integrates all components:
 * - Voice Assistant for voice control
 * - Product Display with navigation
 * - Shopping Cart
 * - Category Filter
 * 
 * Handles all event listeners for voice-to-UI communication.
 */

'use client';

import { useEffect, useState } from 'react';
import { useProducts } from '@/lib/useProducts';
import { useCart } from '@/lib/useCart';
import VoiceAssistant from './components/VoiceAssistant';
import ProductCard from './components/ProductCard';
import CategoryFilter from './components/CategoryFilter';
import { CLIENT_TOOL_EVENTS } from '@/lib/clientTools';
import { ChevronLeft, ChevronRight, ShoppingCart, Trash2 } from 'lucide-react';

export default function Home() {
  // Product state management
  const {
    products,
    filteredProducts,
    currentProduct,
    currentProductIndex,
    isLoading,
    error,
    activeCategory,
    setCategory,
    nextProduct,
    previousProduct,
  } = useProducts();

  // Cart state management
  const {
    cart,
    itemCount,
    addToCart,
    removeFromCart,
    clearCart,
  } = useCart(products);

  const [showCart, setShowCart] = useState(false);

  /**
   * Listen for cart update events from voice commands
   */
  useEffect(() => {
    const handleCartUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { action, productId, quantity } = customEvent.detail;

      if (action === 'add' && currentProduct) {
        addToCart(currentProduct, quantity || 1);
      } else if (action === 'remove' && productId) {
        removeFromCart(productId);
      } else if (action === 'clear') {
        clearCart();
      }
    };

    window.addEventListener(CLIENT_TOOL_EVENTS.CART_UPDATE, handleCartUpdate);
    return () => window.removeEventListener(CLIENT_TOOL_EVENTS.CART_UPDATE, handleCartUpdate);
  }, [currentProduct, addToCart, removeFromCart, clearCart]);

  /**
   * Listen for product navigation events from voice commands
   */
  useEffect(() => {
    const handleProductNavigate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { direction } = customEvent.detail;

      if (direction === 'next') {
        nextProduct();
      } else if (direction === 'previous') {
        previousProduct();
      }
    };

    window.addEventListener(CLIENT_TOOL_EVENTS.PRODUCT_NAVIGATE, handleProductNavigate);
    return () => window.removeEventListener(CLIENT_TOOL_EVENTS.PRODUCT_NAVIGATE, handleProductNavigate);
  }, [nextProduct, previousProduct]);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="border-b border-[var(--card-border)] bg-[var(--card-bg)]/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold gradient-text">Jarvis Shopping Assistant</h1>
              <p className="text-sm text-[var(--foreground-muted)]">Voice-Controlled Shopping Experience</p>
            </div>
            
            {/* Cart Button */}
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative flex items-center gap-2 px-4 py-2 bg-[var(--card-bg)] border-2 border-[var(--card-border)] rounded-lg hover:border-[var(--primary)] transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-semibold">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--accent)] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Voice Assistant */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-6 text-center">Voice Control</h2>
                <VoiceAssistant showDebugMessages={false} />
                
                <div className="mt-8 p-4 bg-[var(--background)] rounded-lg">
                  <h3 className="text-sm font-semibold mb-2 text-[var(--primary)]">Voice Commands:</h3>
                  <ul className="text-xs text-[var(--foreground-muted)] space-y-1">
                    <li>• &quot;Next product&quot; / &quot;Previous&quot;</li>
                    <li>• &quot;Show me electronics&quot;</li>
                    <li>• &quot;Add to cart&quot;</li>
                    <li>• &quot;What&apos;s in my cart?&quot;</li>
                    <li>• &quot;Clear cart&quot;</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Product Display */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category Filter */}
            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={setCategory}
            />

            {/* Product Display */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
              </div>
            )}

            {error && (
              <div className="bg-[var(--error)]/10 border border-[var(--error)] rounded-lg p-6 text-center">
                <p className="text-[var(--error)]">{error}</p>
              </div>
            )}

            {!isLoading && !error && currentProduct && (
              <div className="space-y-4">
                {/* Navigation Info */}
                <div className="text-center text-sm text-[var(--foreground-muted)]">
                  Product {currentProductIndex + 1} of {filteredProducts.length}
                </div>

                {/* Product Card */}
                <ProductCard product={currentProduct} />

                {/* Navigation Buttons */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={previousProduct}
                    className="flex items-center gap-2 px-6 py-3 bg-[var(--card-bg)] border-2 border-[var(--card-border)] rounded-lg hover:border-[var(--primary)] hover:bg-[var(--card-bg-hover)] transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={() => addToCart(currentProduct, 1)}
                    className="px-8 py-3 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-[var(--primary-dark)] transition-all shadow-lg hover:shadow-xl"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={nextProduct}
                    className="flex items-center gap-2 px-6 py-3 bg-[var(--card-bg)] border-2 border-[var(--card-border)] rounded-lg hover:border-[var(--primary)] hover:bg-[var(--card-bg-hover)] transition-all"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Product Description */}
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-[var(--foreground-muted)] leading-relaxed">
                    {currentProduct.description}
                  </p>
                </div>
              </div>
            )}

            {!isLoading && !error && filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-[var(--foreground-muted)]">No products found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCart(false)}
          />

          {/* Cart Panel */}
          <div className="relative w-full max-w-md h-full bg-[var(--card-bg)] border-l border-[var(--card-border)] shadow-2xl overflow-y-auto animate-slide-in-right">
            <div className="p-6">
              {/* Cart Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Shopping Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                >
                  ✕
                </button>
              </div>

              {/* Cart Items */}
              {cart.items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-[var(--foreground-muted)]" />
                  <p className="text-[var(--foreground-muted)]">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-4 p-4 bg-[var(--background)] rounded-lg border border-[var(--card-border)]"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-20 h-20 object-contain bg-white/5 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                          {item.product.title}
                        </h3>
                        <p className="text-[var(--accent)] font-bold">
                          ${item.product.price.toFixed(2)}
                        </p>
                        <p className="text-xs text-[var(--foreground-muted)]">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[var(--error)] hover:text-red-400"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}

                  {/* Cart Summary */}
                  <div className="border-t border-[var(--card-border)] pt-4 mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[var(--foreground-muted)]">Subtotal:</span>
                      <span className="text-2xl font-bold text-[var(--accent)]">
                        ${cart.subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-[var(--foreground-muted)] mb-4">
                      <span>Items:</span>
                      <span>{itemCount}</span>
                    </div>

                    <button
                      onClick={clearCart}
                      className="w-full px-4 py-2 bg-[var(--error)]/20 text-[var(--error)] border border-[var(--error)] rounded-lg hover:bg-[var(--error)]/30 transition-all mb-3"
                    >
                      Clear Cart
                    </button>

                    <button className="w-full px-4 py-3 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-[var(--primary-dark)] transition-all shadow-lg">
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
