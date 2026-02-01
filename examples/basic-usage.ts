/**
 * Basic SlideCraft usage example
 *
 * Run: npx tsx examples/basic-usage.ts
 * Requires: OPENAI_API_KEY environment variable
 */
import { SlideCraft } from '../src/index.js'

async function main() {
  const sc = new SlideCraft({
    llm: {
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY!,
      model: 'gpt-4o',
    },
  })

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
    challenges: [
      'Supply chain delays in APAC region',
      'Increased competition in enterprise segment',
    ],
    nextQuarterGoals: [
      'Launch mobile app v2.0',
      'Enter European market',
      'Achieve 1500 customers',
    ],
  }

  console.log('🎨 Generating presentation...')

  const pptx = await sc.generate({
    data,
    template: 'general',
    instructions: 'Create a quarterly business review presentation for the leadership team. Highlight key achievements and growth metrics.',
  })

  await pptx.save('basic-example.pptx')
  console.log('✅ Saved to basic-example.pptx')

  // Also get as buffer
  const buffer = await pptx.toBuffer()
  console.log(`📦 Buffer size: ${(buffer.length / 1024).toFixed(1)} KB`)
}

main().catch(console.error)
