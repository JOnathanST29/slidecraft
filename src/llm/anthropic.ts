import OpenAI from 'openai'
import type { LLMConfig, PresentationStructure } from '../types.js'
import type { LLMClient, LLMGenerateRequest } from './types.js'
import { buildSystemPrompt, buildUserPrompt } from './prompt.js'

/**
 * Anthropic client using the OpenAI-compatible API.
 * Requires setting baseURL to Anthropic's OpenAI-compatible endpoint.
 */
export function createAnthropicClient(config: LLMConfig): LLMClient {
  const client = new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseURL ?? 'https://api.anthropic.com/v1/',
    defaultHeaders: {
      'anthropic-version': '2023-06-01',
    },
  })

  const model = config.model ?? 'claude-sonnet-4-20250514'
  const temperature = config.temperature ?? 0.7

  return {
    async generate(request: LLMGenerateRequest): Promise<PresentationStructure> {
      const response = await client.chat.completions.create({
        model,
        temperature,
        max_tokens: 8192,
        messages: [
          { role: 'system', content: buildSystemPrompt(request) },
          {
            role: 'user',
            content: buildUserPrompt(request) +
              '\n\nIMPORTANT: Respond ONLY with a valid JSON object. No markdown, no code fences, no explanation.',
          },
        ],
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('SlideCraft: LLM returned empty response')
      }

      // Strip potential markdown code fences
      const cleaned = content.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim()

      try {
        return JSON.parse(cleaned) as PresentationStructure
      } catch {
        throw new Error(`SlideCraft: Failed to parse LLM JSON response: ${cleaned.slice(0, 200)}`)
      }
    },
  }
}
