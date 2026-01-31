import { NextRequest, NextResponse } from 'next/server';
import { PokemonCard, CardGenerationRequest } from '@/types/pokemon';
import { getReferencePokemonList, REFERENCE_POKEMON } from '@/data/referencePokemon';

// System prompt for generating Pokemon cards
const SYSTEM_PROMPT = `You are a Pokemon card designer AI. Your job is to create custom Pokemon cards following the standard Pokemon Trading Card Game format.

When creating a card, you must output a valid JSON object with the following structure:
{
  "name": "string - The Pokemon's name",
  "hp": "number - Hit points (typically 30-340 based on stage)",
  "type": "string - One of: fire, water, grass, electric, psychic, fighting, dark, steel, fairy, dragon, normal, colorless",
  "stage": "string - One of: basic, stage-1, stage-2, mega, v, vmax, vstar, ex, gx",
  "evolvesFrom": "string or null - Previous evolution if not basic",
  "imageDescription": "string - Detailed visual description for the Pokemon artwork",
  "ability": {
    "name": "string",
    "description": "string"
  } or null,
  "attacks": [
    {
      "name": "string",
      "damage": "number or string like '30+' for variable damage",
      "description": "string or null - Effect description",
      "energyCost": [
        { "type": "string - energy type", "amount": "number" }
      ]
    }
  ],
  "weakness": { "type": "string", "modifier": "string like '×2'" } or null,
  "resistance": { "type": "string", "modifier": "string like '-30'" } or null,
  "retreatCost": "number - 0 to 5",
  "rarity": "string - One of: common, uncommon, rare, holo-rare, ultra-rare, secret-rare",
  "flavorText": "string - Pokedex-style description"
}

Guidelines:
- HP should scale with stage: Basic (30-80), Stage 1 (70-120), Stage 2 (100-180), V/EX/GX (170-230), VMAX (300-340)
- Attack damage should be balanced with energy cost
- Include thematic abilities for rare cards
- Create imaginative but coherent Pokemon designs
- Weaknesses typically follow the type chart (Fire weak to Water, etc.)
- Energy costs should be 1-4 total energy for most attacks
- Make the imageDescription vivid and detailed for potential artwork generation`;

export async function POST(request: NextRequest) {
  try {
    const body: CardGenerationRequest = await request.json();
    const { prompt, referencePokemons, preferredType, preferredStage } = body;

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Get reference Pokemon data if specified
    let referenceContext = '';
    if (referencePokemons && referencePokemons.length > 0) {
      const references = getReferencePokemonList(referencePokemons);
      if (references.length > 0) {
        referenceContext = `\n\nUse these existing Pokemon as style references:\n${JSON.stringify(references, null, 2)}`;
      }
    }

    // Build the user prompt
    let userPrompt = `Create a custom Pokemon card based on this description: ${prompt}`;

    if (preferredType) {
      userPrompt += `\n\nPreferred type: ${preferredType}`;
    }

    if (preferredStage) {
      userPrompt += `\n\nPreferred stage: ${preferredStage}`;
    }

    userPrompt += referenceContext;
    userPrompt += '\n\nRespond with ONLY the JSON object, no additional text or markdown formatting.';

    // Check for API key
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    let generatedCard: PokemonCard;

    if (anthropicApiKey) {
      // Use Anthropic Claude API
      generatedCard = await generateWithAnthropic(anthropicApiKey, userPrompt);
    } else if (openaiApiKey) {
      // Use OpenAI API
      generatedCard = await generateWithOpenAI(openaiApiKey, userPrompt);
    } else {
      // Fallback to mock generation for demo purposes
      generatedCard = generateMockCard(prompt, preferredType, preferredStage);
    }

    return NextResponse.json({
      card: generatedCard,
      reasoning: 'Card generated successfully based on your description.'
    });

  } catch (error) {
    console.error('Card generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate card. Please try again.' },
      { status: 500 }
    );
  }
}

async function generateWithAnthropic(apiKey: string, userPrompt: string): Promise<PokemonCard> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.content[0].text;

  // Parse the JSON from the response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse card JSON from response');
  }

  return JSON.parse(jsonMatch[0]) as PokemonCard;
}

async function generateWithOpenAI(apiKey: string, userPrompt: string): Promise<PokemonCard> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  // Parse the JSON from the response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse card JSON from response');
  }

  return JSON.parse(jsonMatch[0]) as PokemonCard;
}

// Mock card generation for demo without API keys
function generateMockCard(
  prompt: string,
  preferredType?: string,
  preferredStage?: string
): PokemonCard {
  // Extract keywords from prompt to generate a themed card
  const promptLower = prompt.toLowerCase();

  // Determine type from prompt or use preferred
  let type: PokemonCard['type'] = (preferredType as PokemonCard['type']) || 'fire';
  if (!preferredType) {
    if (promptLower.includes('fire') || promptLower.includes('flame') || promptLower.includes('burn')) type = 'fire';
    else if (promptLower.includes('water') || promptLower.includes('ocean') || promptLower.includes('sea')) type = 'water';
    else if (promptLower.includes('grass') || promptLower.includes('plant') || promptLower.includes('leaf')) type = 'grass';
    else if (promptLower.includes('electric') || promptLower.includes('thunder') || promptLower.includes('lightning')) type = 'electric';
    else if (promptLower.includes('psychic') || promptLower.includes('mind') || promptLower.includes('mental')) type = 'psychic';
    else if (promptLower.includes('dragon')) type = 'dragon';
    else if (promptLower.includes('dark') || promptLower.includes('shadow')) type = 'dark';
    else if (promptLower.includes('steel') || promptLower.includes('metal')) type = 'steel';
    else if (promptLower.includes('fairy') || promptLower.includes('magic')) type = 'fairy';
    else if (promptLower.includes('fight') || promptLower.includes('martial')) type = 'fighting';
  }

  // Determine stage
  let stage: PokemonCard['stage'] = (preferredStage as PokemonCard['stage']) || 'basic';
  if (!preferredStage) {
    if (promptLower.includes('mega') || promptLower.includes('ultimate')) stage = 'mega';
    else if (promptLower.includes('evolved') || promptLower.includes('stage 2')) stage = 'stage-2';
    else if (promptLower.includes('stage 1')) stage = 'stage-1';
    else if (promptLower.includes('powerful') || promptLower.includes('legendary')) stage = 'v';
  }

  // Generate HP based on stage
  const hpRanges: Record<string, [number, number]> = {
    'basic': [50, 80],
    'stage-1': [80, 110],
    'stage-2': [120, 160],
    'v': [200, 230],
    'vmax': [310, 340],
    'mega': [220, 250],
    'ex': [180, 210],
    'gx': [190, 220],
    'vstar': [260, 280],
  };
  const [minHp, maxHp] = hpRanges[stage] || [60, 100];
  const hp = Math.floor(Math.random() * (maxHp - minHp + 1)) + minHp;

  // Generate a name based on the prompt
  const words = prompt.split(' ').filter(w => w.length > 3);
  const baseName = words[0] ? words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase() : 'Mysteon';
  const suffixes = ['eon', 'us', 'ix', 'ara', 'don', 'zor', 'chu', 'saur'];
  const name = baseName + suffixes[Math.floor(Math.random() * suffixes.length)];

  // Type-based weakness mapping
  const weaknessMap: Record<string, PokemonCard['type']> = {
    fire: 'water',
    water: 'electric',
    grass: 'fire',
    electric: 'fighting',
    psychic: 'dark',
    fighting: 'psychic',
    dark: 'fighting',
    steel: 'fire',
    fairy: 'steel',
    dragon: 'fairy',
    normal: 'fighting',
    colorless: 'fighting',
  };

  // Generate attacks based on type
  const attackNames: Record<string, string[]> = {
    fire: ['Flame Burst', 'Inferno Strike', 'Fire Spin', 'Blazing Tackle'],
    water: ['Aqua Jet', 'Hydro Pump', 'Tidal Wave', 'Water Pulse'],
    grass: ['Leaf Storm', 'Solar Beam', 'Vine Whip', 'Petal Dance'],
    electric: ['Thunder Shock', 'Volt Tackle', 'Spark', 'Lightning Strike'],
    psychic: ['Psybeam', 'Mind Blast', 'Psychic', 'Future Sight'],
    fighting: ['Karate Chop', 'Dynamic Punch', 'Close Combat', 'Aura Sphere'],
    dark: ['Dark Pulse', 'Shadow Strike', 'Night Slash', 'Foul Play'],
    steel: ['Metal Claw', 'Iron Head', 'Steel Wing', 'Flash Cannon'],
    fairy: ['Moonblast', 'Dazzling Gleam', 'Play Rough', 'Fairy Wind'],
    dragon: ['Dragon Claw', 'Outrage', 'Dragon Breath', 'Draco Meteor'],
    normal: ['Tackle', 'Body Slam', 'Hyper Beam', 'Swift'],
    colorless: ['Quick Attack', 'Slash', 'Take Down', 'Double Hit'],
  };

  const typeAttacks = attackNames[type] || attackNames.normal;

  const card: PokemonCard = {
    name,
    hp,
    type,
    stage,
    imageDescription: `A ${type}-type Pokemon inspired by: ${prompt}. It has a powerful presence with ${type}-themed features and markings.`,
    ability: Math.random() > 0.5 ? {
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Aura`,
      description: `Once during your turn, you may attach a ${type.charAt(0).toUpperCase() + type.slice(1)} Energy from your discard pile to one of your ${type.charAt(0).toUpperCase() + type.slice(1)} Pokemon.`
    } : undefined,
    attacks: [
      {
        name: typeAttacks[Math.floor(Math.random() * typeAttacks.length)],
        damage: stage === 'basic' ? 30 : stage === 'stage-1' ? 60 : 90,
        energyCost: [{ type, amount: stage === 'basic' ? 1 : 2 }]
      },
      {
        name: typeAttacks[Math.floor(Math.random() * typeAttacks.length)],
        damage: stage === 'basic' ? 50 : stage === 'stage-1' ? 90 : 150,
        description: 'This attack does 10 more damage for each Energy attached to this Pokemon.',
        energyCost: [{ type, amount: 2 }, { type: 'colorless', amount: 1 }]
      }
    ],
    weakness: { type: weaknessMap[type], modifier: '×2' },
    retreatCost: stage === 'basic' ? 1 : stage === 'stage-1' ? 2 : 3,
    rarity: stage === 'basic' ? 'common' : stage === 'stage-1' ? 'uncommon' : 'rare',
    flavorText: `This mysterious Pokemon was born from the essence of ${type}. Legends say it appears when ${prompt.slice(0, 50)}...`,
    isCustom: true,
    createdAt: new Date()
  };

  return card;
}
