import type {
  GenerateOptions,
  GenerationResult,
  PresentationStructure,
  SlideDefinition,
  SlideSpec,
  SlideCraftConfig,
  TemplateConfig,
} from './types.js'
import { createLLMClient, type LLMClient } from './llm/index.js'
import { getTemplate } from './templates/index.js'
import { renderPresentation } from './renderer/index.js'

export class SlideCraft {
  private llmClient: LLMClient
  private config: SlideCraftConfig

  constructor(config: SlideCraftConfig) {
    this.config = config
    this.llmClient = createLLMClient(config.llm)
  }

  /**
   * Generate a PowerPoint presentation.
   *
   * Supports 4 levels of control:
   * - Level 1: LLM decides everything         → { data, instructions }
   * - Level 2: User fixes slide count          → { data, slides: 8, instructions }
   * - Level 3: User defines each slide         → { data, slides: [{ title, layout, ... }] }
   * - Level 4: No LLM, direct render           → { slides: [...], llm: false }
   */
  async generate(options: GenerateOptions): Promise<GenerationResult> {
    const template = this.resolveTemplate(options.template)
    const language = options.language ?? this.config.language ?? 'en'

    // ── Level 4: No LLM — direct render ──
    if (options.llm === false) {
      return this.renderDirect(options, template)
    }

    // Determine level and build LLM request
    let slideCount: number | undefined
    let slideSpecs: SlideSpec[] | undefined

    if (Array.isArray(options.slides)) {
      // Level 3: user-defined slide blueprints
      slideSpecs = options.slides
    } else if (typeof options.slides === 'number') {
      // Level 2: fixed slide count
      slideCount = options.slides
    }
    // else Level 1: LLM decides everything

    const structure = await this.llmClient.generate({
      data: options.data,
      template,
      instructions: options.instructions ?? '',
      language,
      maxSlides: template.maxSlides,
      slideCount,
      slideSpecs,
    })

    // Validate structure
    if (!structure.slides || !Array.isArray(structure.slides) || structure.slides.length === 0) {
      throw new Error('SlideCraft: LLM returned invalid presentation structure (no slides)')
    }

    return renderPresentation(structure, template)
  }

  /**
   * Level 4: Render directly from user-provided slide definitions, no LLM.
   */
  private renderDirect(options: GenerateOptions, template: TemplateConfig): GenerationResult {
    if (!Array.isArray(options.slides)) {
      throw new Error('SlideCraft: Level 4 (llm: false) requires slides as an array of SlideSpec objects.')
    }

    const specs = options.slides
    if (specs.length === 0) {
      throw new Error('SlideCraft: slides array cannot be empty.')
    }

    const slides: SlideDefinition[] = specs.map((spec) => ({
      title: spec.title ?? '',
      layout: spec.layout ?? 'title-content',
      bullets: spec.content
        ? spec.content.map((text) => ({ text, level: 0, bold: false }))
        : undefined,
      notes: spec.instructions,
    }))

    const structure: PresentationStructure = {
      title: slides[0]?.title ?? 'Presentation',
      slides,
    }

    return renderPresentation(structure, template)
  }

  private resolveTemplate(template?: string | TemplateConfig): TemplateConfig {
    if (!template) {
      return getTemplate(this.config.defaultTemplate ?? 'general')
    }
    if (typeof template === 'string') {
      return getTemplate(template)
    }
    return template
  }
}
