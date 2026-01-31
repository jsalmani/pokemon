// Pokemon card types following standard TCG format

export type PokemonType =
  | 'fire'
  | 'water'
  | 'grass'
  | 'electric'
  | 'psychic'
  | 'fighting'
  | 'dark'
  | 'steel'
  | 'fairy'
  | 'dragon'
  | 'normal'
  | 'colorless';

export type CardRarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'holo-rare'
  | 'ultra-rare'
  | 'secret-rare';

export type CardStage =
  | 'basic'
  | 'stage-1'
  | 'stage-2'
  | 'mega'
  | 'v'
  | 'vmax'
  | 'vstar'
  | 'ex'
  | 'gx';

export interface AttackEnergyCost {
  type: PokemonType;
  amount: number;
}

export interface Attack {
  name: string;
  damage: number | string; // Can be "30+" or "×" based effects
  description?: string;
  energyCost: AttackEnergyCost[];
}

export interface Ability {
  name: string;
  description: string;
}

export interface WeaknessResistance {
  type: PokemonType;
  modifier: string; // e.g., "×2" or "-30"
}

export interface PokemonCard {
  // Basic Info
  name: string;
  nickname?: string; // Custom name for the pokemon
  hp: number;
  type: PokemonType;
  stage: CardStage;
  evolvesFrom?: string;

  // Visual
  imageDescription: string; // Description for the pokemon artwork
  imageUrl?: string; // Optional generated/provided image URL
  backgroundColor?: string; // Override type-based color

  // Gameplay
  ability?: Ability;
  attacks: Attack[];
  weakness?: WeaknessResistance;
  resistance?: WeaknessResistance;
  retreatCost: number;

  // Card Meta
  rarity: CardRarity;
  cardNumber?: string;
  setName?: string;
  artist?: string;
  flavorText?: string;

  // Custom fields
  isCustom?: boolean;
  createdAt?: Date;
}

export interface CardGenerationRequest {
  prompt: string;
  referencePokemons?: string[]; // Names of pokemon to use as reference
  preferredType?: PokemonType;
  preferredStage?: CardStage;
}

export interface CardGenerationResponse {
  card: PokemonCard;
  reasoning?: string;
}

// Type colors for card backgrounds
export const TYPE_COLORS: Record<PokemonType, { primary: string; secondary: string; gradient: string }> = {
  fire: {
    primary: '#F08030',
    secondary: '#F5AC78',
    gradient: 'from-orange-500 to-red-600'
  },
  water: {
    primary: '#6890F0',
    secondary: '#9DB7F5',
    gradient: 'from-blue-400 to-blue-600'
  },
  grass: {
    primary: '#78C850',
    secondary: '#A7DB8D',
    gradient: 'from-green-400 to-green-600'
  },
  electric: {
    primary: '#F8D030',
    secondary: '#FAE078',
    gradient: 'from-yellow-300 to-yellow-500'
  },
  psychic: {
    primary: '#F85888',
    secondary: '#FA92B2',
    gradient: 'from-pink-400 to-purple-500'
  },
  fighting: {
    primary: '#C03028',
    secondary: '#D67873',
    gradient: 'from-orange-600 to-red-700'
  },
  dark: {
    primary: '#705848',
    secondary: '#A29288',
    gradient: 'from-gray-700 to-gray-900'
  },
  steel: {
    primary: '#B8B8D0',
    secondary: '#D1D1E0',
    gradient: 'from-gray-400 to-slate-500'
  },
  fairy: {
    primary: '#EE99AC',
    secondary: '#F4BDC9',
    gradient: 'from-pink-300 to-pink-500'
  },
  dragon: {
    primary: '#7038F8',
    secondary: '#A27DFA',
    gradient: 'from-indigo-500 to-purple-700'
  },
  normal: {
    primary: '#A8A878',
    secondary: '#C6C6A7',
    gradient: 'from-gray-300 to-gray-500'
  },
  colorless: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    gradient: 'from-gray-100 to-gray-300'
  },
};

// Type icons (emoji representation for simplicity)
export const TYPE_ICONS: Record<PokemonType, string> = {
  fire: '🔥',
  water: '💧',
  grass: '🌿',
  electric: '⚡',
  psychic: '🔮',
  fighting: '👊',
  dark: '🌙',
  steel: '⚙️',
  fairy: '✨',
  dragon: '🐉',
  normal: '⭐',
  colorless: '◎',
};
