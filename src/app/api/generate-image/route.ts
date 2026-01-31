import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageDescription, pokemonName, pokemonType } = await request.json();

    if (!imageDescription) {
      return NextResponse.json(
        { error: 'Image description is required' },
        { status: 400 }
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Create a Pokemon-card-specific prompt for image generation
    const imagePrompt = `Create a Pokemon trading card game style artwork.
The Pokemon is called "${pokemonName}" and is a ${pokemonType}-type Pokemon.
Art style: Official Pokemon TCG illustration style, vibrant colors, dynamic pose, detailed.
Description: ${imageDescription}
Important: The image should look like official Pokemon card artwork - no text, no card borders, just the Pokemon creature illustration with a simple background.`;

    // Use Gemini's Imagen 3 for image generation
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instances: [
            {
              prompt: imagePrompt,
            },
          ],
          parameters: {
            sampleCount: 1,
            aspectRatio: '1:1',
            safetyFilterLevel: 'block_few',
            personGeneration: 'dont_allow',
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);

      // Try alternative endpoint format
      const altResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Generate an image: ${imagePrompt}`
              }]
            }],
            generationConfig: {
              responseModalities: ["image", "text"],
            }
          }),
        }
      );

      if (!altResponse.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const altData = await altResponse.json();

      // Extract image from alternative response format
      const parts = altData.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData?.mimeType?.startsWith('image/')) {
          return NextResponse.json({
            imageUrl: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
          });
        }
      }

      throw new Error('No image in response');
    }

    const data = await response.json();

    // Extract base64 image from response
    const imageData = data.predictions?.[0]?.bytesBase64Encoded;

    if (!imageData) {
      throw new Error('No image data in response');
    }

    return NextResponse.json({
      imageUrl: `data:image/png;base64,${imageData}`,
    });

  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image. Please try again.' },
      { status: 500 }
    );
  }
}
