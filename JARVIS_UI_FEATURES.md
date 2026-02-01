# Jarvis UI Features

## Overview

The Jarvis Shopping Assistant now features a futuristic, Iron Man-inspired UI with advanced visual effects and intelligent product context awareness.

## 🎨 Visual Features

### 1. Animated Jarvis Background

The left side (AI assistant) now features a dynamic, animated background inspired by Jarvis from Iron Man:

- **Floating Particles**: Glowing cyan orbs that float and pulse across the screen
- **Circuit Lines**: Animated lines with traveling light pulses that create a tech aesthetic
- **Particle Connections**: When active, nearby particles connect with glowing lines
- **Grid Overlay**: Subtle grid pattern for a holographic feel
- **Corner Accents**: Futuristic corner brackets that frame the interface
- **Center Glow**: Pulsing glow effect when the AI is active
- **Scanning Line**: Animated scanning effect during voice interaction

**Component**: `app/components/JarvisBackground.tsx`

### 2. Holographic Text Effects

Text elements now feature holographic shimmer effects:

- **Gradient Animation**: Text cycles through cyan → blue → purple colors
- **Shimmer Effect**: Smooth background position animation
- **Applied To**: App title, status messages during active voice sessions

**CSS Class**: `.holographic-text` in `app/globals.css`

### 3. Enhanced Visual Feedback

- **Glow Animations**: Buttons and interactive elements glow when active
- **Pulse Effects**: Cart badge pulses when items are added
- **Backdrop Blur**: Glass morphism effects on overlays
- **Smooth Transitions**: All state changes are animated

## 🧠 AI Intelligence Features

### 1. Dynamic Product Context

The AI assistant now receives real-time product information in its system prompt:

**What the AI Knows**:
- All currently displayed products (titles, prices, descriptions, ratings)
- The currently selected product (if any)
- Active category filter
- Shopping cart contents and total
- Exact product IDs for tool calls

**Implementation**: 
- `lib/productContext.ts` - Formats product data for AI
- `lib/useProductContext.ts` - React hook for dynamic context
- System prompt is regenerated whenever products, selection, or cart changes

### 2. Accurate Product Information

The AI can now:

✅ **Describe products accurately** using exact titles and descriptions
✅ **Quote correct prices** in Indian Rupees (₹)
✅ **Reference specific products** by their actual names
✅ **Understand "this product"** when a product is selected
✅ **Know what's in the cart** with exact items and quantities
✅ **Filter by category** with awareness of what's currently shown

### 3. Context-Aware Responses

The system prompt includes:

```
## CURRENT CONTEXT - LIVE PRODUCT DATA

**Active Category**: electronics
**Total Products Displayed**: 6

**🎯 CURRENTLY SELECTED PRODUCT (User is viewing this now)**:
Product ID: 9
Title: "WD 2TB Elements Portable External Hard Drive - USB 3.0"
Price: ₹4,565.00 (Indian Rupees)
Category: electronics
Description: USB 3.0 and USB 2.0 Compatibility Fast data transfers...
Rating: 3.3/5 stars (based on 203 customer reviews)
```

This ensures the AI always knows:
- What the user is looking at
- Exact product details
- Current shopping context

## 🎯 User Experience Improvements

### Before
- AI gave generic responses
- Couldn't describe specific products accurately
- No visual feedback for AI activity
- Static, plain interface

### After
- AI describes exact products with real details
- Knows which product user is viewing
- Dynamic animated background responds to AI state
- Futuristic, engaging interface
- Holographic effects create premium feel

## 🔧 Technical Implementation

### Key Files

1. **JarvisBackground.tsx** - Canvas-based animation system
2. **productContext.ts** - Product data formatting for AI
3. **useProductContext.ts** - Hook for dynamic system prompts
4. **VoiceButton.tsx** - Updated to pass product context
5. **VoiceAssistant.tsx** - Integrated background and context
6. **page.tsx** - Passes live product data to voice assistant

### Data Flow

```
Products State (page.tsx)
    ↓
VoiceAssistant Component
    ↓
VoiceButton Component
    ↓
useProductContext Hook
    ↓
Dynamic System Prompt
    ↓
Ultravox API Call
    ↓
AI with Full Product Knowledge
```

## 🎬 Animation Details

### Canvas Animations (60 FPS)

- **50 Particles**: Each with independent velocity, pulse rate, and opacity
- **8 Circuit Lines**: Horizontal and vertical with traveling light pulses
- **Connection Lines**: Dynamic connections between nearby particles
- **Fade Trail**: Canvas fade effect creates motion blur

### CSS Animations

- **pulse-slow**: 3s ease-in-out for breathing effects
- **scan**: 3s linear for scanning line
- **glow**: 2s ease-in-out for button glows
- **shimmer**: 3s linear for holographic text

## 🚀 Performance

- Canvas animations use `requestAnimationFrame` for smooth 60 FPS
- Particles and lines are optimized for low CPU usage
- Animations pause when component unmounts
- Responsive to window resize events

## 💡 Usage Tips

1. **Start Voice Session**: Click the microphone button to see the full Jarvis effect
2. **Select a Product**: The AI will know exactly which product you're viewing
3. **Ask About Products**: Say "Tell me about this product" for accurate descriptions
4. **Browse Categories**: The AI knows which category you're viewing
5. **Check Cart**: Ask "What's in my cart?" for exact cart contents

## 🎨 Customization

### Colors

The Jarvis theme uses:
- **Primary**: Cyan (#06b6d4)
- **Secondary**: Blue (#3b82f6)
- **Accent**: Purple (#8b5cf6)

### Adjusting Animation Speed

In `JarvisBackground.tsx`:
- Particle speed: Modify `vx` and `vy` multipliers
- Pulse speed: Adjust `pulseSpeed` range
- Circuit line speed: Change `speed` range

### Particle Count

Increase/decrease particle count in the initialization loop:
```typescript
for (let i = 0; i < 50; i++) { // Change 50 to desired count
  particles.push(new Particle(canvas.width, canvas.height));
}
```

## 📊 System Prompt Structure

The AI receives a comprehensive prompt with:

1. **Base Personality** (Kaldi/Warren Buffett inspired)
2. **Live Product Data** (current products, selection, category)
3. **Cart Context** (items, quantities, total)
4. **Tool Instructions** (how to use each tool)
5. **Language Guidelines** (English/Hindi support)

Total prompt size: ~3000-5000 tokens depending on product count

## 🔮 Future Enhancements

Potential additions:
- Voice waveform visualization
- 3D product preview integration
- AR product placement
- Voice command history display
- Personalized product recommendations
- Multi-language voice synthesis
