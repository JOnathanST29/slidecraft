import type { GenerateOptions, SlideSpec, SlideLayout, ChartType } from './types.js'

const VALID_LAYOUTS: SlideLayout[] = [
  'title', 'title-content', 'bullets', 'two-column',
  'section-header', 'chart', 'table', 'image-text', 'blank', 'closing',
]

const VALID_CHART_TYPES: ChartType[] = ['bar', 'line', 'pie', 'doughnut']

export class ValidationError extends Error {
  constructor(message: string) {
    super(`SlideCraft validation: ${message}`)
    this.name = 'ValidationError'
  }
}

export function validateGenerateOptions(options: GenerateOptions): void {
  // Level 4: llm=false requires slides array
  if (options.llm === false) {
    if (!options.slides) {
      throw new ValidationError(
        'Level 4 (llm: false) requires "slides" as an array of SlideSpec objects.'
      )
    }
    if (typeof options.slides === 'number') {
      throw new ValidationError(
        'Level 4 (llm: false) requires "slides" as an array, not a number. ' +
        'Use an array of SlideSpec objects with content defined.'
      )
    }
    // Validate each slide has at minimum a title or content
    for (let i = 0; i < options.slides.length; i++) {
      const slide = options.slides[i]!
      if (!slide.title && (!slide.content || slide.content.length === 0)) {
        throw new ValidationError(
          `Slide ${i + 1}: Level 4 slides need at least a "title" or "content" array.`
        )
      }
    }
    return
  }

  // Levels 1-3: need data or instructions
  if (!options.data && !options.instructions) {
    throw new ValidationError(
      'Levels 1-3 require at least "data" or "instructions". ' +
      'Pass your JSON data, instructions for the LLM, or both.'
    )
  }

  // Level 2: slides as number
  if (typeof options.slides === 'number') {
    if (!Number.isInteger(options.slides) || options.slides < 1) {
      throw new ValidationError(
        `"slides" must be a positive integer, got ${options.slides}.`
      )
    }
    if (options.slides > 50) {
      throw new ValidationError(
        `"slides" max is 50, got ${options.slides}. LLMs struggle with very long presentations.`
      )
    }
  }

  // Level 3: slides as array
  if (Array.isArray(options.slides)) {
    if (options.slides.length === 0) {
      throw new ValidationError(
        '"slides" array cannot be empty. Add at least one SlideSpec.'
      )
    }
    if (options.slides.length > 50) {
      throw new ValidationError(
        `"slides" array max length is 50, got ${options.slides.length}.`
      )
    }
    for (let i = 0; i < options.slides.length; i++) {
      validateSlideSpec(options.slides[i]!, i + 1)
    }
  }

  // maxSlides
  if (options.maxSlides !== undefined) {
    if (!Number.isInteger(options.maxSlides) || options.maxSlides < 1 || options.maxSlides > 50) {
      throw new ValidationError(
        `"maxSlides" must be an integer between 1 and 50, got ${options.maxSlides}.`
      )
    }
  }

  // template string
  if (typeof options.template === 'string' && options.template.trim() === '') {
    throw new ValidationError('"template" cannot be an empty string.')
  }
}

function validateSlideSpec(spec: SlideSpec, index: number): void {
  if (spec.layout && !VALID_LAYOUTS.includes(spec.layout)) {
    throw new ValidationError(
      `Slide ${index}: invalid layout "${spec.layout}". ` +
      `Valid: ${VALID_LAYOUTS.join(', ')}`
    )
  }

  if (spec.chartType && !VALID_CHART_TYPES.includes(spec.chartType)) {
    throw new ValidationError(
      `Slide ${index}: invalid chartType "${spec.chartType}". ` +
      `Valid: ${VALID_CHART_TYPES.join(', ')}`
    )
  }

  if (spec.chartType && spec.layout && spec.layout !== 'chart') {
    throw new ValidationError(
      `Slide ${index}: "chartType" is set but layout is "${spec.layout}", not "chart". ` +
      `Set layout to "chart" or remove chartType.`
    )
  }

  if (spec.content && !Array.isArray(spec.content)) {
    throw new ValidationError(
      `Slide ${index}: "content" must be a string array.`
    )
  }
}
