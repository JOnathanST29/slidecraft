import type { TemplateConfig } from '../types.js'

export const executiveTemplate: TemplateConfig = {
  name: 'executive',
  description: 'Premium executive-level template for board meetings and C-suite presentations. Minimalist design with dark tones, fewer slides, and high-impact content.',
  colors: {
    primary: '1A1A2E',
    secondary: '16213E',
    accent: 'E94560',
    background: 'F5F5F5',
    text: '0F3460',
    lightText: '533483',
  },
  fonts: {
    title: 'Georgia',
    body: 'Calibri',
    mono: 'Consolas',
  },
  preferredLayouts: ['title', 'title-content', 'chart', 'section-header', 'closing'],
  maxSlides: 10,
  preferCharts: true,
}
