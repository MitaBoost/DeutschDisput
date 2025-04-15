'use server';
/**
 * @fileOverview Generates advantages and disadvantages for a given topic at a specified CEFR level.
 *
 * - generateArguments - A function that generates arguments for a given topic and CEFR level.
 * - GenerateArgumentsInput - The input type for the generateArguments function.
 * - GenerateArgumentsOutput - The return type for the generateArguments function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const CEFRLevelSchema = z.enum(['A1', 'A2', 'B1', 'B2']);

const GenerateArgumentsInputSchema = z.object({
  topic: z.string().describe('The discussion topic.'),
  cefrLevel: CEFRLevelSchema.describe('The CEFR level (A1, A2, B1, B2).'),
});
export type GenerateArgumentsInput = z.infer<typeof GenerateArgumentsInputSchema>;

const GenerateArgumentsOutputSchema = z.object({
  advantages: z.array(z.string()).length(10).describe('Ten advantages for the topic at the specified CEFR level.'),
  disadvantages: z.array(z.string()).length(10).describe('Ten disadvantages for the topic at the specified CEFR level.'),
});
export type GenerateArgumentsOutput = z.infer<typeof GenerateArgumentsOutputSchema>;

export async function generateArguments(input: GenerateArgumentsInput): Promise<GenerateArgumentsOutput> {
  return generateArgumentsFlow(input);
}

const argumentGenerationPrompt = ai.definePrompt({
  name: 'argumentGenerationPrompt',
  input: {
    schema: z.object({
      topic: z.string().describe('The discussion topic.'),
      cefrLevel: z.enum(['A1', 'A2', 'B1', 'B2']).describe('The CEFR level (A1, A2, B1, B2).'),
    }),
  },
  output: {
    schema: z.object({
      advantages: z.array(z.string()).length(10).describe('Ten advantages for the topic at the specified CEFR level.'),
      disadvantages: z.array(z.string()).length(10).describe('Ten disadvantages for the topic at the specified CEFR level.'),
    }),
  },
  prompt: `You are a helpful AI assistant that generates arguments for German language learners.

  The user will provide a discussion topic and a CEFR level (A1, A2, B1, B2).
  You will generate ten advantages (Vorteile) and ten disadvantages (Nachteile) for that topic, tailored to the specified CEFR level.
  Make sure all sentences are grammatically correct and contextually relevant.

  Topic: {{{topic}}}
  CEFR Level: {{{cefrLevel}}}

  Output the advantages and disadvantages as a JSON object with "advantages" and "disadvantages" keys. Each key should be an array of 10 strings.
  The advantages and disadvantages should be appropriate for the specified CEFR level. Focus on realistic, meaningful sentences that follow standard German grammar rules. 
  Where applicable, the sentences should include subordinate clauses and connector words like: weil, obwohl, damit, wenn, dass, während, um...zu, sodass, falls
  Use modal verbs and verb-second/verb-final placement according to the rules of German sentence structure.
  Do not include any additional text or explanations in your response.
  `,
});

const generateArgumentsFlow = ai.defineFlow<
  typeof GenerateArgumentsInputSchema,
  typeof GenerateArgumentsOutputSchema
>(
  {
    name: 'generateArgumentsFlow',
    inputSchema: GenerateArgumentsInputSchema,
    outputSchema: GenerateArgumentsOutputSchema,
  },
  async input => {
    const {output} = await argumentGenerationPrompt(input);
    return output!;
  }
);

