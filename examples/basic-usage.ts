/**
 * SlideCraft — 4 levels of control
 *
 * Run: npx tsx examples/basic-usage.ts
 * Requires: OPENAI_API_KEY for levels 1-3
 */
import { SlideCraft } from '../src/index.js'

const apiKey = process.env.OPENAI_API_KEY

const data = {
  company: 'Acme Corp',
  quarter: 'Q4 2025',
  highlights: [
    'Launched 3 new products',
    'Expanded to 5 new markets',
    'Team grew from 50 to 85 employees',
  ],
  metrics: {
    revenue: { current: 2400000, previous: 1800000, unit: 'USD' },
    customers: { current: 1200, previous: 850 },
    nps: { current: 72, previous: 65 },
  },
}

async function main() {
  // ────────────────────────────────────────────
  // Level 4: No LLM — direct render (always works)
  // ────────────────────────────────────────────
  console.log('🔧 Level 4: Direct render (no LLM)...')

  const sc4 = new SlideCraft({
    llm: { provider: 'openai', apiKey: 'not-needed' },
  })

  const level4 = await sc4.generate({
    slides: [
      { title: 'Acme Corp Q4 2025', layout: 'title' },
      { title: 'Highlights', content: data.highlights, layout: 'bullets' },
      {
        title: 'Key Metrics',
        content: [
          `Revenue: $${(data.metrics.revenue.current / 1e6).toFixed(1)}M (+${Math.round(((data.metrics.revenue.current - data.metrics.revenue.previous) / data.metrics.revenue.previous) * 100)}%)`,
          `Customers: ${data.metrics.customers.current} (+${data.metrics.customers.current - data.metrics.customers.previous})`,
          `NPS: ${data.metrics.nps.current} (+${data.metrics.nps.current - data.metrics.nps.previous})`,
        ],
        layout: 'bullets',
      },
      { title: 'Thank You', content: ['Questions?'], layout: 'closing' },
    ],
    llm: false,
  })

  await level4.save('level4-direct.pptx')
  console.log('  ✅ Saved level4-direct.pptx')

  // ────────────────────────────────────────────
  // Levels 1-3 require an API key
  // ────────────────────────────────────────────
  if (!apiKey) {
    console.log('\n⚠️  Set OPENAI_API_KEY to run levels 1-3')
    return
  }

  const sc = new SlideCraft({
    llm: { provider: 'openai', apiKey },
  })

  // ── Level 1: LLM decides everything ──
  console.log('\n🤖 Level 1: LLM decides everything...')
  const level1 = await sc.generate({
    data,
    instructions: 'Create a quarterly review for leadership',
  })
  await level1.save('level1-auto.pptx')
  console.log(`  ✅ Saved level1-auto.pptx (${level1.structure.slides.length} slides)`)

  // ── Level 2: Fixed count, LLM fills ──
  console.log('\n📊 Level 2: Fixed 6 slides...')
  const level2 = await sc.generate({
    data,
    slides: 6,
    instructions: 'Focus on growth metrics',
  })
  await level2.save('level2-fixed.pptx')
  console.log(`  ✅ Saved level2-fixed.pptx (${level2.structure.slides.length} slides)`)

  // ── Level 3: User defines each slide ──
  console.log('\n🎯 Level 3: Per-slide specs...')
  const level3 = await sc.generate({
    data,
    slides: [
      { title: 'Q4 2025 Review', layout: 'title' },
      { title: 'Key Highlights', layout: 'title-content', instructions: 'Focus on the 3 highlights' },
      { title: 'Revenue Growth', layout: 'chart', chartType: 'bar', dataKey: 'metrics' },
      { instructions: 'Conclude with next steps' },
    ],
  })
  await level3.save('level3-specs.pptx')
  console.log(`  ✅ Saved level3-specs.pptx (${level3.structure.slides.length} slides)`)
}

main().catch(console.error)
