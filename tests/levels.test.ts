import { describe, it, expect } from 'vitest'
import { SlideCraft } from '../src/slidecraft.js'
import { renderPresentation } from '../src/renderer/index.js'
import { getTemplate } from '../src/templates/index.js'
import type { PresentationStructure } from '../src/types.js'

// ── Level 4 tests (no LLM) ──

describe('Level 4 — Direct render (llm: false)', () => {
  it('renders slides from SlideSpec array without LLM', async () => {
    // Level 4 doesn't need a real LLM, but SlideCraft constructor requires config
    // We use a dummy key since llm:false skips the call
    const sc = new SlideCraft({
      llm: { provider: 'openai', apiKey: 'dummy' },
    })

    const result = await sc.generate({
      llm: false,
      slides: [
        { title: 'Ventas Q4', content: ['$2.5M revenue', '+23% YoY', '150 clientes nuevos'], layout: 'bullets' },
        { title: 'Proyección', content: ['Meta Q1: $3M', 'Expansión LATAM'], layout: 'bullets' },
      ],
    })

    expect(result.structure.slides).toHaveLength(2)
    expect(result.structure.slides[0].title).toBe('Ventas Q4')
    expect(result.structure.slides[0].bullets).toHaveLength(3)
    expect(result.structure.slides[0].bullets![0].text).toBe('$2.5M revenue')
    expect(result.structure.slides[1].title).toBe('Proyección')

    const buffer = await result.toBuffer()
    expect(buffer).toBeInstanceOf(Buffer)
    expect(buffer.length).toBeGreaterThan(0)
  })

  it('throws if llm:false without slides array', async () => {
    const sc = new SlideCraft({
      llm: { provider: 'openai', apiKey: 'dummy' },
    })

    await expect(
      sc.generate({ llm: false, slides: 5 as any })
    ).rejects.toThrow('Level 4')
  })

  it('handles slides with no content gracefully', async () => {
    const sc = new SlideCraft({
      llm: { provider: 'openai', apiKey: 'dummy' },
    })

    const result = await sc.generate({
      llm: false,
      slides: [
        { title: 'Empty Slide' },
      ],
    })

    expect(result.structure.slides).toHaveLength(1)
    expect(result.structure.slides[0].layout).toBe('title-content')
  })

  it('uses instructions as speaker notes', async () => {
    const sc = new SlideCraft({
      llm: { provider: 'openai', apiKey: 'dummy' },
    })

    const result = await sc.generate({
      llm: false,
      slides: [
        { title: 'Intro', content: ['Hello'], instructions: 'Talk about the mission' },
      ],
    })

    expect(result.structure.slides[0].notes).toBe('Talk about the mission')
  })
})

// ── Table renderer test ──

describe('Table layout renderer', () => {
  it('renders a table slide correctly', async () => {
    const structure: PresentationStructure = {
      title: 'Test',
      slides: [
        {
          title: 'Top Clients',
          layout: 'table',
          table: {
            headers: ['Client', 'Revenue', 'Deals'],
            rows: [
              ['Acme Corp', '$500K', '12'],
              ['Globex', '$350K', '8'],
              ['Initech', '$200K', '5'],
            ],
          },
        },
      ],
    }

    const template = getTemplate('general')
    const result = renderPresentation(structure, template)

    expect(result.structure.slides).toHaveLength(1)
    expect(result.structure.slides[0].layout).toBe('table')
    expect(result.structure.slides[0].table?.headers).toEqual(['Client', 'Revenue', 'Deals'])
    expect(result.structure.slides[0].table?.rows).toHaveLength(3)

    const buffer = await result.toBuffer()
    expect(buffer).toBeInstanceOf(Buffer)
    expect(buffer.length).toBeGreaterThan(0)
  })
})
