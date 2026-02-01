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

  // ── Level 2: slideCount ──

  it('should enforce exact slide count for level 2', () => {
    const prompt = buildSystemPrompt({ ...baseRequest, slideCount: 5 })
    expect(prompt).toContain('EXACTLY 5 slides')
  })

  // ── Level 3: slideSpecs ──

  it('should include slide blueprint for level 3', () => {
    const prompt = buildSystemPrompt({
      ...baseRequest,
      slideSpecs: [
        { title: 'Intro', layout: 'title' },
        { title: 'Revenue', layout: 'chart', chartType: 'bar', dataKey: 'revenue' },
        { instructions: 'Summarize key points' },
      ],
    })
    expect(prompt).toContain('EXACTLY 3 slides')
    expect(prompt).toContain('Slide 1:')
    expect(prompt).toContain('title: "Intro"')
    expect(prompt).toContain('layout: chart')
    expect(prompt).toContain('chartType: bar')
    expect(prompt).toContain('dataKey: "revenue"')
    expect(prompt).toContain('Summarize key points')
  })

  it('should include table in schema reference', () => {
    const prompt = buildSystemPrompt(baseRequest)
    expect(prompt).toContain('"table"')
    expect(prompt).toContain('"headers"')
    expect(prompt).toContain('"rows"')
  })
})
