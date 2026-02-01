/**
 * Product Context for AI Assistant
 * 
 * Provides current product information to the AI assistant
 * so it can speak accurately about what's being displayed
 */

import { Product, ProductCategory, getProductTag } from './types';

/**
 * Format product information for AI context
 */
export function formatProductForAI(product: Product): string {
  const priceInRupees = (product.price * 83).toFixed(2);
  const tag = getProductTag(product);
  const tagText = tag ? `\n🏷️ TAG: ${tag}` : '';
  
  return `
Product ID: ${product.id}
Title: "${product.title}"
Price: ₹${priceInRupees} (Indian Rupees)
Category: ${product.category}
Description: ${product.description}
Rating: ${product.rating.rate}/5 stars (based on ${product.rating.count} customer reviews)${tagText}
Image: Available
`.trim();
}

/**
 * Format multiple products for AI context
 */
export function formatProductsForAI(products: Product[]): string {
  if (products.length === 0) {
    return 'No products currently displayed.';
  }

  return products.map((product, index) => 
    `${index + 1}. ${formatProductForAI(product)}`
  ).join('\n\n');
}

/**
 * Generate dynamic system prompt with current product context
 */
export function generateSystemPromptWithProducts(
  basePrompt: string,
  currentProducts: Product[],
  selectedProduct: Product | null,
  activeCategory: ProductCategory | 'all'
): string {
  const productContext = `

## CURRENT CONTEXT - LIVE PRODUCT DATA

**Active Category**: ${activeCategory === 'all' ? 'All Products' : activeCategory}
**Total Products Displayed**: ${currentProducts.length}

${selectedProduct ? `
**🎯 CURRENTLY SELECTED PRODUCT (User is viewing this now)**:
${formatProductForAI(selectedProduct)}

⚠️ IMPORTANT: When the user asks about "this product", "the current product", "this item", or "what I'm looking at", they are referring to the product above (ID: ${selectedProduct.id}, "${selectedProduct.title}").
` : '**No Product Currently Selected** - User is viewing the product grid.'}

**📦 AVAILABLE PRODUCTS IN CURRENT VIEW** (First 10 of ${currentProducts.length}):
${formatProductsForAI(currentProducts.slice(0, 10))}
${currentProducts.length > 10 ? `\n... and ${currentProducts.length - 10} more products available in this category` : ''}

## CRITICAL INSTRUCTIONS FOR PRODUCT INFORMATION

1. **EXACT PRODUCT DETAILS**: When describing products, use the EXACT information provided above:
   - Use the exact product title (in quotes above)
   - Use the exact price in Rupees (₹)
   - Use the exact description
   - Reference the exact rating and review count

2. **PRODUCT IDENTIFICATION**: 
   - When calling tools like updateCart, use the correct Product ID from the list above
   - Product IDs are unique identifiers (numbers)
   - Always verify the product ID matches what the user is asking about

3. **PRICE ACCURACY**: 
   - All prices are already converted to Indian Rupees (₹)
   - NEVER mention dollars ($)
   - Always say "Rupees" or use the ₹ symbol

4. **CURRENT SELECTION**: 
   ${selectedProduct 
     ? `The user is currently viewing "${selectedProduct.title}" (ID: ${selectedProduct.id}). This is the product they're asking about when they say "this" or "current product".`
     : 'No product is currently selected. Guide the user to select a product or browse the category.'
   }

5. **CATEGORY CONTEXT**: 
   - Currently showing: ${activeCategory === 'all' ? 'all products across all categories' : `only products in the "${activeCategory}" category`}
   - Available categories: electronics, jewelery, men's clothing, women's clothing

6. **PRODUCT DESCRIPTIONS**:
   - When asked about a product, provide its exact description from the data above
   - Mention key features from the description
   - Include the rating and review count for credibility

`;

  return basePrompt + productContext;
}

/**
 * Generate cart context for AI
 */
export function generateCartContext(
  items: Array<{ product: Product; quantity: number }>,
  subtotal: number
): string {
  if (items.length === 0) {
    return '\n**Shopping Cart**: Empty\n';
  }

  const itemsList = items.map(item => 
    `- ${item.product.title} (₹${(item.product.price * 83).toFixed(2)}) x ${item.quantity} = ₹${(item.product.price * 83 * item.quantity).toFixed(2)}`
  ).join('\n');

  return `
**Shopping Cart** (${items.length} ${items.length === 1 ? 'item' : 'items'}):
${itemsList}

**Subtotal**: ₹${(subtotal * 83).toFixed(2)}
`;
}
