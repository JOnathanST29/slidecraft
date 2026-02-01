import type { TemplateConfig } from '../types.js'

export const salesReportTemplate: TemplateConfig = {
  name: 'sales-report',
  description: 'Data-driven sales report template. Emphasizes metrics, KPIs, charts, and performance trends. Uses bold accent colors to highlight key numbers.',
  colors: {
    primary: '1B4F72',
    secondary: '2E86C1',
    accent: 'E74C3C',
    background: 'FFFFFF',
    text: '1C2833',
    lightText: '5D6D7E',
  },
  fonts: {
    title: 'Arial',
    body: 'Arial',
    mono: 'Courier New',
  },
  preferredLayouts: ['title', 'title-content', 'chart', 'two-column', 'section-header', 'closing'],
  maxSlides: 12,
  preferCharts: true,
}
