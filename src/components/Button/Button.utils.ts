import type { ButtonProps } from './Button.d';
import { actionClasses, colorsClasses } from './Button.styles';

export function getColor(
  action?: ButtonProps['action'],
  color?: ButtonProps['color'],
) {
  if (action) return actionClasses[action];
  return color ? colorsClasses[color] : colorsClasses['default'];
}
