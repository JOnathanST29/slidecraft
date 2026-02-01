/**
 * Sales Report — Level 3 with per-slide control + charts
 *
 * Run: npx tsx examples/sales-report.ts
 * Requires: OPENAI_API_KEY environment variable
 */
import { SlideCraft } from '../src/index.js'

async function main() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.log('⚠️  Set OPENAI_API_KEY to run this example')
    return
  }

  const sc = new SlideCraft({
    llm: { provider: 'openai', apiKey },
    language: 'es',
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

  console.log('📊 Generating sales report (Level 3 — per-slide specs)...')

  const pptx = await sc.generate({
    data: salesData,
    template: 'sales-report',
    slides: [
      { title: 'Reporte de Ventas Q4 2025', layout: 'title', instructions: 'Incluye nombre del equipo como subtítulo' },
      { title: 'Resumen Ejecutivo', layout: 'title-content', instructions: 'KPIs principales: revenue total, quota attainment, win rate, avg deal size' },
      { title: 'Rendimiento por Rep', layout: 'table', dataKey: 'reps', instructions: 'Tabla con nombre, deals, revenue, quota, y % de cumplimiento' },
      { title: 'Revenue Mensual', layout: 'chart', chartType: 'bar', dataKey: 'monthlyRevenue', instructions: 'Comparar actual vs target por mes' },
      { title: 'Pipeline por Etapa', layout: 'chart', chartType: 'bar', dataKey: 'pipeline' },
      { title: 'Productos Top', layout: 'chart', chartType: 'pie', dataKey: 'topProducts', instructions: 'Distribución de revenue por producto' },
      { title: 'Conclusiones y Próximos Pasos', layout: 'title-content', instructions: 'Analiza los datos y sugiere 3-4 acciones concretas para Q1' },
      { title: 'Gracias', layout: 'closing' },
    ],
    instructions: 'Genera un reporte de ventas profesional. El equipo superó la cuota — resáltalo.',
  })

  await pptx.save('sales-report.pptx')
  console.log('✅ Saved to sales-report.pptx')

  console.log('\n📋 Slide structure:')
  pptx.structure.slides.forEach((slide, i) => {
    console.log(`  ${i + 1}. [${slide.layout}] ${slide.title}`)
  })
}

main().catch(console.error)
