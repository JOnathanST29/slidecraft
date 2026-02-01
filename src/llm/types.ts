import type { LLMConfig, PresentationStructure, TemplateConfig } from '../types.js'

export interface LLMGenerateRequest {
  data: unknown
  template: TemplateConfig
  instructions: string
  language: string
  maxSlides?: number
}

export interface LLMClient {
  generate(request: LLMGenerateRequest): Promise<PresentationStructure>
}

export type LLMClientFactory = (config: LLMConfig) => LLMClient
