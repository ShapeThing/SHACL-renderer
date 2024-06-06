import { WidgetItem } from '../widgets/widgets-context'

export const scoreWidgets = (widgets: Array<WidgetItem>, data: GrapoiPointer, property: GrapoiPointer) => {
    const widgetMatches = widgets
      .map((widgetItem) => {
        const score = widgetItem.meta.score(data, property)
        return { widgetItem, score: score === undefined ? -1 : score }
      })
      .sort((a, b) => b.score - a.score)
      .filter(({ score }) => score > -1)
  
    return widgetMatches[0]?.widgetItem
  }
  