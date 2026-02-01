// ─── LLM Configuration ───

export type LLMProvider =
  | 'openai'
  | 'anthropic'
  | 'gemini'
  | 'mistral'
  | 'groq'
  | 'deepseek'
  | 'together'
  | 'perplexity'
  | 'xai'
  | 'cohere'

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

// ─── Slide Structure (LLM output / renderer input) ───

export type SlideLayout =
  | 'title'
  | 'title-content'
  | 'bullets'
  | 'two-column'
  | 'section-header'
  | 'chart'
  | 'table'
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

export interface TableConfig {
  headers: string[]
  rows: string[][]
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
  /** Table configuration */
  table?: TableConfig
  /** Speaker notes */
  notes?: string
}

export interface PresentationStructure {
  title: string
  subtitle?: string
  author?: string
  slides: SlideDefinition[]
}

// ─── Slide Spec (Level 3 — user-defined slide blueprints) ───

export interface SlideSpec {
  /** Slide title (optional — LLM can generate if missing) */
  title?: string
  /** Preferred layout */
  layout?: SlideLayout
  /** Preferred chart type (when layout is 'chart') */
  chartType?: ChartType
  /** Key path into the data object to use for this slide */
  dataKey?: string
  /** Per-slide instructions for the LLM */
  instructions?: string
  /** Direct content — array of strings rendered as bullets (Level 4) */
  content?: string[]
}

// ─── Generation Options (4 levels of control) ───

/**
 * Level 1: LLM decides everything.
 *   { data, instructions }
 *
 * Level 2: User fixes slide count, LLM fills content.
 *   { data, slides: 8, instructions }
 *
 * Level 3: User defines each slide blueprint, LLM generates content per-slide.
 *   { data, slides: [{ title, layout, ... }] }
 *
 * Level 4: No LLM, direct render.
 *   { slides: [{ title, content, layout }], llm: false }
 */
export interface GenerateOptions {
  /** Input data (any JSON-serializable object). Required for levels 1-3. */
  data?: unknown
  /** Template name or custom TemplateConfig */
  template?: string | TemplateConfig
  /**
   * Slide control:
   * - omitted → Level 1 (LLM decides count and content)
   * - number  → Level 2 (LLM generates exactly N slides)
   * - SlideSpec[] → Level 3 (user defines each slide, LLM fills content)
   */
  slides?: number | SlideSpec[]
  /** Natural language instructions for the LLM (levels 1-3) */
  instructions?: string
  /** Override language for this generation */
  language?: string
  /** Maximum number of slides (hint for the LLM) */
  maxSlides?: number
  /** Set to false to skip LLM entirely (Level 4 — direct render) */
  llm?: false
}

// ─── Generation Result ───

export interface GenerationResult {
  /** Save the presentation to a file */
  save(filePath: string): Promise<void>
  /** Get the presentation as a Buffer */
  toBuffer(): Promise<Buffer>
  /** The structured slide data */
  structure: PresentationStructure
}
