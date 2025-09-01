'use server';

import { getWeaponCustomizationSuggestions, type WeaponCustomizationInput } from '@/ai/flows/weapon-customization-suggestions';
import { z } from 'zod';

const ActionResponseSchema = z.object({
  suggestions: z
    .array(
      z.object({
        attachment: z.string(),
        reason: z.string(),
      })
    )
    .optional(),
  error: z.string().optional(),
});

type ActionResponse = z.infer<typeof ActionResponseSchema>;

export async function getSuggestions(input: WeaponCustomizationInput): Promise<ActionResponse> {
  try {
    const output = await getWeaponCustomizationSuggestions(input);
    if (!output || !output.suggestions) {
      return { error: 'Failed to get suggestions from AI.' };
    }
    return { suggestions: output.suggestions };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
    return { error: `An error occurred: ${errorMessage}` };
  }
}
