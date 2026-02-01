import { describe, it, expect } from 'vitest'
import { buildSystemPrompt, buildUserPrompt } from '../src/llm/prompt.js'
import { salesReportTemplate, generalTemplate } from '../src/templates/index.js'
import type { LLMGenerateRequest } from '../src/llm/types.js'

describe('LLM Prompt Builder', () => {
  const baseRequest: LLMGenerateRequest = {
    data: { revenue: 100000, customers: 50 },
    template: salesReportTemplate,
    instructions: 'Create a sales summary',
    language: 'en',
  }

  it('should include template name in system prompt', () => {
    const prompt = buildSystemPrompt(baseRequest)
    expect(prompt).toContain('sales-report')
  })

  it('should include language in system prompt', () => {
    const prompt = buildSystemPrompt({ ...baseRequest, language: 'es' })
    expect(prompt).toContain('es')
  })

  it('should include max slides when specified', () => {
    const prompt = buildSystemPrompt({ ...baseRequest, maxSlides: 8 })
    expect(prompt).toContain('8')
  })

  it('should mention chart preference for sales-report', () => {
    const prompt = buildSystemPrompt(baseRequest)
    expect(prompt).toContain('PREFERS charts')
  })

  it('should NOT mention chart preference for general', () => {
    const prompt = buildSystemPrompt({ ...baseRequest, template: generalTemplate })
    expect(prompt).not.toContain('PREFERS charts')
  })

  it('should include user instructions in user prompt', () => {
    const prompt = buildUserPrompt(baseRequest)
    expect(prompt).toContain('Create a sales summary')
  })

  it('should serialize data as JSON in user prompt', () => {
    const prompt = buildUserPrompt(baseRequest)
    expect(prompt).toContain('"revenue": 100000')
    expect(prompt).toContain('"customers": 50')
  })

  it('should handle string data', () => {
    const prompt = buildUserPrompt({ ...baseRequest, data: 'raw text data' })
    expect(prompt).toContain('raw text data')
  })

  it('should include JSON schema in system prompt', () => {
    const prompt = buildSystemPrompt(baseRequest)
    expect(prompt).toContain('"slides"')
    expect(prompt).toContain('"layout"')
    expect(prompt).toContain('"bullets"')
  })
})
