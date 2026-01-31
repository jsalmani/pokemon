'use client';

import { useState } from 'react';
import { PokemonType, CardStage, CardGenerationRequest } from '@/types/pokemon';
import { REFERENCE_POKEMON_NAMES } from '@/data/referencePokemon';

interface CardDesignerFormProps {
  onGenerate: (request: CardGenerationRequest) => void;
  isLoading: boolean;
}

export default function CardDesignerForm({ onGenerate, isLoading }: CardDesignerFormProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedReferences, setSelectedReferences] = useState<string[]>([]);
  const [preferredType, setPreferredType] = useState<PokemonType | ''>('');
  const [preferredStage, setPreferredStage] = useState<CardStage | ''>('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const request: CardGenerationRequest = {
      prompt: prompt.trim(),
      referencePokemons: selectedReferences.length > 0 ? selectedReferences : undefined,
      preferredType: preferredType || undefined,
      preferredStage: preferredStage || undefined,
    };

    onGenerate(request);
  };

  const toggleReference = (name: string) => {
    setSelectedReferences(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  const pokemonTypes: PokemonType[] = [
    'fire', 'water', 'grass', 'electric', 'psychic', 'fighting',
    'dark', 'steel', 'fairy', 'dragon', 'normal', 'colorless'
  ];

  const cardStages: CardStage[] = [
    'basic', 'stage-1', 'stage-2', 'mega', 'v', 'vmax', 'vstar', 'ex', 'gx'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Main Prompt */}
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
          Describe your Pokemon card
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Example: Create a powerful fire dragon Pokemon that has evolved from a small flame lizard. It should have a devastating fire attack and an ability related to increasing fire damage..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
          rows={4}
          disabled={isLoading}
        />
      </div>

      {/* Reference Pokemon Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Use as reference (optional)
        </label>
        <div className="flex flex-wrap gap-2">
          {REFERENCE_POKEMON_NAMES.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => toggleReference(name)}
              disabled={isLoading}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors capitalize ${
                selectedReferences.includes(name)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {name}
            </button>
          ))}
        </div>
        {selectedReferences.length > 0 && (
          <p className="mt-2 text-sm text-gray-500">
            Selected: {selectedReferences.join(', ')}
          </p>
        )}
      </div>

      {/* Advanced Options Toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
      >
        {showAdvanced ? '- Hide' : '+ Show'} advanced options
      </button>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          {/* Preferred Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Type
            </label>
            <select
              id="type"
              value={preferredType}
              onChange={(e) => setPreferredType(e.target.value as PokemonType | '')}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              <option value="">Auto-detect</option>
              {pokemonTypes.map((type) => (
                <option key={type} value={type} className="capitalize">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Preferred Stage */}
          <div>
            <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Stage
            </label>
            <select
              id="stage"
              value={preferredStage}
              onChange={(e) => setPreferredStage(e.target.value as CardStage | '')}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              <option value="">Auto-detect</option>
              {cardStages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!prompt.trim() || isLoading}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
          !prompt.trim() || isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Generating Card...
          </span>
        ) : (
          'Generate Pokemon Card'
        )}
      </button>

      {/* Tips */}
      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>Tips:</strong></p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>Be descriptive about the Pokemon's appearance and personality</li>
          <li>Mention specific attack types or abilities you want</li>
          <li>Reference existing Pokemon for style inspiration</li>
          <li>Specify if you want a powerful boss-type or a basic creature</li>
        </ul>
      </div>
    </form>
  );
}
