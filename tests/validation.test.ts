import { describe, it, expect } from 'vitest'
import { validateGenerateOptions, ValidationError } from '../src/validation.js'

describe('Input validation', () => {
  // ── Level 4 ──
  it('throws if llm:false without slides', () => {
    expect(() => validateGenerateOptions({ llm: false }))
      .toThrow(ValidationError)
  })

  it('throws if llm:false with slides as number', () => {
    expect(() => validateGenerateOptions({ llm: false, slides: 5 }))
      .toThrow('array, not a number')
  })

  it('throws if llm:false slide has no title or content', () => {
    expect(() => validateGenerateOptions({ llm: false, slides: [{ layout: 'bullets' }] }))
      .toThrow('Slide 1')
  })

  it('passes if llm:false slide has title', () => {
    expect(() => validateGenerateOptions({ llm: false, slides: [{ title: 'Hi' }] }))
      .not.toThrow()
  })

  it('passes if llm:false slide has content', () => {
    expect(() => validateGenerateOptions({ llm: false, slides: [{ content: ['Hello'] }] }))
      .not.toThrow()
  })

  // ── Levels 1-3 ──
  it('throws if no data and no instructions', () => {
    expect(() => validateGenerateOptions({}))
      .toThrow('at least "data" or "instructions"')
  })

  it('passes with just data', () => {
    expect(() => validateGenerateOptions({ data: { x: 1 } }))
      .not.toThrow()
  })

  it('passes with just instructions', () => {
    expect(() => validateGenerateOptions({ instructions: 'Make a deck' }))
      .not.toThrow()
  })

  // ── Level 2 ──
  it('throws if slides is 0', () => {
    expect(() => validateGenerateOptions({ data: {}, slides: 0 }))
      .toThrow('positive integer')
  })

  it('throws if slides is negative', () => {
    expect(() => validateGenerateOptions({ data: {}, slides: -3 }))
      .toThrow('positive integer')
  })

  it('throws if slides > 50', () => {
    expect(() => validateGenerateOptions({ data: {}, slides: 100 }))
      .toThrow('max is 50')
  })

  it('throws if slides is a float', () => {
    expect(() => validateGenerateOptions({ data: {}, slides: 5.5 }))
      .toThrow('positive integer')
  })

  // ── Level 3 ──
  it('throws if slides array is empty', () => {
    expect(() => validateGenerateOptions({ data: {}, slides: [] }))
      .toThrow('cannot be empty')
  })

  it('throws on invalid layout', () => {
    expect(() => validateGenerateOptions({
      data: {},
      slides: [{ title: 'X', layout: 'magic' as any }]
    })).toThrow('invalid layout')
  })

  it('throws on invalid chartType', () => {
    expect(() => validateGenerateOptions({
      data: {},
      slides: [{ title: 'X', layout: 'chart', chartType: 'radar' as any }]
    })).toThrow('invalid chartType')
  })

  it('throws if chartType set but layout is not chart', () => {
    expect(() => validateGenerateOptions({
      data: {},
      slides: [{ title: 'X', layout: 'bullets', chartType: 'bar' }]
    })).toThrow('not "chart"')
  })

  it('passes valid Level 3 slides', () => {
    expect(() => validateGenerateOptions({
      data: {},
      slides: [
        { title: 'Intro', layout: 'title' },
        { title: 'Data', layout: 'chart', chartType: 'bar' },
        { title: 'Table', layout: 'table', dataKey: 'clients' },
        { layout: 'closing', instructions: 'Thanks' },
      ]
    })).not.toThrow()
  })

  // ── maxSlides ──
  it('throws if maxSlides is 0', () => {
    expect(() => validateGenerateOptions({ data: {}, maxSlides: 0 }))
      .toThrow('between 1 and 50')
  })

  it('throws if maxSlides > 50', () => {
    expect(() => validateGenerateOptions({ data: {}, maxSlides: 100 }))
      .toThrow('between 1 and 50')
  })

  // ── template ──
  it('throws if template is empty string', () => {
    expect(() => validateGenerateOptions({ data: {}, template: '' }))
      .toThrow('empty string')
  })
})
