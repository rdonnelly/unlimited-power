import type { Aspect } from '@data/Aspect';

export const ASPECT_IMAGES: Record<Aspect, number> = {
  Aggression: require('@assets/icons/aspect/aggression.png'),
  Command: require('@assets/icons/aspect/command.png'),
  Cunning: require('@assets/icons/aspect/cunning.png'),
  Heroism: require('@assets/icons/aspect/heroism.png'),
  Vigilance: require('@assets/icons/aspect/vigilance.png'),
  Villainy: require('@assets/icons/aspect/villainy.png'),
} as const;
