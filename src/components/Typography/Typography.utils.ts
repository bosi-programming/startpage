import type { TypographyProps } from "./Typography";

export function colorClass(color: TypographyProps['color']) {
  if (color === 'primary') {
    return 'text-primary-on-light dark:text-primary-on-dark';
  }
  if (color === 'secondary') {
    return 'text-secondary-on-light dark:text-secondary-on-dark';
  }
  if (color === 'error') {
    return 'text-error dark:text-error-on-dark';
  }
  return 'light:text-black dark:text-gray-93';
}

export function sizeClass(size: TypographyProps['size']) {
  switch (size) {
    case 'h1':
      return 'text-h1 font-bold';
    case 'h2':
      return 'text-h2 font-bold';
    case 'h3':
      return 'text-h3 font-bold';
    case 'h4':
      return 'text-h4 font-bold';
    case 'details':
      return 'text-details';
    default:
      return 'text-body mb-4';
  }
}

export function getComponent(
  size: TypographyProps['size'],
  as: TypographyProps['as'],
) {
  if (as) return as;
  if (size === 'body' || size === 'details') return 'p';
  return size || 'p';
}
