import { PokemonCard } from '@/types/pokemon';

// Reference Pokemon cards for LLM to use as examples
export const REFERENCE_POKEMON: Record<string, PokemonCard> = {
  pikachu: {
    name: 'Pikachu',
    hp: 60,
    type: 'electric',
    stage: 'basic',
    imageDescription: 'A yellow mouse-like creature with red cheeks, pointy ears with black tips, and a lightning bolt-shaped tail',
    attacks: [
      {
        name: 'Thunder Jolt',
        damage: 30,
        description: 'Flip a coin. If tails, this Pokemon does 10 damage to itself.',
        energyCost: [{ type: 'electric', amount: 1 }]
      },
      {
        name: 'Electro Ball',
        damage: 60,
        energyCost: [{ type: 'electric', amount: 2 }, { type: 'colorless', amount: 1 }]
      }
    ],
    weakness: { type: 'fighting', modifier: '×2' },
    retreatCost: 1,
    rarity: 'common',
    flavorText: 'When several of these Pokemon gather, their electricity can cause lightning storms.'
  },

  charizard: {
    name: 'Charizard',
    hp: 180,
    type: 'fire',
    stage: 'stage-2',
    evolvesFrom: 'Charmeleon',
    imageDescription: 'A large orange dragon-like creature with wings, a flame burning at the tip of its tail, and fierce eyes',
    ability: {
      name: 'Blaze',
      description: 'When this Pokemon has 60 HP or less remaining, its Fire-type attacks do 50 more damage.'
    },
    attacks: [
      {
        name: 'Fire Spin',
        damage: 150,
        description: 'Discard 2 Energy attached to this Pokemon.',
        energyCost: [{ type: 'fire', amount: 3 }, { type: 'colorless', amount: 1 }]
      }
    ],
    weakness: { type: 'water', modifier: '×2' },
    retreatCost: 3,
    rarity: 'holo-rare',
    flavorText: 'It spits fire that is hot enough to melt boulders. It may cause forest fires by blowing flames.'
  },

  blastoise: {
    name: 'Blastoise',
    hp: 160,
    type: 'water',
    stage: 'stage-2',
    evolvesFrom: 'Wartortle',
    imageDescription: 'A large blue turtle with water cannons protruding from its shell, standing on two legs',
    ability: {
      name: 'Torrent',
      description: 'Once during your turn, you may attach a Water Energy from your hand to one of your Pokemon.'
    },
    attacks: [
      {
        name: 'Hydro Pump',
        damage: '120+',
        description: 'This attack does 30 more damage for each Water Energy attached to this Pokemon.',
        energyCost: [{ type: 'water', amount: 3 }]
      }
    ],
    weakness: { type: 'electric', modifier: '×2' },
    resistance: { type: 'fire', modifier: '-30' },
    retreatCost: 3,
    rarity: 'holo-rare',
    flavorText: 'The jets of water it spouts from the rocket cannons on its shell can punch through thick steel.'
  },

  venusaur: {
    name: 'Venusaur',
    hp: 160,
    type: 'grass',
    stage: 'stage-2',
    evolvesFrom: 'Ivysaur',
    imageDescription: 'A large toad-like creature with a massive flower blooming on its back, with thick vines',
    ability: {
      name: 'Overgrow',
      description: 'Your Grass Pokemon take 30 less damage from attacks.'
    },
    attacks: [
      {
        name: 'Solar Beam',
        damage: 130,
        energyCost: [{ type: 'grass', amount: 3 }, { type: 'colorless', amount: 1 }]
      }
    ],
    weakness: { type: 'fire', modifier: '×2' },
    retreatCost: 4,
    rarity: 'holo-rare',
    flavorText: 'The plant blooms when it is absorbing solar energy. It stays on the move to seek sunlight.'
  },

  mewtwo: {
    name: 'Mewtwo',
    hp: 150,
    type: 'psychic',
    stage: 'basic',
    imageDescription: 'A humanoid feline creature with a purple tail, glowing purple eyes, and a powerful psychic aura',
    ability: {
      name: 'Pressure',
      description: 'Attacks from your opponent\'s Pokemon cost 1 more Energy.'
    },
    attacks: [
      {
        name: 'Psystrike',
        damage: 120,
        description: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokemon.',
        energyCost: [{ type: 'psychic', amount: 2 }, { type: 'colorless', amount: 1 }]
      }
    ],
    weakness: { type: 'dark', modifier: '×2' },
    retreatCost: 2,
    rarity: 'ultra-rare',
    flavorText: 'A Pokemon created by recombining Mew\'s genes. It\'s said to have the most savage heart among Pokemon.'
  },

  gengar: {
    name: 'Gengar',
    hp: 130,
    type: 'psychic',
    stage: 'stage-2',
    evolvesFrom: 'Haunter',
    imageDescription: 'A purple ghost Pokemon with a sinister grin, red eyes, and a spiky silhouette',
    ability: {
      name: 'Cursed Body',
      description: 'When this Pokemon is damaged by an attack, flip a coin. If heads, the Attacking Pokemon is now Paralyzed.'
    },
    attacks: [
      {
        name: 'Shadow Ball',
        damage: 100,
        description: 'Discard an Energy from your opponent\'s Active Pokemon.',
        energyCost: [{ type: 'psychic', amount: 2 }]
      }
    ],
    weakness: { type: 'dark', modifier: '×2' },
    resistance: { type: 'fighting', modifier: '-30' },
    retreatCost: 0,
    rarity: 'holo-rare',
    flavorText: 'It hides in shadows. It is said that if Gengar is hiding, it cools the area by nearly 10 degrees.'
  },

  dragonite: {
    name: 'Dragonite',
    hp: 170,
    type: 'dragon',
    stage: 'stage-2',
    evolvesFrom: 'Dragonair',
    imageDescription: 'A large orange dragon with small wings, a friendly face, and antennae on its head',
    attacks: [
      {
        name: 'Dragon Claw',
        damage: 80,
        energyCost: [{ type: 'water', amount: 1 }, { type: 'electric', amount: 1 }]
      },
      {
        name: 'Hyper Beam',
        damage: 160,
        description: 'Discard an Energy from this Pokemon.',
        energyCost: [{ type: 'water', amount: 2 }, { type: 'electric', amount: 2 }]
      }
    ],
    weakness: { type: 'fairy', modifier: '×2' },
    retreatCost: 2,
    rarity: 'holo-rare',
    flavorText: 'It is said to make its home somewhere in the sea. It guides crews of shipwrecks to shore.'
  },

  lucario: {
    name: 'Lucario',
    hp: 120,
    type: 'fighting',
    stage: 'stage-1',
    evolvesFrom: 'Riolu',
    imageDescription: 'A blue and black jackal-like Pokemon with spike on its paws and chest, standing in a fighting stance',
    ability: {
      name: 'Aura Sense',
      description: 'Once during your turn, you may look at your opponent\'s hand.'
    },
    attacks: [
      {
        name: 'Aura Sphere',
        damage: 80,
        description: 'This attack does 20 damage to one of your opponent\'s Benched Pokemon.',
        energyCost: [{ type: 'fighting', amount: 2 }]
      }
    ],
    weakness: { type: 'psychic', modifier: '×2' },
    retreatCost: 1,
    rarity: 'rare',
    flavorText: 'By catching the aura emanating from others, it can read their thoughts and movements.'
  },

  eevee: {
    name: 'Eevee',
    hp: 60,
    type: 'colorless',
    stage: 'basic',
    imageDescription: 'A small brown fox-like Pokemon with a fluffy cream-colored mane and a bushy tail',
    attacks: [
      {
        name: 'Tackle',
        damage: 20,
        energyCost: [{ type: 'colorless', amount: 1 }]
      },
      {
        name: 'Quick Draw',
        damage: 0,
        description: 'Flip a coin. If heads, draw a card.',
        energyCost: [{ type: 'colorless', amount: 1 }]
      }
    ],
    weakness: { type: 'fighting', modifier: '×2' },
    retreatCost: 1,
    rarity: 'common',
    flavorText: 'Its genetic code is irregular. It may mutate if exposed to radiation from element stones.'
  },

  snorlax: {
    name: 'Snorlax',
    hp: 150,
    type: 'colorless',
    stage: 'basic',
    imageDescription: 'A very large, round, blue-green Pokemon with a cream belly, sleeping peacefully',
    ability: {
      name: 'Block',
      description: 'Your opponent\'s Active Pokemon can\'t retreat.'
    },
    attacks: [
      {
        name: 'Body Slam',
        damage: 100,
        description: 'Flip a coin. If heads, your opponent\'s Active Pokemon is now Paralyzed.',
        energyCost: [{ type: 'colorless', amount: 4 }]
      }
    ],
    weakness: { type: 'fighting', modifier: '×2' },
    retreatCost: 4,
    rarity: 'rare',
    flavorText: 'It is not satisfied unless it eats over 880 pounds of food every day. When it is done eating, it goes promptly to sleep.'
  }
};

// Get all reference Pokemon names
export const REFERENCE_POKEMON_NAMES = Object.keys(REFERENCE_POKEMON);

// Get reference Pokemon by name
export function getReferencePokemon(name: string): PokemonCard | undefined {
  return REFERENCE_POKEMON[name.toLowerCase()];
}

// Get multiple reference Pokemon by names
export function getReferencePokemonList(names: string[]): PokemonCard[] {
  return names
    .map(name => getReferencePokemon(name))
    .filter((pokemon): pokemon is PokemonCard => pokemon !== undefined);
}
