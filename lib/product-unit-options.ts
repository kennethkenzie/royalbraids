export type ProductUnitOptionLike = {
  id?: number;
  label: string;
  unit: string;
  priceInCents: number;
  stock: number;
  sortOrder?: number;
};

type ProductWithUnitOptions = {
  priceInCents: number;
  stock: number;
  unit: string;
  unitOptions?: ProductUnitOptionLike[] | null;
};

export function getFallbackUnitOption(product: ProductWithUnitOptions): ProductUnitOptionLike {
  const fallbackLabel = product.unit?.trim() || "Default";

  return {
    label: fallbackLabel,
    unit: fallbackLabel,
    priceInCents: product.priceInCents,
    stock: product.stock,
    sortOrder: 0,
  };
}

export function getProductUnitOptions(product: ProductWithUnitOptions): ProductUnitOptionLike[] {
  if (product.unitOptions && product.unitOptions.length > 0) {
    return [...product.unitOptions].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  return [getFallbackUnitOption(product)];
}

export function getPrimaryUnitOption(product: ProductWithUnitOptions): ProductUnitOptionLike {
  return getProductUnitOptions(product)[0];
}
