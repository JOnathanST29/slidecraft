import { describe, it, expect } from 'vitest'
import { SlideCraft } from '../src/slidecraft.js'
import type { SlideCraftConfig } from '../src/types.js'

// Minimal config — LLM won't be called in level 4 tests
const config: SlideCraftConfig = {
  llm: { provider: 'openai', apiKey: 'test-key-not-used' },
}

describe('SlideCraft — Level 4 (no LLM)', () => {
  it('should render slides directly with llm: false', async () => {
    const sc = new SlideCraft(config)
    const result = await sc.generate({
      slides: [
        { title: 'Hello World', content: ['Point A', 'Point B'], layout: 'bullets' },
      ],
      llm: false,
    })

    expect(result.structure.slides).toHaveLength(1)
    expect(result.structure.slides[0]!.title).toBe('Hello World')
    expect(result.structure.slides[0]!.layout).toBe('bullets')
    expect(result.structure.slides[0]!.bullets).toHaveLength(2)
    expect(result.structure.slides[0]!.bullets![0]!.text).toBe('Point A')
    expect(result.structure.slides[0]!.bullets![1]!.text).toBe('Point B')

    const buffer = await result.toBuffer()
    expect(buffer[0]).toBe(0x50) // PK zip
    expect(buffer[1]).toBe(0x4b)
  })

  it('should default to title-content when no content and no layout', async () => {
    const sc = new SlideCraft(config)
    const result = await sc.generate({
      slides: [{ title: 'No Layout' }],
      llm: false,
    })
    expect(result.structure.slides[0]!.layout).toBe('title-content')
  })

  it('should respect explicit layout from spec', async () => {
    const sc = new SlideCraft(config)
    const result = await sc.generate({
      slides: [{ title: 'Bullets', content: ['test'], layout: 'bullets' }],
      llm: false,
    })
    expect(result.structure.slides[0]!.layout).toBe('bullets')
  })

  it('should handle multiple slides', async () => {
    const sc = new SlideCraft(config)
    const result = await sc.generate({
      slides: [
        { title: 'Slide 1', content: ['A'] },
        { title: 'Slide 2', content: ['B'] },
        { title: 'Slide 3', content: ['C'] },
      ],
      llm: false,
    })
    expect(result.structure.slides).toHaveLength(3)
  })

  it('should use first slide title as presentation title', async () => {
    const sc = new SlideCraft(config)
    const result = await sc.generate({
      slides: [{ title: 'My Deck', content: ['hello'] }],
      llm: false,
    })
    expect(result.structure.title).toBe('My Deck')
  })

  it('should throw for empty slides array', async () => {
    const sc = new SlideCraft(config)
    await expect(
      sc.generate({ slides: [], llm: false }),
    ).rejects.toThrow('slides array cannot be empty')
  })

  it('should throw if llm: false but slides is a number', async () => {
    const sc = new SlideCraft(config)
    await expect(
      sc.generate({ slides: 5, llm: false } as any),
    ).rejects.toThrow('as an array, not a number')
  })

  it('should accept a custom template', async () => {
    const sc = new SlideCraft(config)
    const result = await sc.generate({
      slides: [{ title: 'Test', content: ['x'] }],
      template: 'executive',
      llm: false,
    })
    const buffer = await result.toBuffer()
    expect(buffer.length).toBeGreaterThan(0)
  })
})
