import type { HTMLAttributes } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  title?: string
  subtitle?: string
}

export function Card({ title, subtitle, children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-gray-200 p-4 ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}
