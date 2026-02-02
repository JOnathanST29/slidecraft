import type { TemplateConfig } from '../types.js'

export const minimalTemplate: TemplateConfig = {
  name: 'minimal',
  description: 'Ultra-clean minimal design. Maximum whitespace, subtle colors. Perfect when content speaks for itself.',
  colors: {
    primary: '111111',
    secondary: '444444',
    accent: '0066FF',
    background: 'FFFFFF',
    text: '111111',
    lightText: '999999',
  },
  fonts: {
    title: 'Helvetica Neue',
    body: 'Helvetica Neue',
    mono: 'SF Mono',
  },
  preferredLayouts: ['title', 'title-content', 'bullets', 'section-header', 'closing'],
  maxSlides: 12,
  preferCharts: false,
}
