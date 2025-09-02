import type { Rarity } from '@data/Rarity';

export const RARITY_IMAGES: Record<Rarity, number> = {
  Common: require('@assets/icons/rarity/common.png'),
  Legendary: require('@assets/icons/rarity/legendary.png'),
  Rare: require('@assets/icons/rarity/rare.png'),
  Special: require('@assets/icons/rarity/special.png'),
  Uncommon: require('@assets/icons/rarity/uncommon.png'),
} as const;
