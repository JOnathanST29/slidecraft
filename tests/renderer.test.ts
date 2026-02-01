import { describe, it, expect } from 'vitest'
import { renderPresentation } from '../src/renderer/pptx.js'
import { generalTemplate } from '../src/templates/index.js'
import type { PresentationStructure } from '../src/types.js'

describe('Renderer', () => {
  const minimalStructure: PresentationStructure = {
    title: 'Test Presentation',
    subtitle: 'A test',
    slides: [
      {
        title: 'Welcome',
        subtitle: 'Introduction',
        layout: 'title',
        notes: 'Opening slide',
      },
      {
        title: 'Key Points',
        layout: 'title-content',
        bullets: [
          { text: 'First point', level: 0 },
          { text: 'Second point', level: 0 },
          { text: 'Sub point', level: 1 },
        ],
      },
      {
        title: 'Thank You',
        layout: 'closing',
        bodyText: 'Questions?',
      },
    ],
  }

  it('should render a minimal presentation', () => {
    const result = renderPresentation(minimalStructure, generalTemplate)
    expect(result).toBeDefined()
    expect(result.structure).toEqual(minimalStructure)
    expect(typeof result.save).toBe('function')
    expect(typeof result.toBuffer).toBe('function')
  })

  it('should produce a valid buffer', async () => {
    const result = renderPresentation(minimalStructure, generalTemplate)
    const buffer = await result.toBuffer()
    expect(buffer).toBeInstanceOf(Buffer)
    expect(buffer.length).toBeGreaterThan(0)
    // PPTX files are ZIP archives — check for PK magic bytes
    expect(buffer[0]).toBe(0x50) // P
    expect(buffer[1]).toBe(0x4b) // K
  })

  it('should handle two-column layout', async () => {
    const structure: PresentationStructure = {
      title: 'Test',
      slides: [
        {
          title: 'Comparison',
          layout: 'two-column',
          leftColumn: {
            heading: 'Before',
            bullets: [{ text: 'Old way' }],
          },
          rightColumn: {
            heading: 'After',
            bullets: [{ text: 'New way' }],
          },
        },
      ],
    }
    const result = renderPresentation(structure, generalTemplate)
    const buffer = await result.toBuffer()
    expect(buffer.length).toBeGreaterThan(0)
  })

  it('should handle chart layout', async () => {
    const structure: PresentationStructure = {
      title: 'Test',
      slides: [
        {
          title: 'Revenue Chart',
          layout: 'chart',
          chart: {
            type: 'bar',
            title: 'Monthly Revenue',
            series: [
              {
                name: 'Revenue',
                labels: ['Jan', 'Feb', 'Mar'],
                values: [100, 200, 300],
              },
            ],
            showLegend: true,
          },
        },
      ],
    }
    const result = renderPresentation(structure, generalTemplate)
    const buffer = await result.toBuffer()
    expect(buffer.length).toBeGreaterThan(0)
  })

  it('should handle section-header layout', async () => {
    const structure: PresentationStructure = {
      title: 'Test',
      slides: [
        {
          title: 'Section One',
          subtitle: 'Deep dive',
          layout: 'section-header',
        },
      ],
    }
    const result = renderPresentation(structure, generalTemplate)
    const buffer = await result.toBuffer()
    expect(buffer.length).toBeGreaterThan(0)
  })

  it('should handle pie chart', async () => {
    const structure: PresentationStructure = {
      title: 'Test',
      slides: [
        {
          title: 'Market Share',
          layout: 'chart',
          chart: {
            type: 'pie',
            series: [
              {
                name: 'Share',
                labels: ['Us', 'Them', 'Others'],
                values: [45, 35, 20],
              },
            ],
          },
        },
      ],
    }
    const result = renderPresentation(structure, generalTemplate)
    const buffer = await result.toBuffer()
    expect(buffer.length).toBeGreaterThan(0)
  })

  it('should handle bodyText in title-content', async () => {
    const structure: PresentationStructure = {
      title: 'Test',
      slides: [
        {
          title: 'About Us',
          layout: 'title-content',
          bodyText: 'We are a company that does great things.',
        },
      ],
    }
    const result = renderPresentation(structure, generalTemplate)
    const buffer = await result.toBuffer()
    expect(buffer.length).toBeGreaterThan(0)
  })

  it('should handle "bullets" layout alias', async () => {
    const structure: PresentationStructure = {
      title: 'Test',
      slides: [
        {
          title: 'Quick Points',
          layout: 'bullets',
          bullets: [
            { text: 'Item A' },
            { text: 'Item B' },
          ],
        },
      ],
    }
    const result = renderPresentation(structure, generalTemplate)
    const buffer = await result.toBuffer()
    expect(buffer.length).toBeGreaterThan(0)
  })

  it('should handle table layout', async () => {
    const structure: PresentationStructure = {
      title: 'Test',
      slides: [
        {
          title: 'Top Clients',
          layout: 'table',
          table: {
            headers: ['Client', 'Revenue', 'Deals'],
            rows: [
              ['Acme Corp', '$500K', '12'],
              ['Globex', '$320K', '8'],
              ['Initech', '$280K', '6'],
            ],
          },
        },
      ],
    }
    const result = renderPresentation(structure, generalTemplate)
    const buffer = await result.toBuffer()
    expect(buffer.length).toBeGreaterThan(0)
  })
})
