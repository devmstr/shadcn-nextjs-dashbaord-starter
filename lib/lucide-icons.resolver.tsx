import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode, SVGProps } from 'react'

type IconProps = {
  name: string
} & SVGProps<SVGSVGElement>

/**
 * Render a Lucide icon directly as a ReactNode
 *
 * @param props - includes `name` and any SVG/React props
 * @returns ReactNode (icon or fallback span)
 */
export function DynamicIcon({ name, ...props }: IconProps): ReactNode {
  const icons = LucideIcons as unknown as Record<string, LucideIcon>
  const Icon = icons[name]

  if (!Icon) {
    // Return a valid <svg> as fallback, avoids HTMLSpanElement typing issues
    return (
      <svg {...props} viewBox="0 0 24 24" stroke="currentColor" fill="none">
        <text x="4" y="16" fontSize="12">
          ?
        </text>
      </svg>
    )
  }

  return <Icon {...props} />
}
