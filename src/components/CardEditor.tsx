'use client';

import { useState } from 'react';
import { PokemonCard, PokemonType, CardStage, CardRarity, Attack, TYPE_ICONS } from '@/types/pokemon';

interface CardEditorProps {
  card: PokemonCard;
  onUpdate: (card: PokemonCard) => void;
  onClose: () => void;
}

export default function CardEditor({ card, onUpdate, onClose }: CardEditorProps) {
  const [editedCard, setEditedCard] = useState<PokemonCard>({ ...card });

  const pokemonTypes: PokemonType[] = [
    'fire', 'water', 'grass', 'electric', 'psychic', 'fighting',
    'dark', 'steel', 'fairy', 'dragon', 'normal', 'colorless'
  ];

  const cardStages: CardStage[] = [
    'basic', 'stage-1', 'stage-2', 'mega', 'v', 'vmax', 'vstar', 'ex', 'gx'
  ];

  const rarities: CardRarity[] = [
    'common', 'uncommon', 'rare', 'holo-rare', 'ultra-rare', 'secret-rare'
  ];

  const updateField = <K extends keyof PokemonCard>(field: K, value: PokemonCard[K]) => {
    setEditedCard(prev => ({ ...prev, [field]: value }));
  };

  const updateAttack = (index: number, field: keyof Attack, value: unknown) => {
    const newAttacks = [...editedCard.attacks];
    newAttacks[index] = { ...newAttacks[index], [field]: value };
    setEditedCard(prev => ({ ...prev, attacks: newAttacks }));
  };

  const addAttack = () => {
    const newAttack: Attack = {
      name: 'New Attack',
      damage: 30,
      energyCost: [{ type: editedCard.type, amount: 1 }]
    };
    setEditedCard(prev => ({ ...prev, attacks: [...prev.attacks, newAttack] }));
  };

  const removeAttack = (index: number) => {
    setEditedCard(prev => ({
      ...prev,
      attacks: prev.attacks.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onUpdate(editedCard);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Card</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            x
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Info</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editedCard.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nickname</label>
                <input
                  type="text"
                  value={editedCard.nickname || ''}
                  onChange={(e) => updateField('nickname', e.target.value || undefined)}
                  placeholder="Optional display name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HP</label>
                <input
                  type="number"
                  value={editedCard.hp}
                  onChange={(e) => updateField('hp', parseInt(e.target.value) || 0)}
                  min="10"
                  max="400"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={editedCard.type}
                  onChange={(e) => updateField('type', e.target.value as PokemonType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                >
                  {pokemonTypes.map((type) => (
                    <option key={type} value={type}>
                      {TYPE_ICONS[type]} {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                <select
                  value={editedCard.stage}
                  onChange={(e) => updateField('stage', e.target.value as CardStage)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                >
                  {cardStages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rarity</label>
                <select
                  value={editedCard.rarity}
                  onChange={(e) => updateField('rarity', e.target.value as CardRarity)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                >
                  {rarities.map((rarity) => (
                    <option key={rarity} value={rarity}>
                      {rarity.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Image Description */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Appearance</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image Description</label>
              <textarea
                value={editedCard.imageDescription}
                onChange={(e) => updateField('imageDescription', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                rows={3}
              />
            </div>
          </section>

          {/* Ability */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Ability</h3>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="hasAbility"
                checked={!!editedCard.ability}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateField('ability', { name: 'New Ability', description: 'Ability description' });
                  } else {
                    updateField('ability', undefined);
                  }
                }}
                className="w-4 h-4"
              />
              <label htmlFor="hasAbility" className="text-sm text-gray-700">Has ability</label>
            </div>
            {editedCard.ability && (
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ability Name</label>
                  <input
                    type="text"
                    value={editedCard.ability.name}
                    onChange={(e) => updateField('ability', { ...editedCard.ability!, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ability Description</label>
                  <textarea
                    value={editedCard.ability.description}
                    onChange={(e) => updateField('ability', { ...editedCard.ability!, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    rows={2}
                  />
                </div>
              </div>
            )}
          </section>

          {/* Attacks */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Attacks</h3>
              <button
                onClick={addAttack}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
              >
                + Add Attack
              </button>
            </div>
            <div className="space-y-4">
              {editedCard.attacks.map((attack, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-gray-600">Attack {index + 1}</span>
                    {editedCard.attacks.length > 1 && (
                      <button
                        onClick={() => removeAttack(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={attack.name}
                        onChange={(e) => updateAttack(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Damage</label>
                      <input
                        type="text"
                        value={attack.damage}
                        onChange={(e) => updateAttack(index, 'damage', e.target.value)}
                        placeholder="e.g., 60 or 30+"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                      <input
                        type="text"
                        value={attack.description || ''}
                        onChange={(e) => updateAttack(index, 'description', e.target.value || undefined)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Stats */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Stats</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weakness Type</label>
                <select
                  value={editedCard.weakness?.type || ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      updateField('weakness', { type: e.target.value as PokemonType, modifier: '×2' });
                    } else {
                      updateField('weakness', undefined);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                >
                  <option value="">None</option>
                  {pokemonTypes.map((type) => (
                    <option key={type} value={type}>
                      {TYPE_ICONS[type]} {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resistance Type</label>
                <select
                  value={editedCard.resistance?.type || ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      updateField('resistance', { type: e.target.value as PokemonType, modifier: '-30' });
                    } else {
                      updateField('resistance', undefined);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                >
                  <option value="">None</option>
                  {pokemonTypes.map((type) => (
                    <option key={type} value={type}>
                      {TYPE_ICONS[type]} {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Retreat Cost</label>
                <input
                  type="number"
                  value={editedCard.retreatCost}
                  onChange={(e) => updateField('retreatCost', parseInt(e.target.value) || 0)}
                  min="0"
                  max="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
            </div>
          </section>

          {/* Flavor Text */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Flavor Text</h3>
            <textarea
              value={editedCard.flavorText || ''}
              onChange={(e) => updateField('flavorText', e.target.value || undefined)}
              placeholder="Optional pokedex-style description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
              rows={2}
            />
          </section>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-6 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
