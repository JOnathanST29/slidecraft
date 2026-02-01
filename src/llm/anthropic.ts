import Anthropic from '@anthropic-ai/sdk'
import type { LLMConfig, PresentationStructure } from '../types.js'
import type { LLMClient, LLMGenerateRequest } from './types.js'
import { buildSystemPrompt, buildUserPrompt } from './prompt.js'

/**
 * Anthropic client using the native Anthropic SDK.
 */
export function createAnthropicClient(config: LLMConfig): LLMClient {
  const client = new Anthropic({
    apiKey: config.apiKey,
    ...(config.baseURL ? { baseURL: config.baseURL } : {}),
  })

  const model = config.model ?? 'claude-sonnet-4-20250514'
  const temperature = config.temperature ?? 0.7

  return {
    async generate(request: LLMGenerateRequest): Promise<PresentationStructure> {
      const response = await client.messages.create({
        model,
        max_tokens: 8192,
        temperature,
        system: buildSystemPrompt(request),
        messages: [
          {
            role: 'user',
            content: buildUserPrompt(request) +
              '\n\nIMPORTANT: Respond ONLY with a valid JSON object. No markdown, no code fences, no explanation.',
          },
        ],
      })

      const textBlock = response.content.find((block) => block.type === 'text')
      if (!textBlock || textBlock.type !== 'text') {
        throw new Error('SlideCraft: Anthropic returned no text content')
      }

      const content = textBlock.text

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
