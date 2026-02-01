import OpenAI from 'openai'
import type { LLMConfig, PresentationStructure } from '../types.js'
import type { LLMClient, LLMGenerateRequest } from './types.js'
import { buildSystemPrompt, buildUserPrompt } from './prompt.js'

export function createOpenAIClient(config: LLMConfig): LLMClient {
  const client = new OpenAI({
    apiKey: config.apiKey,
    ...(config.baseURL ? { baseURL: config.baseURL } : {}),
  })

  const model = config.model ?? 'gpt-4o' // overridden by provider preset in createLLMClient
  const temperature = config.temperature ?? 0.7

  return {
    async generate(request: LLMGenerateRequest): Promise<PresentationStructure> {
      const response = await client.chat.completions.create({
        model,
        temperature,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: buildSystemPrompt(request) },
          { role: 'user', content: buildUserPrompt(request) },
        ],
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('SlideCraft: LLM returned empty response')
      }

      try {
        return JSON.parse(content) as PresentationStructure
      } catch {
        throw new Error(`SlideCraft: Failed to parse LLM JSON response: ${content.slice(0, 200)}`)
      }
    },
  }
}
