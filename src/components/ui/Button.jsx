import { forwardRef } from 'react'

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-mountain-gradient text-white hover:scale-105 hover:shadow-medium focus:ring-primary-500',
    secondary: 'bg-adventure-gradient text-white hover:scale-105 hover:shadow-medium focus:ring-secondary-500',
    outline: 'border-2 border-primary-500 text-primary-700 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-mountain-700 hover:bg-mountain-100 focus:ring-mountain-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 hover:scale-105 focus:ring-red-500',
    success: 'bg-success text-white hover:bg-green-600 hover:scale-105 focus:ring-green-500',
  }
  
  const sizes = {
    xs: 'px-3 py-2 text-xs min-h-[36px]',
    sm: 'px-4 py-2 text-sm min-h-[40px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[48px]',
    xl: 'px-10 py-5 text-xl min-h-[52px]',
  }
  
  const variantClasses = variants[variant] || variants.primary
  const sizeClasses = sizes[size] || sizes.md
  
  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {leftIcon && !loading && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && !loading && <span className="ml-2">{rightIcon}</span>}
    </button>
  )
})

Button.displayName = 'Button'

export default Button