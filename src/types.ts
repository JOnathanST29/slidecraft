// ─── LLM Configuration ───

export type LLMProvider = 'openai' | 'anthropic'

export interface LLMConfig {
  /** LLM provider to use */
  provider: LLMProvider
  /** API key for the provider */
  apiKey: string
  /** Model name (defaults: gpt-4o for openai, claude-sonnet-4-20250514 for anthropic) */
  model?: string
  /** Base URL override (useful for proxies or Anthropic's OpenAI-compatible endpoint) */
  baseURL?: string
  /** Temperature for generation (0-2, default: 0.7) */
  temperature?: number
}

// ─── SlideCraft Configuration ───

export interface SlideCraftConfig {
  /** LLM configuration */
  llm: LLMConfig
  /** Default template name */
  defaultTemplate?: string
  /** Default language for generated content */
  language?: string
}

// ─── Template Types ───

export interface TemplateColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  lightText: string
}

export interface TemplateFonts {
  title: string
  body: string
  mono: string
}

export interface TemplateConfig {
  name: string
  description: string
  colors: TemplateColors
  fonts: TemplateFonts
  /** Preferred slide layouts for this template */
  preferredLayouts: SlideLayout[]
  /** Max slides recommendation */
  maxSlides?: number
  /** Whether to prefer charts when numeric data is available */
  preferCharts?: boolean
}

// ─── Slide Structure (LLM output) ───

export type SlideLayout =
  | 'title'
  | 'title-content'
  | 'two-column'
  | 'section-header'
  | 'chart'
  | 'image-text'
  | 'blank'
  | 'closing'

export type ChartType = 'bar' | 'line' | 'pie' | 'doughnut'

export interface ChartSeries {
  name: string
  labels: string[]
  values: number[]
}

export interface ChartConfig {
  type: ChartType
  title?: string
  series: ChartSeries[]
  showLegend?: boolean
  showValues?: boolean
}

export interface BulletPoint {
  text: string
  level?: number // indentation level (0-2)
  bold?: boolean
}

export interface SlideColumnContent {
  heading?: string
  bullets?: BulletPoint[]
  text?: string
}

export interface SlideDefinition {
  title: string
  subtitle?: string
  layout: SlideLayout
  /** Bullet points or text content */
  bullets?: BulletPoint[]
  /** Body text (for layouts that use paragraph text) */
  bodyText?: string
  /** Two-column layout content */
  leftColumn?: SlideColumnContent
  rightColumn?: SlideColumnContent
  /** Chart configuration */
  chart?: ChartConfig
  /** Speaker notes */
  notes?: string
}

export interface PresentationStructure {
  title: string
  subtitle?: string
  author?: string
  slides: SlideDefinition[]
}

// ─── Generation Options ───

export interface GenerateOptions {
  /** Input data (any JSON-serializable object) */
  data: unknown
  /** Template name or custom TemplateConfig */
  template?: string | TemplateConfig
  /** Natural language instructions for the LLM */
  instructions: string
  /** Override language for this generation */
  language?: string
  /** Maximum number of slides */
  maxSlides?: number
}

// ─── Generation Result ───

export interface GenerationResult {
  /** Save the presentation to a file */
  save(filePath: string): Promise<void>
  /** Get the presentation as a Buffer */
  toBuffer(): Promise<Buffer>
  /** The structured slide data from the LLM */
  structure: PresentationStructure
}
