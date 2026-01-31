'use client';

import { PokemonCard as PokemonCardType, TYPE_COLORS, TYPE_ICONS } from '@/types/pokemon';

interface PokemonCardProps {
  card: PokemonCardType;
  scale?: number;
}

export default function PokemonCard({ card, scale = 1 }: PokemonCardProps) {
  const typeColors = TYPE_COLORS[card.type];

  const stageLabel = {
    'basic': 'Basic',
    'stage-1': 'Stage 1',
    'stage-2': 'Stage 2',
    'mega': 'MEGA',
    'v': 'V',
    'vmax': 'VMAX',
    'vstar': 'VSTAR',
    'ex': 'ex',
    'gx': 'GX',
  }[card.stage];

  const raritySymbol = {
    'common': '●',
    'uncommon': '◆',
    'rare': '★',
    'holo-rare': '★',
    'ultra-rare': '★★',
    'secret-rare': '★★★',
  }[card.rarity];

  return (
    <div
      className="relative"
      style={{
        width: `${350 * scale}px`,
        height: `${490 * scale}px`,
        fontSize: `${14 * scale}px`
      }}
    >
      {/* Card Frame */}
      <div
        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${typeColors.gradient} p-2 shadow-2xl`}
      >
        {/* Inner Card */}
        <div className="h-full w-full rounded-lg bg-gradient-to-b from-yellow-100 to-yellow-50 p-2 flex flex-col">

          {/* Header: Stage, Name, HP, Type */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded"
                style={{ backgroundColor: typeColors.primary, color: 'white' }}
              >
                {stageLabel}
              </span>
              {card.evolvesFrom && (
                <span className="text-xs text-gray-600">
                  Evolves from {card.evolvesFrom}
                </span>
              )}
            </div>
          </div>

          {/* Name and HP Row */}
          <div className="flex items-center justify-between px-1 mb-1">
            <h2
              className="font-bold text-xl tracking-tight"
              style={{
                textShadow: '1px 1px 0 rgba(0,0,0,0.1)',
                fontSize: `${20 * scale}px`
              }}
            >
              {card.nickname || card.name}
            </h2>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-red-600" style={{ fontSize: `${18 * scale}px` }}>
                HP {card.hp}
              </span>
              <span className="text-xl" style={{ fontSize: `${22 * scale}px` }}>
                {TYPE_ICONS[card.type]}
              </span>
            </div>
          </div>

          {/* Image Area */}
          <div
            className="relative mx-1 rounded border-4 overflow-hidden"
            style={{
              height: `${150 * scale}px`,
              borderColor: typeColors.primary,
              backgroundColor: typeColors.secondary
            }}
          >
            {card.imageUrl ? (
              <img
                src={card.imageUrl}
                alt={card.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                <div className="text-4xl mb-1" style={{ fontSize: `${40 * scale}px` }}>
                  {TYPE_ICONS[card.type]}
                </div>
                {/* Image description shown when no image */}
                <p
                  className="text-xs text-gray-700 line-clamp-4 overflow-hidden"
                  style={{ fontSize: `${9 * scale}px` }}
                >
                  {card.imageDescription}
                </p>
              </div>
            )}
          </div>

          {/* Ability Section */}
          {card.ability && (
            <div
              className="mx-1 mt-2 p-2 rounded border-l-4"
              style={{
                borderColor: typeColors.primary,
                backgroundColor: 'rgba(255,255,255,0.7)'
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded text-white"
                  style={{ backgroundColor: '#E53E3E' }}
                >
                  Ability
                </span>
                <span className="font-bold" style={{ fontSize: `${14 * scale}px` }}>
                  {card.ability.name}
                </span>
              </div>
              <p className="text-xs text-gray-700" style={{ fontSize: `${11 * scale}px` }}>
                {card.ability.description}
              </p>
            </div>
          )}

          {/* Attacks Section */}
          <div className="flex-1 mx-1 mt-2 space-y-2 overflow-hidden">
            {card.attacks.map((attack, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-2 rounded"
                style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
              >
                {/* Energy Cost */}
                <div className="flex gap-0.5 flex-shrink-0">
                  {attack.energyCost.map((cost, costIndex) => (
                    Array(cost.amount).fill(0).map((_, i) => (
                      <span
                        key={`${costIndex}-${i}`}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs border border-gray-300"
                        style={{
                          backgroundColor: TYPE_COLORS[cost.type].primary,
                          fontSize: `${10 * scale}px`,
                          width: `${20 * scale}px`,
                          height: `${20 * scale}px`
                        }}
                      >
                        {TYPE_ICONS[cost.type]}
                      </span>
                    ))
                  ))}
                </div>

                {/* Attack Name and Description */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold" style={{ fontSize: `${14 * scale}px` }}>
                      {attack.name}
                    </span>
                    <span className="font-bold text-lg" style={{ fontSize: `${16 * scale}px` }}>
                      {attack.damage}
                    </span>
                  </div>
                  {attack.description && (
                    <p
                      className="text-xs text-gray-600 mt-0.5"
                      style={{ fontSize: `${10 * scale}px` }}
                    >
                      {attack.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Stats: Weakness, Resistance, Retreat */}
          <div
            className="mx-1 mt-2 flex justify-between items-center px-2 py-1 rounded text-xs"
            style={{
              backgroundColor: 'rgba(0,0,0,0.1)',
              fontSize: `${11 * scale}px`
            }}
          >
            <div className="flex items-center gap-1">
              <span className="text-gray-500">weakness</span>
              {card.weakness ? (
                <span className="flex items-center gap-0.5 font-bold">
                  {TYPE_ICONS[card.weakness.type]} {card.weakness.modifier}
                </span>
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500">resistance</span>
              {card.resistance ? (
                <span className="flex items-center gap-0.5 font-bold">
                  {TYPE_ICONS[card.resistance.type]} {card.resistance.modifier}
                </span>
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500">retreat</span>
              <span className="flex gap-0.5">
                {Array(card.retreatCost).fill(0).map((_, i) => (
                  <span key={i}>◎</span>
                ))}
                {card.retreatCost === 0 && <span className="text-gray-400">-</span>}
              </span>
            </div>
          </div>

          {/* Flavor Text */}
          {card.flavorText && (
            <div
              className="mx-1 mt-1 text-center italic text-xs text-gray-600 px-2"
              style={{ fontSize: `${10 * scale}px` }}
            >
              {card.flavorText}
            </div>
          )}

          {/* Footer: Card Info */}
          <div
            className="mt-1 flex justify-between items-center px-2 text-xs text-gray-500"
            style={{ fontSize: `${9 * scale}px` }}
          >
            <span>{card.setName || 'Custom Set'} {card.cardNumber || ''}</span>
            <span className="text-sm">{raritySymbol}</span>
            <span>Illus. {card.artist || 'AI Generated'}</span>
          </div>
        </div>
      </div>

      {/* Holographic effect for rare cards */}
      {(card.rarity === 'holo-rare' || card.rarity === 'ultra-rare' || card.rarity === 'secret-rare') && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
            animation: 'shimmer 3s infinite'
          }}
        />
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
