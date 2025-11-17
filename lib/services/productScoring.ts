/**
 * Calculate product performance score
 * Future implementation: analyze conversion rates, revenue, trends
 */
export function calculateProductScore(
  salesCount: number,
  conversionRate: number,
  price: number
): number {
  const score = salesCount * 0.5 + conversionRate * 100 * 0.3 + price * 0.2;
  return Math.round(score * 100) / 100;
}

/**
 * Rank products by performance
 */
export function rankProducts(products: any[]): any[] {
  return products.sort((a, b) => {
    const scoreA = calculateProductScore(
      a.sales_count || 0,
      a.conversion_rate || 0,
      a.price || 0
    );
    const scoreB = calculateProductScore(
      b.sales_count || 0,
      b.conversion_rate || 0,
      b.price || 0
    );
    return scoreB - scoreA;
  });
}
