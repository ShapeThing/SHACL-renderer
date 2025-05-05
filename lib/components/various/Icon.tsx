import { Icon as IconifyIcon } from '@iconify/react'
import { CSSProperties, MouseEventHandler } from 'react'

const iconMap = {}

export default function Icon({
  icon,
  style,
  onClick,
  className
}: {
  icon: string
  style?: CSSProperties
  onClick?: MouseEventHandler<SVGSVGElement>
  className?: string
}) {
  return (
    <IconifyIcon
      className={`iconify ${className}`}
      style={style}
      ssr={true}
      icon={iconMap[icon as keyof typeof iconMap] ?? icon}
      onClick={onClick}
    />
  )
}
