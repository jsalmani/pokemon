'use client';

import { useState } from 'react';
import PokemonCard from '@/components/PokemonCard';
import CardDesignerForm from '@/components/CardDesignerForm';
import CardEditor from '@/components/CardEditor';
import { PokemonCard as PokemonCardType, CardGenerationRequest, CardGenerationResponse } from '@/types/pokemon';
import { REFERENCE_POKEMON } from '@/data/referencePokemon';

export default function Home() {
  const [generatedCard, setGeneratedCard] = useState<PokemonCardType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [cardHistory, setCardHistory] = useState<PokemonCardType[]>([]);
  const [showExamples, setShowExamples] = useState(false);

  const handleGenerate = async (request: CardGenerationRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to generate card');
      }

      const data: CardGenerationResponse = await response.json();
      setGeneratedCard(data.card);

      // Add to history
      setCardHistory(prev => [data.card, ...prev].slice(0, 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCard = (updatedCard: PokemonCardType) => {
    setGeneratedCard(updatedCard);
    // Update in history
    setCardHistory(prev =>
      prev.map((card, index) => (index === 0 ? updatedCard : card))
    );
  };

  const handleSelectFromHistory = (card: PokemonCardType) => {
    setGeneratedCard(card);
  };

  const handleShowExample = (name: string) => {
    const exampleCard = REFERENCE_POKEMON[name];
    if (exampleCard) {
      setGeneratedCard(exampleCard);
    }
  };

  const handleGenerateImage = async () => {
    if (!generatedCard) return;

    setIsGeneratingImage(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageDescription: generatedCard.imageDescription,
          pokemonName: generatedCard.name,
          pokemonType: generatedCard.type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();

      // Update the card with the generated image
      const updatedCard = { ...generatedCard, imageUrl: data.imageUrl };
      setGeneratedCard(updatedCard);

      // Update in history
      setCardHistory(prev =>
        prev.map((card) => (card.name === generatedCard.name ? updatedCard : card))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">&#x1F0CF;</span>
              <div>
                <h1 className="text-2xl font-bold text-white">Pokemon Card Designer</h1>
                <p className="text-sm text-purple-200">Create custom cards with AI</p>
              </div>
            </div>
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
            >
              {showExamples ? 'Hide Examples' : 'View Example Cards'}
            </button>
          </div>
        </div>
      </header>

      {/* Example Cards Drawer */}
      {showExamples && (
        <div className="bg-black/40 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h3 className="text-white font-semibold mb-3">Example Cards (click to preview)</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {Object.keys(REFERENCE_POKEMON).map((name) => (
                <button
                  key={name}
                  onClick={() => handleShowExample(name)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm capitalize whitespace-nowrap transition-colors"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Form */}
          <div className="space-y-6">
            {/* Designer Form */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Design Your Card</h2>
              <CardDesignerForm onGenerate={handleGenerate} isLoading={isLoading} />
            </div>

            {/* Card History */}
            {cardHistory.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-3">Recent Cards</h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {cardHistory.map((card, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectFromHistory(card)}
                      className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm transition-colors ${
                        generatedCard === card
                          ? 'bg-white text-purple-900'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {card.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Card Preview */}
          <div className="flex flex-col items-center space-y-6">
            {/* Error Message */}
            {error && (
              <div className="w-full bg-red-500/20 border border-red-500 rounded-lg p-4">
                <p className="text-red-200">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                <p className="text-white text-lg">Designing your card...</p>
              </div>
            )}

            {/* Card Display */}
            {!isLoading && generatedCard && (
              <>
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <PokemonCard card={generatedCard} scale={1.1} />
                </div>

                {/* Card Actions */}
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      isGeneratingImage
                        ? 'bg-green-400 text-white cursor-wait'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {isGeneratingImage ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                        Generating...
                      </span>
                    ) : (
                      'Generate Image'
                    )}
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-white text-purple-900 rounded-lg font-medium hover:bg-purple-100 transition-colors"
                  >
                    Edit Card
                  </button>
                  <button
                    onClick={() => {
                      const dataStr = JSON.stringify(generatedCard, null, 2);
                      const dataBlob = new Blob([dataStr], { type: 'application/json' });
                      const url = URL.createObjectURL(dataBlob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `${generatedCard.name}-card.json`;
                      link.click();
                    }}
                    className="px-6 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors"
                  >
                    Export JSON
                  </button>
                </div>

                {/* Card Details */}
                <div className="w-full bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                  <h3 className="font-semibold mb-2">Card Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-purple-200">Type:</span>{' '}
                      <span className="capitalize">{generatedCard.type}</span>
                    </div>
                    <div>
                      <span className="text-purple-200">Stage:</span>{' '}
                      <span className="uppercase">{generatedCard.stage}</span>
                    </div>
                    <div>
                      <span className="text-purple-200">HP:</span> {generatedCard.hp}
                    </div>
                    <div>
                      <span className="text-purple-200">Rarity:</span>{' '}
                      <span className="capitalize">{generatedCard.rarity.replace('-', ' ')}</span>
                    </div>
                  </div>
                  {generatedCard.ability && (
                    <div className="mt-2">
                      <span className="text-purple-200">Ability:</span>{' '}
                      {generatedCard.ability.name}
                    </div>
                  )}
                  <div className="mt-2">
                    <span className="text-purple-200">Attacks:</span>{' '}
                    {generatedCard.attacks.map(a => a.name).join(', ')}
                  </div>
                </div>
              </>
            )}

            {/* Empty State */}
            {!isLoading && !generatedCard && (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <div className="text-8xl mb-4">&#x1F3B4;</div>
                <h3 className="text-xl font-semibold text-white mb-2">No Card Yet</h3>
                <p className="text-purple-200 max-w-sm">
                  Describe your dream Pokemon card in the form and watch the AI bring it to life!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/30 border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-center text-purple-200 text-sm">
            Pokemon Card Designer - Create custom cards with AI assistance
          </p>
        </div>
      </footer>

      {/* Card Editor Modal */}
      {isEditing && generatedCard && (
        <CardEditor
          card={generatedCard}
          onUpdate={handleUpdateCard}
          onClose={() => setIsEditing(false)}
        />
      )}
    </main>
  );
}
