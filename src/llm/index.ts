import type { LLMConfig } from '../types.js'
import type { LLMClient } from './types.js'
import { createOpenAIClient } from './openai.js'
import { createAnthropicClient } from './anthropic.js'

export type { LLMClient, LLMGenerateRequest } from './types.js'
export { buildSystemPrompt, buildUserPrompt } from './prompt.js'

export function createLLMClient(config: LLMConfig): LLMClient {
  switch (config.provider) {
    case 'openai':
      return createOpenAIClient(config)
    case 'anthropic':
      return createAnthropicClient(config)
    default:
      throw new Error(`SlideCraft: Unknown LLM provider "${config.provider as string}"`)
  }
}
