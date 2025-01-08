export const baseButtonClasses = "hover:scale-110 rounded-lg cursor-pointer border-none outline-transparent text-body hover:brightness-75 disabled:cursor-not-allowed disabled:bg-gray-15"

export const actionClasses = {
  error: 'bg-error text-white',
  info: 'bg-info text-white',
  warning: 'bg-warning text-white',
  success: 'bg-success text-white',
}

export const colorsClasses = {
  default: actionClasses['info'],
  primary: 'bg-primary-on-light text-white dark:bg-primary-on-dark dark:text-black',
  secondary: 'bg-secondary-on-light text-white dark:bg-secondary-on-dark dark:text-black',
}

export const sizeClasses = {
  small: 'px-4 py-2',
  medium: 'px-8 py-2',
  'full-width': 'w-full px-8 py-2',
}


