import { WidgetProps } from '../../widgets-context'

export default function ColorViewer({ term }: WidgetProps) {
  return (
    <>
      {/* @ts-ignore */}
      <div className="color-block" style={{ '--color': term.value }} title={term.value} />
      {term.value}
    </>
  )
}
