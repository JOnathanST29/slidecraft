import type { TemplateConfig } from '../types.js'

export const corporateTemplate: TemplateConfig = {
  name: 'corporate',
  description: 'Professional corporate template. Conservative colors, reliable fonts. Ideal for board meetings, quarterly reviews, and formal business presentations.',
  colors: {
    primary: '003366',
    secondary: '336699',
    accent: 'CC6600',
    background: 'FFFFFF',
    text: '333333',
    lightText: '666666',
  },
  fonts: {
    title: 'Arial',
    body: 'Arial',
    mono: 'Courier New',
  },
  preferredLayouts: ['title', 'title-content', 'chart', 'table', 'two-column', 'section-header', 'closing'],
  maxSlides: 20,
  preferCharts: true,
}
