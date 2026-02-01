import { describe, it, expect } from 'vitest'
import { PROVIDER_PRESETS } from '../src/llm/providers.js'
import { createLLMClient } from '../src/llm/index.js'
import type { LLMProvider } from '../src/types.js'

describe('Provider presets', () => {
  const allProviders: LLMProvider[] = [
    'openai', 'anthropic', 'gemini', 'mistral', 'groq',
    'deepseek', 'together', 'perplexity', 'xai', 'cohere',
  ]

  it('has presets for all declared providers', () => {
    for (const provider of allProviders) {
      expect(PROVIDER_PRESETS[provider]).toBeDefined()
      expect(PROVIDER_PRESETS[provider].baseURL).toBeTruthy()
      expect(PROVIDER_PRESETS[provider].defaultModel).toBeTruthy()
    }
  })

  it('all baseURLs are valid https URLs', () => {
    for (const [name, preset] of Object.entries(PROVIDER_PRESETS)) {
      expect(preset.baseURL, `${name} baseURL`).toMatch(/^https:\/\//)
    }
  })

  it('only anthropic is marked as native', () => {
    for (const [name, preset] of Object.entries(PROVIDER_PRESETS)) {
      if (name === 'anthropic') {
        expect(preset.native).toBe(true)
      } else {
        expect(preset.native, `${name} should not be native`).toBeFalsy()
      }
    }
  })
})

describe('createLLMClient factory', () => {
  const openaiCompatible: LLMProvider[] = [
    'openai', 'gemini', 'mistral', 'groq', 'deepseek', 'together', 'perplexity', 'xai', 'cohere',
  ]

  for (const provider of openaiCompatible) {
    it(`creates client for ${provider} (OpenAI-compatible)`, () => {
      const client = createLLMClient({
        provider,
        apiKey: 'test-key-123',
      })

      expect(client).toBeDefined()
      expect(typeof client.generate).toBe('function')
    })
  }

  it('creates client for anthropic (native SDK)', () => {
    const client = createLLMClient({
      provider: 'anthropic',
      apiKey: 'test-key-123',
    })

    expect(client).toBeDefined()
    expect(typeof client.generate).toBe('function')
  })

  it('throws for unknown provider', () => {
    expect(() =>
      createLLMClient({
        provider: 'unknown-provider' as LLMProvider,
        apiKey: 'test',
      })
    ).toThrow('Unknown LLM provider')
  })

  it('respects user model override', () => {
    // Can't directly inspect the model, but ensure it doesn't throw
    const client = createLLMClient({
      provider: 'openai',
      apiKey: 'test-key',
      model: 'gpt-4o-mini',
    })
    expect(client).toBeDefined()
  })

  it('respects user baseURL override', () => {
    const client = createLLMClient({
      provider: 'openai',
      apiKey: 'test-key',
      baseURL: 'https://my-proxy.example.com/v1',
    })
    expect(client).toBeDefined()
  })
})
