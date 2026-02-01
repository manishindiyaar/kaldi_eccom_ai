# Jarvis Shopping Assistant

A voice-controlled e-commerce interface powered by Ultravox AI, providing a premium, magical shopping experience. Browse products from the Fake Store API using voice commands, swipe through product cards, and manage your shopping cart entirely through voice interaction.

## Features

- 🎤 Real-time voice interaction using Ultravox API
- 🛍️ Voice-controlled product browsing and cart management
- 📱 Swipeable product cards with touch and voice navigation
- 🎨 Premium dark-themed UI with smooth animations
- 🔊 Natural language processing for shopping commands
- 💾 Persistent shopping cart with localStorage

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS (dark theme)
- **Voice AI**: Ultravox Client SDK
- **Icons**: Lucide React
- **Testing**: Fast-check (property-based testing)
- **Product API**: Fake Store API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Ultravox API key (get one at [ultravox.ai](https://ultravox.ai))

### Installation

1. Clone the repository and navigate to the project:

```bash
cd jarvis-shopping-assistant
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory:

```bash
ULTRAVOX_API_KEY=your_api_key_here
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Voice Commands

Once the voice assistant is activated, you can use commands like:

- **Navigation**: "next product", "previous", "go back"
- **Categories**: "show me electronics", "show jewelry", "show all products"
- **Product Info**: "tell me about this product"
- **Cart Management**: "add to cart", "add two of these", "remove from cart"
- **Cart Review**: "show my cart", "what's in my cart"
- **Clear Cart**: "clear cart", "empty my cart"

## Project Structure

```
jarvis-shopping-assistant/
├── app/                    # Next.js app directory
│   ├── api/               # API routes (Ultravox integration)
│   ├── globals.css        # Global styles and dark theme
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components (to be created)
├── lib/                   # Utilities and types (to be created)
├── __tests__/            # Test files (to be created)
└── public/               # Static assets
```

## Development

This project follows the design patterns from the Kaldi Assistant reference project, with adaptations for e-commerce functionality.

### Key Dependencies

- `ultravox-client`: Real-time voice AI SDK
- `lucide-react`: Icon library
- `fast-check`: Property-based testing framework

## License

MIT

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Ultravox Documentation](https://docs.ultravox.ai)
- [Tailwind CSS](https://tailwindcss.com/docs)
