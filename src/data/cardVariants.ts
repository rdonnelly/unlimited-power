import type { CardPrintingsResponse } from '@data/CardResponse';
import { type Variant, VariantRank } from '@data/Variant';

export function getCardVariants(data?: CardPrintingsResponse['data']) {
  const variants: Record<string, number> = {};
  if (data?.original) variants.Standard = data.original.id;
  [...(data?.printings ?? [])]
    .sort(
      (a, b) =>
        (VariantRank[a.variantTypes?.[0]?.name as Variant] ?? 9999) -
        (VariantRank[b.variantTypes?.[0]?.name as Variant] ?? 9999),
    )
    .forEach((printing) => {
      const name = printing.variantTypes?.[0]?.name;
      if (name && !name.includes('Foil')) variants[name] = printing.id;
    });
  return variants;
}
