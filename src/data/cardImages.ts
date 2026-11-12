import type { BaseCardAttributes } from '@data/Card';

export function getCardImages(
  selected: BaseCardAttributes | undefined,
  standard: BaseCardAttributes | undefined,
  maxWidth: number,
) {
  const art = (['artFront', 'artBack'] as const)
    .map((side) =>
      selected?.[side]?.data?.attributes ? selected[side] : standard?.[side],
    )
    .filter((image) => {
      const attributes = image?.data?.attributes;
      return attributes && attributes.width > 0 && attributes.height > 0;
    });
  const ratio = Math.min(
    1,
    ...art.map(
      (image) => Math.max(1, maxWidth) / image!.data!.attributes.width,
    ),
  );
  return art.map((image) => ({
    art: image,
    width: image!.data!.attributes.width * ratio,
    height: image!.data!.attributes.height * ratio,
  }));
}
