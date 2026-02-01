import type { LLMConfig, PresentationStructure, SlideSpec, TemplateConfig } from '../types.js'

export interface LLMGenerateRequest {
  data: unknown
  template: TemplateConfig
  instructions: string
  language: string
  maxSlides?: number
  /** Level 2: exact slide count */
  slideCount?: number
  /** Level 3: per-slide specs */
  slideSpecs?: SlideSpec[]
}

export interface LLMClient {
  generate(request: LLMGenerateRequest): Promise<PresentationStructure>
}

export type LLMClientFactory = (config: LLMConfig) => LLMClient
