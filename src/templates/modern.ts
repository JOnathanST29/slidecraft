import type { TemplateConfig } from '../types.js'

export const modernTemplate: TemplateConfig = {
  name: 'modern',
  description: 'Contemporary design with vibrant gradients and modern typography. Great for startups, product launches, and tech presentations.',
  colors: {
    primary: '6C63FF',
    secondary: '3F3D56',
    accent: 'FF6584',
    background: 'FFFFFF',
    text: '2D2D2D',
    lightText: '8D8D8D',
  },
  fonts: {
    title: 'Segoe UI',
    body: 'Segoe UI',
    mono: 'Cascadia Code',
  },
  preferredLayouts: ['title', 'title-content', 'two-column', 'chart', 'section-header', 'closing'],
  maxSlides: 15,
  preferCharts: true,
}
