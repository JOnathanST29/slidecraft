import type {
  GenerateOptions,
  GenerationResult,
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
   * Generate a PowerPoint presentation from data and instructions.
   */
  async generate(options: GenerateOptions): Promise<GenerationResult> {
    const template = this.resolveTemplate(options.template)
    const language = options.language ?? this.config.language ?? 'en'

    // Call LLM to generate presentation structure
    const structure = await this.llmClient.generate({
      data: options.data,
      template,
      instructions: options.instructions,
      language,
      maxSlides: options.maxSlides ?? template.maxSlides,
    })

    // Validate structure
    if (!structure.slides || !Array.isArray(structure.slides) || structure.slides.length === 0) {
      throw new Error('SlideCraft: LLM returned invalid presentation structure (no slides)')
    }

    // Render to pptx
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
