<p align="center">
  <h1 align="center">SlideCraft 🎨</h1>
  <p align="center">
    <strong>TypeScript SDK to generate PowerPoint presentations using LLMs</strong>
  </p>
  <p align="center">
    <a href="https://www.npmjs.com/package/slidecraft"><img src="https://img.shields.io/npm/v/slidecraft?color=blue&label=npm" alt="npm version"></a>
    <a href="https://github.com/jonathanst29/slidecraft/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License"></a>
    <img src="https://img.shields.io/badge/types-TypeScript-blue" alt="TypeScript">
    <img src="https://img.shields.io/badge/LLM_providers-10-purple" alt="10 LLM providers">
  </p>
</p>

Feed your data + instructions → SlideCraft sends it to any LLM → renders a polished `.pptx` file.

```
[JSON data] → [Template] → [LLM (structure + copy)] → [pptxgenjs] → [.pptx]
```

## Why SlideCraft?

- **🔌 Embed in your app** — SDK, not a SaaS. Install, import, generate.
- **🤖 10 LLM providers** — OpenAI, Anthropic, Gemini, Mistral, Groq, DeepSeek, Together, Perplexity, xAI, Cohere
- **🎛️ 4 levels of control** — from "LLM decides everything" to "no LLM at all"
- **📊 Charts & tables** — bar, line, pie, doughnut charts + data tables out of the box
- **🎨 Custom templates** — use built-in or register your own brand colors/fonts
- **📦 Zero config** — just add your API key and go

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

// Pass your data, get a presentation
const pptx = await sc.generate({
  data: { company: 'Acme', revenue: 2_400_000, growth: '23%' },
  instructions: 'Quarterly business review for leadership'
})

await pptx.save('report.pptx')
// or
const buffer = await pptx.toBuffer()
```

## 4 Levels of Control

### Level 1 — LLM decides everything

Just pass data and instructions. The LLM decides slide count, layouts, and content.

```typescript
const pptx = await sc.generate({
  data: crmData,
  instructions: 'Executive sales report for Q4'
})
```

### Level 2 — Fixed slide count

You set how many slides. The LLM fills them.

```typescript
const pptx = await sc.generate({
  data: crmData,
  slides: 8,
  instructions: 'Focus on growth and retention'
})
```

### Level 3 — Define each slide

You define every slide's blueprint. The LLM generates content for each one.

```typescript
const pptx = await sc.generate({
  data: crmData,
  slides: [
    { title: 'Executive Summary', layout: 'title', instructions: 'Main KPIs' },
    { title: 'Revenue by Region', layout: 'chart', chartType: 'bar', dataKey: 'by_region' },
    { title: 'Top Clients', layout: 'table', dataKey: 'top_clients' },
    { title: 'Q1 Forecast', instructions: 'Generate forecast from trend data' }
  ]
})
```

### Level 4 — No LLM

Zero API calls. You provide everything, SlideCraft just renders the `.pptx`.

```typescript
const pptx = await sc.generate({
  slides: [
    { title: 'Revenue', content: ['$2.5M total', '+23% YoY'], layout: 'bullets' },
    { title: 'Thank You', layout: 'closing' }
  ],
  llm: false
})
```

## LLM Providers

Use any of 10 providers — just change `provider` and `apiKey`:

```typescript
// OpenAI
{ provider: 'openai', apiKey: 'sk-...' }

// Anthropic (Claude)
{ provider: 'anthropic', apiKey: 'sk-ant-...' }

// Google Gemini
{ provider: 'gemini', apiKey: 'AIza...' }

// Mistral
{ provider: 'mistral', apiKey: '...' }

// Groq
{ provider: 'groq', apiKey: 'gsk_...' }

// DeepSeek
{ provider: 'deepseek', apiKey: '...' }

// Together AI
{ provider: 'together', apiKey: '...' }

// Perplexity
{ provider: 'perplexity', apiKey: 'pplx-...' }

// xAI (Grok)
{ provider: 'xai', apiKey: 'xai-...' }

// Cohere
{ provider: 'cohere', apiKey: '...' }
```

Each provider has a pre-configured `baseURL` and default model. Override with `model` and `baseURL`:

```typescript
{
  provider: 'openai',
  apiKey: 'sk-...',
  model: 'gpt-4o-mini',           // cheaper model
  baseURL: 'https://my-proxy/v1',  // custom endpoint
  temperature: 0.5                  // less creative
}
```

## Templates

### Built-in

| Template | Style | Charts | Max Slides |
|----------|-------|--------|------------|
| `general` | Clean, neutral (Calibri) | No | 15 |
| `sales-report` | Data-driven, blue/red (Arial) | Yes | 12 |
| `executive` | Premium dark, minimalist (Georgia) | Yes | 10 |

```typescript
await sc.generate({ data, template: 'executive', instructions: '...' })
```

### Custom Templates

```typescript
import { registerTemplate } from 'slidecraft'

registerTemplate('brand', {
  name: 'brand',
  description: 'Our company template',
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
})

await sc.generate({ data, template: 'brand', instructions: '...' })
```

## Slide Layouts

| Layout | Description |
|--------|-------------|
| `title` | Big title + subtitle |
| `title-content` | Title bar + bullets or body text |
| `bullets` | Alias for `title-content` |
| `two-column` | Side-by-side comparison |
| `section-header` | Section divider |
| `chart` | Bar, line, pie, or doughnut chart |
| `table` | Data table with headers + rows |
| `closing` | Thank you / Q&A |
| `blank` | Empty slide |

## Charts & Tables

Charts are generated automatically when your data has numeric series:

```typescript
// Level 3 — specify chart type per slide
{ layout: 'chart', chartType: 'bar', dataKey: 'monthly_revenue' }
{ layout: 'chart', chartType: 'pie', dataKey: 'market_share' }
```

Supported: `bar` · `line` · `pie` · `doughnut`

Tables work similarly:

```typescript
{ layout: 'table', dataKey: 'top_clients', instructions: 'Show name, revenue, deals' }
```

## Real-World Example: CRM Sales Data

```typescript
const sc = new SlideCraft({
  llm: { provider: 'gemini', apiKey: process.env.GEMINI_API_KEY! },
  language: 'es',
})

// Your CRM already has this data as JSON
const salesReps = await fetch('/api/sales/reps').then(r => r.json())

const pptx = await sc.generate({
  data: salesReps,
  template: 'sales-report',
  slides: [
    { title: 'Team Performance', layout: 'title' },
    { title: 'Overview', layout: 'bullets', instructions: 'Total volume, accounts, UP vs DOWN trends' },
    { title: 'Top 10 by Volume', layout: 'chart', chartType: 'bar' },
    { title: 'Top 10 Detail', layout: 'table', instructions: 'Name, Volume YTD, LY, Variation %, Accounts' },
    { title: 'Growth Reps', layout: 'two-column', instructions: 'UP reps on left, insights on right' },
    { title: 'Declining Reps', layout: 'two-column', instructions: 'DOWN reps on left, actions on right' },
    { title: 'Conclusions', layout: 'bullets' },
    { title: 'Questions?', layout: 'closing' },
  ],
})

await pptx.save('sales-report.pptx')
```

## Advanced: Direct Rendering

Skip LLM entirely and render from your own structure:

```typescript
import { renderPresentation, getTemplate } from 'slidecraft'

const result = renderPresentation({
  title: 'My Deck',
  slides: [
    { title: 'Hello', layout: 'title', subtitle: 'World' },
    {
      title: 'Data',
      layout: 'table',
      table: {
        headers: ['Metric', 'Value'],
        rows: [['Revenue', '$2.5M'], ['Growth', '+23%']],
      },
    },
  ],
}, getTemplate('executive'))

await result.save('manual.pptx')
```

## SlideSpec Reference

| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` | Slide title (LLM generates if omitted) |
| `layout` | `SlideLayout` | Preferred layout |
| `chartType` | `ChartType` | `bar` · `line` · `pie` · `doughnut` |
| `dataKey` | `string` | Key path into data for this slide |
| `instructions` | `string` | Per-slide instructions for the LLM |
| `content` | `string[]` | Direct bullet content (Level 4) |

## GenerateOptions Reference

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `data` | `unknown` | — | Input data (JSON-serializable) |
| `template` | `string \| TemplateConfig` | `'general'` | Template name or config |
| `slides` | `number \| SlideSpec[]` | — | Level 2: count, Level 3: specs |
| `instructions` | `string` | — | Natural language instructions |
| `language` | `string` | `'en'` | Output language |
| `maxSlides` | `number` | template default | Hint for LLM |
| `llm` | `false` | — | Skip LLM (Level 4) |

## Output

```typescript
const result = await sc.generate({ ... })

await result.save('deck.pptx')           // Save to file
const buffer = await result.toBuffer()    // Get as Buffer
console.log(result.structure)             // Inspect slide structure
```

## Development

```bash
git clone https://github.com/jonathanst29/slidecraft.git
cd slidecraft
npm install
npm run build      # ESM + CJS
npm test           # 57 tests
npm run typecheck  # Type checking
```

## License

MIT © [Jonathan Terán](https://x.com/jonathanst29)
