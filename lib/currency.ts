/**
 * Currency utilities for converting USD to INR
 */

const USD_TO_INR_RATE = 83; // Approximate conversion rate

export function convertToINR(usdPrice: number): number {
  return Math.round(usdPrice * USD_TO_INR_RATE);
}

export function formatINR(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}

export function formatPrice(usdPrice: number): string {
  const inr = convertToINR(usdPrice);
  return formatINR(inr);
}
