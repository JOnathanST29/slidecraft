# SlideCraft 🎨

TypeScript SDK to generate PowerPoint (.pptx) presentations using LLMs.

Feed your data + instructions → SlideCraft sends it to an LLM to design the slide structure → renders a polished `.pptx` file using [pptxgenjs](https://github.com/gitbrent/PptxGenJS).

```
[JSON data] → [Template engine] → [LLM (structure + copy)] → [pptxgenjs renderer] → [.pptx]
```

## Installation

```bash
npm install slidecraft
```

## Quick Start

```typescript
import { SlideCraft } from 'slidecraft'

const sc = new SlideCraft({
  llm: { provider: 'openai', apiKey: process.env.OPENAI_API_KEY! }
})

const pptx = await sc.generate({
  data: { company: 'Acme', revenue: 2_400_000 },
  instructions: 'Quarterly business review for leadership'
})

await pptx.save('report.pptx')
// or
const buffer = await pptx.toBuffer()
```

## 4 Levels of Control

SlideCraft's `.generate()` method supports 4 levels of control, from fully automatic to fully manual:

### Level 1 — LLM decides everything

Pass your data and instructions. The LLM decides how many slides, what layouts, and all content.

```typescript
const pptx = await sc.generate({
  data: salesJson,
  instructions: 'Resumen Q4 para directivos'
})
```

### Level 2 — Fixed slide count, LLM fills content

You set the exact number of slides. The LLM generates that many.

```typescript
const pptx = await sc.generate({
  data: salesJson,
  slides: 8,
  instructions: 'Enfócate en crecimiento'
})
```

### Level 3 — User defines each slide

You define every slide's blueprint (title, layout, chart type, data key, per-slide instructions). The LLM generates the actual content for each one.

```typescript
const pptx = await sc.generate({
  data: salesJson,
  slides: [
    { title: 'Resumen Ejecutivo', layout: 'title', instructions: 'KPIs principales' },
    { title: 'Ventas por Región', layout: 'chart', chartType: 'bar', dataKey: 'sales_by_region' },
    { title: 'Top Clientes', layout: 'table', dataKey: 'top_clients' },
    { title: 'Proyección Q1', instructions: 'Genera forecast basado en tendencia' }
  ]
})
```

**SlideSpec fields** (all optional):

| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` | Slide title (LLM generates one if omitted) |
| `layout` | `SlideLayout` | Preferred layout |
| `chartType` | `ChartType` | Chart type when layout is `'chart'` |
| `dataKey` | `string` | Key path into data to use for this slide |
| `instructions` | `string` | Per-slide instructions for the LLM |
| `content` | `string[]` | Direct content (used in Level 4) |

### Level 4 — No LLM, direct render

No LLM call at all. You provide everything, SlideCraft just renders the `.pptx`.

```typescript
const pptx = await sc.generate({
  slides: [
    { title: 'Revenue', content: ['$2.5M revenue', '+23% YoY'], layout: 'bullets' },
    { title: 'Team', content: ['85 employees', '5 new markets'], layout: 'bullets' },
    { title: 'Thank You', layout: 'closing' }
  ],
  llm: false
})
```

## Configuration

### SlideCraft Constructor

```typescript
const sc = new SlideCraft({
  llm: {
    provider: 'openai',        // 'openai' | 'anthropic'
    apiKey: 'sk-...',           // API key
    model: 'gpt-4o',           // Optional: model override
    baseURL: 'https://...',    // Optional: custom endpoint
    temperature: 0.7,          // Optional: 0-2 (default: 0.7)
  },
  defaultTemplate: 'general',  // Optional: default template name
  language: 'en',              // Optional: default language
})
```

### LLM Providers

**OpenAI:**
```typescript
{ provider: 'openai', apiKey: 'sk-...', model: 'gpt-4o' }
```

**Anthropic** (via OpenAI-compatible API):
```typescript
{ provider: 'anthropic', apiKey: 'sk-ant-...', model: 'claude-sonnet-4-20250514' }
```

**Any OpenAI-compatible endpoint:**
```typescript
{ provider: 'openai', apiKey: '...', baseURL: 'https://your-proxy.com/v1' }
```

## Generate Options

```typescript
interface GenerateOptions {
  data?: unknown                      // Input data (required for levels 1-3)
  template?: string | TemplateConfig  // Template name or custom config
  slides?: number | SlideSpec[]       // Level 2: count, Level 3: specs
  instructions?: string               // Natural language instructions
  language?: string                   // Override language
  llm?: false                         // Set to false for Level 4
}
```

## Built-in Templates

| Template | Description | Charts? |
|----------|-------------|---------|
| `general` | Clean, versatile template for any topic | No |
| `sales-report` | Data-driven with emphasis on metrics, KPIs, trends | Yes |
| `executive` | Premium minimalist for board/C-suite presentations | Yes |

### Custom Templates

```typescript
import { registerTemplate, type TemplateConfig } from 'slidecraft'

const myTemplate: TemplateConfig = {
  name: 'brand',
  description: 'Our brand template',
  colors: {
    primary: '1A1A2E',
    secondary: '16213E',
    accent: 'E94560',
    background: 'FFFFFF',
    text: '0F3460',
    lightText: '533483',
  },
  fonts: { title: 'Helvetica', body: 'Arial', mono: 'Consolas' },
  preferredLayouts: ['title', 'title-content', 'chart', 'closing'],
  maxSlides: 12,
  preferCharts: true,
}

registerTemplate('brand', myTemplate)

// Use by name
await sc.generate({ data, template: 'brand', instructions: '...' })

// Or pass inline
await sc.generate({ data, template: myTemplate, instructions: '...' })
```

## Slide Layouts

| Layout | Description |
|--------|-------------|
| `title` | Title slide with big title + subtitle |
| `title-content` | Title bar + bullets or body text |
| `bullets` | Alias for `title-content` — bullet list |
| `two-column` | Title + two columns (comparisons) |
| `section-header` | Section divider |
| `chart` | Title + chart (bar, line, pie, doughnut) |
| `table` | Title + data table (headers + rows) |
| `closing` | Closing slide (thank you / Q&A) |
| `blank` | Empty slide |

## Chart Support

When your data contains numeric series, the LLM can generate charts. In Level 3, you can specify the chart type per slide:

```typescript
{ title: 'Revenue Trend', layout: 'chart', chartType: 'line', dataKey: 'monthly_revenue' }
```

Supported: `bar`, `line`, `pie`, `doughnut`.

## Table Support

For tabular data (rankings, comparisons), use the `table` layout:

```typescript
// Level 3 — LLM generates the table from your data
{ title: 'Top Clients', layout: 'table', dataKey: 'clients' }

// Level 4 — You provide the table directly (via renderPresentation)
```

## Advanced: Direct Rendering

Skip SlideCraft entirely and render from your own structure:

```typescript
import { renderPresentation, getTemplate, type PresentationStructure } from 'slidecraft'

const structure: PresentationStructure = {
  title: 'My Presentation',
  slides: [
    { title: 'Hello', layout: 'title', subtitle: 'World' },
    {
      title: 'Key Points',
      layout: 'title-content',
      bullets: [
        { text: 'First point' },
        { text: 'Second point', bold: true },
      ],
    },
    {
      title: 'Data',
      layout: 'table',
      table: {
        headers: ['Metric', 'Value'],
        rows: [['Revenue', '$2.5M'], ['Growth', '+23%']],
      },
    },
    { title: 'Thank You', layout: 'closing' },
  ],
}

const result = renderPresentation(structure, getTemplate('executive'))
await result.save('manual.pptx')
```

## Output

```typescript
interface GenerationResult {
  save(filePath: string): Promise<void>    // Save to file
  toBuffer(): Promise<Buffer>              // Get as buffer
  structure: PresentationStructure         // The slide structure
}
```

## Development

```bash
git clone <repo>
cd slidecraft
npm install
npm run build      # Build ESM + CJS
npm test           # Run tests
npm run typecheck  # Type checking
```

## License

MIT
