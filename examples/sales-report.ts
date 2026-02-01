/**
 * Sales Report example with charts
 *
 * Run: npx tsx examples/sales-report.ts
 * Requires: OPENAI_API_KEY environment variable
 */
import { SlideCraft } from '../src/index.js'

async function main() {
  const sc = new SlideCraft({
    llm: {
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY!,
    },
    language: 'es', // Spanish output
  })

  const salesData = {
    period: 'Q4 2025',
    team: 'North America Sales',
    reps: [
      { name: 'Alice Johnson', deals: 24, revenue: 580000, quota: 500000 },
      { name: 'Bob Smith', deals: 18, revenue: 420000, quota: 500000 },
      { name: 'Carol Davis', deals: 31, revenue: 720000, quota: 600000 },
      { name: 'Dan Wilson', deals: 15, revenue: 350000, quota: 450000 },
    ],
    pipeline: {
      stages: ['Prospecting', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'],
      values: [1200000, 800000, 600000, 400000, 2070000],
    },
    monthlyRevenue: {
      months: ['Oct', 'Nov', 'Dec'],
      actual: [620000, 710000, 740000],
      target: [650000, 700000, 750000],
    },
    winRate: 0.34,
    avgDealSize: 23500,
    totalRevenue: 2070000,
    quotaAttainment: 1.01,
    topProducts: [
      { name: 'Enterprise Suite', revenue: 890000, deals: 12 },
      { name: 'Pro Plan', revenue: 650000, deals: 38 },
      { name: 'Starter Pack', revenue: 530000, deals: 38 },
    ],
  }

  console.log('📊 Generating sales report...')

  const pptx = await sc.generate({
    data: salesData,
    template: 'sales-report',
    instructions: 'Genera un reporte de ventas ejecutivo para Q4 2025. Incluye análisis de rendimiento por rep, pipeline, tendencias mensuales, y productos top. Destaca que el equipo superó la cuota.',
    maxSlides: 10,
  })

  await pptx.save('sales-report.pptx')
  console.log('✅ Saved to sales-report.pptx')

  // Log the structure the LLM generated
  console.log('\n📋 Slide structure:')
  pptx.structure.slides.forEach((slide, i) => {
    console.log(`  ${i + 1}. [${slide.layout}] ${slide.title}`)
  })
}

main().catch(console.error)
