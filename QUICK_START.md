# Quick Start Guide - Jarvis UI

## 🚀 Running the Application

```bash
cd jarvis-shopping-assistant
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎯 What You'll See

### Left Side - Jarvis AI Assistant
- **Animated Background**: Floating particles, circuit lines, holographic grid
- **Voice Button**: Click to activate voice assistant
- **Status Display**: Shows connection state with holographic text
- **Visual Feedback**: Background responds to AI activity

### Right Side - Product Marketplace
- **Product Grid**: Browse products with futuristic styling
- **Category Tabs**: Filter by electronics, jewelry, clothing
- **Shopping Cart**: Track items with animated badge
- **Product Details**: Swipeable product cards

## 🎤 Try These Voice Commands

1. **Browse Products**
   - "Show me electronics"
   - "Next product"
   - "Previous product"

2. **Get Product Info**
   - "Tell me about this product"
   - "What's the price?"
   - "Read the description"

3. **Shopping Cart**
   - "Add to cart"
   - "What's in my cart?"
   - "Open cart"
   - "Clear cart"

4. **Navigation**
   - "Close this"
   - "Go back"
   - "Show all products"

## 🎨 Visual Features to Notice

### Jarvis Background (Left Side)
- **Particles**: 50 glowing cyan orbs floating around
- **Circuit Lines**: 8 animated lines with traveling pulses
- **Connections**: Lines connect nearby particles when AI is active
- **Grid**: Subtle holographic grid overlay
- **Corners**: Futuristic corner brackets
- **Scanning**: Horizontal scanning line during voice interaction

### Holographic Effects
- **Title**: Shimmering gradient text (cyan → blue → purple)
- **Status Text**: Holographic effect when AI is listening/speaking
- **Glow Effects**: Buttons and elements glow on hover/active

### Animations
- **Pulse**: Cart badge pulses when items added
- **Fade**: Smooth transitions between states
- **Blur**: Glass morphism on overlays
- **Scan**: Scanning line effect during AI activity

## 🧠 AI Intelligence Features

### The AI Knows:
✅ **All Products**: Titles, prices, descriptions, ratings
✅ **Current Selection**: Which product you're viewing
✅ **Active Category**: What filter is applied
✅ **Cart Contents**: Items, quantities, total price
✅ **Exact Prices**: All prices in Indian Rupees (₹)

### Example Conversation:

**You**: "Show me electronics"
**AI**: *[Filters to electronics category]* "Showing electronics."

**You**: "Tell me about this product"
**AI**: "This is the WD 2TB Elements Portable External Hard Drive for ₹4,565. It features USB 3.0 connectivity for fast data transfers and is compatible with USB 2.0. It has a 3.3 out of 5 star rating based on 203 customer reviews. Would you like to add it to your cart?"

**You**: "Yes, add it"
**AI**: *[Adds to cart]* "Added to cart."

**You**: "What's in my cart?"
**AI**: *[Opens cart]* "You have 1 item. WD 2TB Elements Portable External Hard Drive for ₹4,565. Total is ₹4,565."

## 🎮 Interactive Elements

### Voice Button States
- **Idle**: Gray with dim glow
- **Connecting**: Cyan with pulse animation
- **Listening**: Cyan-blue gradient with strong glow
- **Speaking**: Purple-cyan gradient with pulse
- **Error**: Red with error message

### Background States
- **Idle**: Slow particle movement
- **Active**: Particles connect, scanning line appears
- **Listening**: Full visual effects active
- **Speaking**: Continued animation with different colors

## 📱 Responsive Design

The interface adapts to different screen sizes:
- **Desktop**: Full split-screen layout
- **Tablet**: Optimized spacing
- **Mobile**: Stacked layout (if implemented)

## 🎨 Customization

### Change Particle Count
Edit `app/components/JarvisBackground.tsx`:
```typescript
for (let i = 0; i < 50; i++) { // Change 50 to desired count
  particles.push(new Particle(canvas.width, canvas.height));
}
```

### Change Colors
Edit `app/globals.css`:
```css
.holographic-text {
  background: linear-gradient(
    90deg,
    #06b6d4 0%,  /* Change these colors */
    #3b82f6 25%,
    #8b5cf6 50%,
    #3b82f6 75%,
    #06b6d4 100%
  );
}
```

### Adjust Animation Speed
Edit `app/components/JarvisBackground.tsx`:
```typescript
this.vx = (Math.random() - 0.5) * 0.5; // Increase multiplier for faster movement
this.pulseSpeed = Math.random() * 0.02 + 0.01; // Adjust pulse speed
```

## 🐛 Troubleshooting

### Voice Not Working
1. Check microphone permissions in browser
2. Ensure ULTRAVOX_API_KEY is set in `.env.local`
3. Check browser console for errors

### Background Not Animating
1. Check if canvas is supported in browser
2. Open browser console for errors
3. Try refreshing the page

### AI Giving Generic Responses
1. Check if products are loaded (right side should show products)
2. Verify system prompt includes product data (check console logs)
3. Try selecting a product first

## 📚 Documentation

- **JARVIS_UI_FEATURES.md** - Detailed feature documentation
- **IMPLEMENTATION_SUMMARY.md** - Technical implementation details
- **README.md** - Project overview and setup

## 🎉 Enjoy!

You now have a futuristic Jarvis-type shopping assistant with:
- ✨ Stunning animated background
- 🧠 Intelligent AI with product knowledge
- 🎨 Holographic visual effects
- 🎤 Voice-controlled shopping
- 🛒 Smart cart management

Have fun shopping with your AI assistant!
