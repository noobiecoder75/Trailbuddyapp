import { forwardRef } from 'react'

const Card = forwardRef(({ 
  children, 
  variant = 'default', 
  padding = 'default',
  hover = false,
  className = '', 
  ...props 
}, ref) => {
  const baseClasses = 'bg-white rounded-2xl transition-all duration-300'
  
  const variants = {
    default: 'shadow-card border border-mountain-200',
    elevated: 'shadow-medium',
    outlined: 'border-2 border-mountain-300',
    gradient: 'bg-gradient-to-br from-primary-50 to-mountain-50 shadow-card',
  }
  
  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  }
  
  const hoverClasses = hover ? 'hover:shadow-card-hover hover:scale-105 cursor-pointer' : ''
  
  const variantClasses = variants[variant] || variants.default
  const paddingClasses = paddings[padding] || paddings.default
  
  return (
    <div
      ref={ref}
      className={`${baseClasses} ${variantClasses} ${paddingClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

// Sub-components for better composition
Card.Header = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
)

Card.Body = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
)

Card.Footer = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-mountain-200 ${className}`}>
    {children}
  </div>
)

export default Card