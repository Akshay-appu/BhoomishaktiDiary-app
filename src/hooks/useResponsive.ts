import { DimensionValue, useWindowDimensions } from 'react-native';
import { CARD_GAP, CONTENT_MAX_WIDTH } from '../theme';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export function useResponsive() {
  const { width } = useWindowDimensions();
  const breakpoint: Breakpoint = width >= 1024 ? 'desktop' : width >= 768 ? 'tablet' : 'mobile';
  const isMobile = breakpoint === 'mobile';
  const lg = !isMobile;
  const horizontalPadding = isMobile ? 18 : breakpoint === 'tablet' ? 28 : 40;
  const gridColumns = breakpoint === 'desktop' ? 3 : breakpoint === 'tablet' ? 2 : 1;
  const innerWidth = Math.min(width, CONTENT_MAX_WIDTH) - horizontalPadding * 2;
  const cardWidth: DimensionValue =
    gridColumns === 1 ? '100%' : (innerWidth - CARD_GAP * (gridColumns - 1)) / gridColumns;

  return { width, breakpoint, isMobile, lg, horizontalPadding, gridColumns, cardWidth };
}
