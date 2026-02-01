import type { TemplateConfig } from '../types.js'
import { generalTemplate } from './general.js'
import { salesReportTemplate } from './sales-report.js'
import { executiveTemplate } from './executive.js'

const templates: Record<string, TemplateConfig> = {
  general: generalTemplate,
  'sales-report': salesReportTemplate,
  executive: executiveTemplate,
}

export function getTemplate(name: string): TemplateConfig {
  const template = templates[name]
  if (!template) {
    const available = Object.keys(templates).join(', ')
    throw new Error(`SlideCraft: Unknown template "${name}". Available: ${available}`)
  }
  return template
}

export function listTemplates(): string[] {
  return Object.keys(templates)
}

export function registerTemplate(name: string, config: TemplateConfig): void {
  templates[name] = config
}

export { generalTemplate, salesReportTemplate, executiveTemplate }
