// Main entry point — public API

export { SlideCraft } from './slidecraft.js'

// Types
export type {
  LLMProvider,
  LLMConfig,
  SlideCraftConfig,
  TemplateColors,
  TemplateFonts,
  TemplateConfig,
  SlideLayout,
  ChartType,
  ChartSeries,
  ChartConfig,
  TableConfig,
  BulletPoint,
  SlideColumnContent,
  SlideDefinition,
  SlideSpec,
  PresentationStructure,
  GenerateOptions,
  GenerationResult,
} from './types.js'

// Templates
export {
  getTemplate,
  listTemplates,
  registerTemplate,
  generalTemplate,
  salesReportTemplate,
  executiveTemplate,
} from './templates/index.js'

// Renderer (for advanced usage)
export { renderPresentation } from './renderer/index.js'

// LLM utilities (for advanced usage)
export { createLLMClient } from './llm/index.js'
export type { LLMClient, LLMGenerateRequest } from './llm/types.js'
