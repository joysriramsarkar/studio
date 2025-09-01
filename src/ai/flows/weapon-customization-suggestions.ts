'use server';
/**
 * @fileOverview Provides weapon customization suggestions based on player's preferred play style.
 *
 * - getWeaponCustomizationSuggestions - A function that generates weapon customization suggestions.
 * - WeaponCustomizationInput - The input type for the getWeaponCustomizationSuggestions function.
 * - WeaponCustomizationOutput - The return type for the getWeaponCustomizationSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeaponCustomizationInputSchema = z.object({
  playStyle: z
    .string()
    .describe(
      'The preferred play style of the player (e.g., aggressive, stealthy, sniper).'
    ),
  weaponType: z.string().describe('The type of weapon (e.g., assault rifle, sniper rifle, shotgun).'),
});
export type WeaponCustomizationInput = z.infer<typeof WeaponCustomizationInputSchema>;

const WeaponCustomizationOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      attachment: z.string().describe('The name of the suggested attachment.'),
      reason: z.string().describe('The reason why this attachment is suitable for the given play style.'),
    })
  ).describe('A list of weapon attachment suggestions.'),
});
export type WeaponCustomizationOutput = z.infer<typeof WeaponCustomizationOutputSchema>;

export async function getWeaponCustomizationSuggestions(
  input: WeaponCustomizationInput
): Promise<WeaponCustomizationOutput> {
  return weaponCustomizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'weaponCustomizationPrompt',
  input: {schema: WeaponCustomizationInputSchema},
  output: {schema: WeaponCustomizationOutputSchema},
  prompt: `You are an expert in weapon customization for first-person shooter games. Based on the player's preferred play style and weapon type, suggest weapon attachment configurations.

Play Style: {{{playStyle}}}
Weapon Type: {{{weaponType}}}

Provide a list of weapon attachment suggestions, including the attachment name and a brief explanation of why it is suitable for the given play style.`,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const weaponCustomizationFlow = ai.defineFlow(
  {
    name: 'weaponCustomizationFlow',
    inputSchema: WeaponCustomizationInputSchema,
    outputSchema: WeaponCustomizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
