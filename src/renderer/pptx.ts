import PptxGenJS from 'pptxgenjs'
import type {
  BulletPoint,
  ChartConfig,
  ChartType,
  GenerationResult,
  PresentationStructure,
  SlideColumnContent,
  SlideDefinition,
  TemplateConfig,
} from '../types.js'

// Chart type string constants matching pptxgenjs CHART_NAME
const CHART_TYPES: Record<ChartType, string> = {
  bar: 'bar',
  line: 'line',
  pie: 'pie',
  doughnut: 'doughnut',
}

function mapChartType(type: ChartType): PptxGenJS.CHART_NAME {
  return (CHART_TYPES[type] ?? 'bar') as PptxGenJS.CHART_NAME
}

function hexToRgb(hex: string): string {
  return hex.replace(/^#/, '')
}

function bulletsToTextProps(
  bullets: BulletPoint[],
  template: TemplateConfig,
): PptxGenJS.TextProps[] {
  return bullets.map((b) => ({
    text: b.text,
    options: {
      fontSize: 16,
      fontFace: template.fonts.body,
      color: hexToRgb(template.colors.text),
      bullet: { indent: 20 + (b.level ?? 0) * 15 },
      bold: b.bold ?? false,
      indentLevel: b.level ?? 0,
      breakLine: true,
      paraSpaceAfter: 6,
    },
  }))
}

function renderTitleSlide(
  pptx: PptxGenJS,
  slide: SlideDefinition,
  template: TemplateConfig,
): void {
  const s = pptx.addSlide()
  s.background = { color: hexToRgb(template.colors.primary) }

  s.addText(slide.title, {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 1.5,
    fontSize: 36,
    fontFace: template.fonts.title,
    color: 'FFFFFF',
    bold: true,
    align: 'center',
    valign: 'middle',
  })

  if (slide.subtitle) {
    s.addText(slide.subtitle, {
      x: 1,
      y: 3.2,
      w: 8,
      h: 1,
      fontSize: 20,
      fontFace: template.fonts.body,
      color: 'CCCCCC',
      align: 'center',
      valign: 'middle',
    })
  }

  if (slide.notes) s.addNotes(slide.notes)
}

function renderSectionHeader(
  pptx: PptxGenJS,
  slide: SlideDefinition,
  template: TemplateConfig,
): void {
  const s = pptx.addSlide()
  s.background = { color: hexToRgb(template.colors.secondary) }

  s.addText(slide.title, {
    x: 0.5,
    y: 2,
    w: 9,
    h: 1.5,
    fontSize: 32,
    fontFace: template.fonts.title,
    color: 'FFFFFF',
    bold: true,
    align: 'center',
    valign: 'middle',
  })

  if (slide.subtitle) {
    s.addText(slide.subtitle, {
      x: 1,
      y: 3.5,
      w: 8,
      h: 1,
      fontSize: 18,
      fontFace: template.fonts.body,
      color: 'DDDDDD',
      align: 'center',
    })
  }

  if (slide.notes) s.addNotes(slide.notes)
}

function renderTitleContent(
  pptx: PptxGenJS,
  slide: SlideDefinition,
  template: TemplateConfig,
): void {
  const s = pptx.addSlide()

  // Title bar
  s.addShape('rect' as PptxGenJS.SHAPE_NAME, {
    x: 0,
    y: 0,
    w: 10,
    h: 1.2,
    fill: { color: hexToRgb(template.colors.primary) },
  })

  s.addText(slide.title, {
    x: 0.5,
    y: 0.1,
    w: 9,
    h: 1,
    fontSize: 24,
    fontFace: template.fonts.title,
    color: 'FFFFFF',
    bold: true,
    valign: 'middle',
  })

  // Content
  if (slide.bullets && slide.bullets.length > 0) {
    s.addText(bulletsToTextProps(slide.bullets, template), {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 4,
      valign: 'top',
    })
  } else if (slide.bodyText) {
    s.addText(slide.bodyText, {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 4,
      fontSize: 16,
      fontFace: template.fonts.body,
      color: hexToRgb(template.colors.text),
      valign: 'top',
      paraSpaceAfter: 8,
    })
  }

  if (slide.notes) s.addNotes(slide.notes)
}

function renderColumnContent(
  s: PptxGenJS.Slide,
  col: SlideColumnContent,
  x: number,
  w: number,
  template: TemplateConfig,
): void {
  let yOffset = 1.5

  if (col.heading) {
    s.addText(col.heading, {
      x,
      y: yOffset,
      w,
      h: 0.6,
      fontSize: 18,
      fontFace: template.fonts.title,
      color: hexToRgb(template.colors.accent),
      bold: true,
    })
    yOffset += 0.7
  }

  if (col.bullets && col.bullets.length > 0) {
    s.addText(bulletsToTextProps(col.bullets, template), {
      x,
      y: yOffset,
      w,
      h: 3.5,
      valign: 'top',
    })
  } else if (col.text) {
    s.addText(col.text, {
      x,
      y: yOffset,
      w,
      h: 3.5,
      fontSize: 14,
      fontFace: template.fonts.body,
      color: hexToRgb(template.colors.text),
      valign: 'top',
    })
  }
}

function renderTwoColumn(
  pptx: PptxGenJS,
  slide: SlideDefinition,
  template: TemplateConfig,
): void {
  const s = pptx.addSlide()

  // Title bar
  s.addShape('rect' as PptxGenJS.SHAPE_NAME, {
    x: 0,
    y: 0,
    w: 10,
    h: 1.2,
    fill: { color: hexToRgb(template.colors.primary) },
  })

  s.addText(slide.title, {
    x: 0.5,
    y: 0.1,
    w: 9,
    h: 1,
    fontSize: 24,
    fontFace: template.fonts.title,
    color: 'FFFFFF',
    bold: true,
    valign: 'middle',
  })

  // Divider line
  s.addShape('line' as PptxGenJS.SHAPE_NAME, {
    x: 5,
    y: 1.4,
    w: 0,
    h: 4,
    line: { color: hexToRgb(template.colors.lightText), width: 1 },
  })

  if (slide.leftColumn) {
    renderColumnContent(s, slide.leftColumn, 0.5, 4.2, template)
  }
  if (slide.rightColumn) {
    renderColumnContent(s, slide.rightColumn, 5.3, 4.2, template)
  }

  if (slide.notes) s.addNotes(slide.notes)
}

function renderChart(
  pptx: PptxGenJS,
  slide: SlideDefinition,
  template: TemplateConfig,
): void {
  const s = pptx.addSlide()

  // Title bar
  s.addShape('rect' as PptxGenJS.SHAPE_NAME, {
    x: 0,
    y: 0,
    w: 10,
    h: 1.2,
    fill: { color: hexToRgb(template.colors.primary) },
  })

  s.addText(slide.title, {
    x: 0.5,
    y: 0.1,
    w: 9,
    h: 1,
    fontSize: 24,
    fontFace: template.fonts.title,
    color: 'FFFFFF',
    bold: true,
    valign: 'middle',
  })

  if (slide.chart) {
    const chartData = slide.chart.series.map((series) => ({
      name: series.name,
      labels: series.labels,
      values: series.values,
    }))

    const chartType = mapChartType(slide.chart.type)
    const isPie = slide.chart.type === 'pie' || slide.chart.type === 'doughnut'

    s.addChart(chartType, chartData, {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 4.5,
      showTitle: !!slide.chart.title,
      title: slide.chart.title ?? '',
      titleColor: hexToRgb(template.colors.text),
      showLegend: slide.chart.showLegend ?? true,
      legendPos: 'b',
      showValue: slide.chart.showValues ?? false,
      chartColors: [
        hexToRgb(template.colors.primary),
        hexToRgb(template.colors.accent),
        hexToRgb(template.colors.secondary),
        '27AE60',
        'F39C12',
        '8E44AD',
      ],
      ...(isPie ? { dataLabelPosition: 'outEnd' } : {}),
    } as PptxGenJS.IChartOpts)
  }

  if (slide.notes) s.addNotes(slide.notes)
}

function renderClosing(
  pptx: PptxGenJS,
  slide: SlideDefinition,
  template: TemplateConfig,
): void {
  const s = pptx.addSlide()
  s.background = { color: hexToRgb(template.colors.primary) }

  s.addText(slide.title, {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 1.5,
    fontSize: 36,
    fontFace: template.fonts.title,
    color: 'FFFFFF',
    bold: true,
    align: 'center',
    valign: 'middle',
  })

  if (slide.bodyText || slide.subtitle) {
    s.addText(slide.bodyText ?? slide.subtitle ?? '', {
      x: 1,
      y: 3.2,
      w: 8,
      h: 1.5,
      fontSize: 18,
      fontFace: template.fonts.body,
      color: 'CCCCCC',
      align: 'center',
      valign: 'top',
    })
  }

  if (slide.notes) s.addNotes(slide.notes)
}

function renderBlank(
  pptx: PptxGenJS,
  slide: SlideDefinition,
  _template: TemplateConfig,
): void {
  const s = pptx.addSlide()
  if (slide.notes) s.addNotes(slide.notes)
}

export function renderPresentation(
  structure: PresentationStructure,
  template: TemplateConfig,
): GenerationResult {
  const pptx = new PptxGenJS()

  // Metadata
  pptx.title = structure.title
  if (structure.author) pptx.author = structure.author
  pptx.layout = 'LAYOUT_WIDE' // 13.33 x 7.5 — we use 10x5.63 content area

  // Render each slide
  for (const slide of structure.slides) {
    switch (slide.layout) {
      case 'title':
        renderTitleSlide(pptx, slide, template)
        break
      case 'section-header':
        renderSectionHeader(pptx, slide, template)
        break
      case 'title-content':
        renderTitleContent(pptx, slide, template)
        break
      case 'two-column':
        renderTwoColumn(pptx, slide, template)
        break
      case 'chart':
        renderChart(pptx, slide, template)
        break
      case 'closing':
        renderClosing(pptx, slide, template)
        break
      case 'blank':
        renderBlank(pptx, slide, template)
        break
      case 'image-text':
        // Fallback to title-content for now
        renderTitleContent(pptx, slide, template)
        break
      default:
        renderTitleContent(pptx, slide, template)
    }
  }

  return {
    structure,
    async save(filePath: string): Promise<void> {
      await pptx.writeFile({ fileName: filePath })
    },
    async toBuffer(): Promise<Buffer> {
      const output = await pptx.write({ outputType: 'nodebuffer' })
      return output as Buffer
    },
  }
}
