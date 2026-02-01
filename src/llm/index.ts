import type { LLMConfig } from '../types.js'
import type { LLMClient } from './types.js'
import { PROVIDER_PRESETS } from './providers.js'
import { createOpenAIClient } from './openai.js'
import { createAnthropicClient } from './anthropic.js'

export type { LLMClient, LLMGenerateRequest } from './types.js'
export { buildSystemPrompt, buildUserPrompt } from './prompt.js'
export { PROVIDER_PRESETS } from './providers.js'

/**
 * Create an LLM client for any supported provider.
 *
 * Providers with OpenAI-compatible APIs (openai, gemini, mistral, groq,
 * deepseek, together, perplexity, xai, cohere) use the OpenAI SDK with
 * the correct baseURL. Anthropic uses its native SDK.
 */
export function createLLMClient(config: LLMConfig): LLMClient {
  const preset = PROVIDER_PRESETS[config.provider]

  if (!preset) {
    throw new Error(
      `SlideCraft: Unknown LLM provider "${config.provider}". ` +
      `Supported: ${Object.keys(PROVIDER_PRESETS).join(', ')}`
    )
  }

  // Anthropic uses its native SDK
  if (preset.native) {
    return createAnthropicClient({
      ...config,
      model: config.model ?? preset.defaultModel,
    })
  }

  // Everything else uses OpenAI-compatible SDK
  return createOpenAIClient({
    ...config,
    baseURL: config.baseURL ?? preset.baseURL,
    model: config.model ?? preset.defaultModel,
  })
}
