import { describe, it, expect } from 'vitest'
import {
  getTemplate,
  listTemplates,
  registerTemplate,
  generalTemplate,
  salesReportTemplate,
  executiveTemplate,
} from '../src/templates/index.js'
import type { TemplateConfig } from '../src/types.js'

describe('Templates', () => {
  it('should list all built-in templates', () => {
    const names = listTemplates()
    expect(names).toContain('general')
    expect(names).toContain('sales-report')
    expect(names).toContain('executive')
    expect(names).toHaveLength(3)
  })

  it('should get template by name', () => {
    const tmpl = getTemplate('general')
    expect(tmpl.name).toBe('general')
    expect(tmpl.colors).toBeDefined()
    expect(tmpl.fonts).toBeDefined()
    expect(tmpl.preferredLayouts).toBeInstanceOf(Array)
  })

  it('should throw for unknown template', () => {
    expect(() => getTemplate('nonexistent')).toThrow('Unknown template')
  })

  it('should have valid color hex codes (6 chars)', () => {
    for (const tmpl of [generalTemplate, salesReportTemplate, executiveTemplate]) {
      for (const [key, value] of Object.entries(tmpl.colors)) {
        expect(value, `${tmpl.name}.colors.${key}`).toMatch(/^[0-9A-Fa-f]{6}$/)
      }
    }
  })

  it('sales-report should prefer charts', () => {
    expect(salesReportTemplate.preferCharts).toBe(true)
  })

  it('general should not prefer charts', () => {
    expect(generalTemplate.preferCharts).toBe(false)
  })

  it('should register custom templates', () => {
    const custom: TemplateConfig = {
      name: 'custom',
      description: 'Test custom template',
      colors: {
        primary: 'FF0000',
        secondary: '00FF00',
        accent: '0000FF',
        background: 'FFFFFF',
        text: '000000',
        lightText: '888888',
      },
      fonts: { title: 'Arial', body: 'Arial', mono: 'Courier' },
      preferredLayouts: ['title', 'title-content', 'closing'],
    }

    registerTemplate('custom', custom)
    const retrieved = getTemplate('custom')
    expect(retrieved.name).toBe('custom')
    expect(listTemplates()).toContain('custom')
  })
})
