import type { LLMGenerateRequest } from './types.js'

const SCHEMA_REFERENCE = `{
  "title": "Presentation Title",
  "subtitle": "Optional subtitle",
  "author": "Optional author",
  "slides": [
    {
      "title": "Slide Title",
      "subtitle": "Optional subtitle (for title/section-header layouts)",
      "layout": "title | title-content | bullets | two-column | section-header | chart | table | closing",
      "bullets": [
        { "text": "Bullet text", "level": 0, "bold": false }
      ],
      "bodyText": "Paragraph text (alternative to bullets)",
      "leftColumn": { "heading": "Left heading", "bullets": [...], "text": "..." },
      "rightColumn": { "heading": "Right heading", "bullets": [...], "text": "..." },
      "chart": {
        "type": "bar | line | pie | doughnut",
        "title": "Chart title",
        "series": [
          { "name": "Series name", "labels": ["A", "B"], "values": [10, 20] }
        ],
        "showLegend": true,
        "showValues": false
      },
      "table": {
        "headers": ["Col A", "Col B"],
        "rows": [["val1", "val2"]]
      },
      "notes": "Optional speaker notes"
    }
  ]
}`

function buildBaseRules(language: string, template: LLMGenerateRequest['template']): string {
  return `## RULES

1. The FIRST slide should use layout "title" with the presentation title and subtitle.
2. The LAST slide should use layout "closing" (thank you / Q&A / contact info).
3. Use "section-header" layout to separate major sections.
4. Use "chart" layout ONLY when the data contains numeric series suitable for visualization.
5. Use "table" layout when data is best shown in rows/columns (rankings, comparisons with many fields).
6. Use "two-column" layout for comparisons or before/after data.
7. Use "title-content" or "bullets" for most content slides with bullet points.
8. Keep bullets concise — max 6 bullets per slide, max ~15 words per bullet.
9. Include speaker notes for key slides with talking points.
10. All text content must be in ${language}.

## TEMPLATE STYLE

Template: ${template.name}
Description: ${template.description}
Preferred layouts: ${template.preferredLayouts.join(', ')}
${template.preferCharts ? 'This template PREFERS charts when numeric data is available.' : ''}`
}

export function buildSystemPrompt(request: LLMGenerateRequest): string {
  const { template, language, maxSlides, slideCount, slideSpecs } = request

  // ── Level 3: per-slide specs ──
  if (slideSpecs && slideSpecs.length > 0) {
    return `You are SlideCraft, an expert presentation designer. The user has defined a specific slide-by-slide blueprint. Your job is to fill in the content for each slide, generating titles where missing, writing copy, and constructing chart/table data from the provided input data.

## OUTPUT FORMAT

You MUST respond with a single valid JSON object matching this schema:

${SCHEMA_REFERENCE}

## SLIDE BLUEPRINT

You must generate EXACTLY ${slideSpecs.length} slides, one for each spec below (in order):

${slideSpecs.map((spec, i) => {
  const parts = [`Slide ${i + 1}:`]
  if (spec.title) parts.push(`  title: "${spec.title}"`)
  if (spec.layout) parts.push(`  layout: ${spec.layout}`)
  if (spec.chartType) parts.push(`  chartType: ${spec.chartType}`)
  if (spec.dataKey) parts.push(`  dataKey: "${spec.dataKey}" (extract this key from the input data)`)
  if (spec.instructions) parts.push(`  instructions: "${spec.instructions}"`)
  return parts.join('\n')
}).join('\n\n')}

${buildBaseRules(language, template)}

## IMPORTANT

- Generate EXACTLY ${slideSpecs.length} slides, matching the blueprint order.
- For slides with a "dataKey", extract that key from the input data and use it.
- For slides with a "chartType", generate chart data of that type.
- For slides with "instructions", follow them for that specific slide.
- If a slide has no title, generate an appropriate one.
- Respond ONLY with the JSON object — no markdown, no explanation, no code fences.`
  }

  // ── Level 2: fixed count ──
  const slideCountDirective = slideCount
    ? `You MUST generate EXACTLY ${slideCount} slides (including title and closing slides).`
    : maxSlides
      ? `Generate at most ${maxSlides} slides.`
      : 'Generate 8-15 slides depending on data complexity.'

  // ── Level 1: LLM decides everything ──
  return `You are SlideCraft, an expert presentation designer. Your job is to generate a structured JSON representation of a PowerPoint presentation.

## OUTPUT FORMAT

You MUST respond with a single valid JSON object matching this exact schema:

${SCHEMA_REFERENCE}

${buildBaseRules(language, template)}

## SLIDE COUNT

${slideCountDirective}

## IMPORTANT

- Respond ONLY with the JSON object — no markdown, no explanation, no code fences.
- Ensure the JSON is valid and parseable.
- Adapt content to the data provided — be specific, not generic.
- If the data contains numbers/metrics, highlight them prominently.`
}

export function buildUserPrompt(request: LLMGenerateRequest): string {
  const { data, instructions } = request

  const dataStr = typeof data === 'string' ? data : JSON.stringify(data, null, 2)

  const parts: string[] = []

  if (instructions) {
    parts.push(`## USER INSTRUCTIONS\n\n${instructions}`)
  }

  if (data !== undefined && data !== null) {
    parts.push(`## INPUT DATA\n\n\`\`\`json\n${dataStr}\n\`\`\``)
  }

  parts.push('Generate the presentation JSON now.')

  return parts.join('\n\n')
}
