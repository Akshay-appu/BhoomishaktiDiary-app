import React, { ReactNode } from 'react';
import { DimensionValue, View } from 'react-native';
import { shared } from '../styles/shared';
import { CARD_GAP } from '../theme';

// Lays items out as a single column on mobile and a wrapping N-column
// dashboard grid on tablet/desktop, using the pixel-exact cardWidth from
// useResponsive() rather than percentages (keeps gaps consistent at any
// window width without overflow rounding issues).
export function GridList<T extends { id: number }>({
  items, gridColumns, cardWidth, renderItem,
}: {
  items: T[];
  gridColumns: number;
  cardWidth: DimensionValue;
  renderItem: (item: T) => ReactNode;
}) {
  return (
    <View style={[shared.grid, { flexDirection: gridColumns > 1 ? 'row' : 'column', gap: CARD_GAP }]}>
      {items.map(item => (
        <View key={item.id} style={gridColumns > 1 ? { width: cardWidth } : shared.fullWidth}>
          {renderItem(item)}
        </View>
      ))}
    </View>
  );
}
