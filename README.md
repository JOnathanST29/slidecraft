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
  data: {
    company: 'Acme Corp',
    revenue: 2_400_000,
    highlights: ['Launched 3 products', 'Grew team to 85 people']
  },
  template: 'general',
  instructions: 'Create a quarterly business review for leadership'
})

await pptx.save('report.pptx')
// or
const buffer = await pptx.toBuffer()
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
const pptx = await sc.generate({
  data: myData,                // Any JSON-serializable data
  template: 'sales-report',   // Template name or custom TemplateConfig
  instructions: '...',        // Natural language instructions
  language: 'es',             // Optional: override language
  maxSlides: 10,              // Optional: max slides
})
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

// Use it
const pptx = await sc.generate({ data, template: 'brand', instructions: '...' })

// Or pass inline
const pptx = await sc.generate({ data, template: myTemplate, instructions: '...' })
```

## Slide Layouts

The LLM can use these layouts:

| Layout | Description |
|--------|-------------|
| `title` | Title slide with big title + subtitle |
| `title-content` | Title bar + bullets or body text |
| `two-column` | Title + two columns (comparisons) |
| `section-header` | Section divider |
| `chart` | Title + chart (bar, line, pie, doughnut) |
| `closing` | Closing slide (thank you / Q&A) |
| `blank` | Empty slide |

## Chart Support

When your data contains numeric series, the LLM can generate charts:

```typescript
// The LLM will detect numeric data and use chart layouts
const pptx = await sc.generate({
  data: {
    monthly: {
      months: ['Jan', 'Feb', 'Mar'],
      revenue: [100000, 120000, 150000],
      costs: [80000, 85000, 90000],
    }
  },
  template: 'sales-report', // preferCharts: true
  instructions: 'Show revenue vs costs trend',
})
```

Supported chart types: `bar`, `line`, `pie`, `doughnut`.

## Advanced: Direct Rendering

Skip the LLM and render from your own structure:

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
    { title: 'Thank You', layout: 'closing' },
  ],
}

const result = renderPresentation(structure, getTemplate('executive'))
await result.save('manual.pptx')
```

## Output

The `.generate()` method returns a `GenerationResult`:

```typescript
interface GenerationResult {
  save(filePath: string): Promise<void>    // Save to file
  toBuffer(): Promise<Buffer>              // Get as buffer
  structure: PresentationStructure         // The LLM-generated structure
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
