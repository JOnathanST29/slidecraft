import type { TemplateConfig } from '../types.js'

export const generalTemplate: TemplateConfig = {
  name: 'general',
  description: 'Clean, versatile template for any topic. Neutral colors with modern typography.',
  colors: {
    primary: '2D3748',
    secondary: '4A5568',
    accent: '3182CE',
    background: 'FFFFFF',
    text: '1A202C',
    lightText: '718096',
  },
  fonts: {
    title: 'Calibri',
    body: 'Calibri',
    mono: 'Consolas',
  },
  preferredLayouts: ['title', 'title-content', 'section-header', 'two-column', 'closing'],
  maxSlides: 15,
  preferCharts: false,
}
