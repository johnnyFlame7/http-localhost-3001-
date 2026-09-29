export const FREE_SHIPPING_THRESHOLD = 100;
export const STANDARD_SHIPPING = 8;

export function calculateShipping(subtotal: number): number {
  return subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
}
