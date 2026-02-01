import type { LLMProvider } from '../types.js'

/**
 * Provider presets — baseURL and default model for each supported LLM provider.
 * All except Anthropic use the OpenAI-compatible chat completions API.
 */

export interface ProviderPreset {
  baseURL: string
  defaultModel: string
  /** If true, use native Anthropic SDK instead of OpenAI-compatible */
  native?: boolean
  /** Extra default headers */
  headers?: Record<string, string>
}

export const PROVIDER_PRESETS: Record<LLMProvider, ProviderPreset> = {
  openai: {
    baseURL: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o',
  },
  anthropic: {
    baseURL: 'https://api.anthropic.com',
    defaultModel: 'claude-sonnet-4-20250514',
    native: true,
  },
  gemini: {
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai',
    defaultModel: 'gemini-2.0-flash',
  },
  mistral: {
    baseURL: 'https://api.mistral.ai/v1',
    defaultModel: 'mistral-large-latest',
  },
  groq: {
    baseURL: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.3-70b-versatile',
  },
  deepseek: {
    baseURL: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
  },
  together: {
    baseURL: 'https://api.together.xyz/v1',
    defaultModel: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
  },
  perplexity: {
    baseURL: 'https://api.perplexity.ai',
    defaultModel: 'sonar-pro',
  },
  xai: {
    baseURL: 'https://api.x.ai/v1',
    defaultModel: 'grok-2-latest',
  },
  cohere: {
    baseURL: 'https://api.cohere.com/v2',
    defaultModel: 'command-r-plus',
  },
}
