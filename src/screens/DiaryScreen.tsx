import React from 'react';
import { ActivityIndicator, DimensionValue, Text } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { GridList } from '../components/GridList';
import { ListCard } from '../components/ListCard';
import { PrimaryButton } from '../components/Buttons';
import { Entry } from '../db/schema';
import { Copy } from '../i18n/copy';
import { shared } from '../styles/shared';
import { GREEN } from '../theme';
import { formatShortDate } from '../utils/format';

export function DiaryScreen({
  t, lg, gridColumns, cardWidth, entries, loading, onAddPress, onEditEntry, onDeleteEntry,
}: {
  t: Copy;
  lg: boolean;
  gridColumns: number;
  cardWidth: DimensionValue;
  entries: Entry[];
  loading: boolean;
  onAddPress: () => void;
  onEditEntry?: (entry: Entry) => void;
  onDeleteEntry: (id: number) => void;
}) {
  return (
    <>
      <Text style={[shared.pageTitle, lg && shared.pageTitleLg]}>{t.diary}</Text>
      <Text style={[shared.pageSubtitle, lg && shared.pageSubtitleLg]}>{t.diarySubtitle}</Text>
      <PrimaryButton label={`＋ ${t.addActivity}`} onPress={onAddPress} lg={lg} />
      {loading ? (
        <ActivityIndicator color={GREEN} style={{ marginTop: 20 }} />
      ) : entries.length ? (
        <GridList
          items={entries}
          gridColumns={gridColumns}
          cardWidth={cardWidth}
          renderItem={entry => (
            <ListCard
              title={entry.title}
              meta={`${entry.category} · ${formatShortDate(entry.createdAt, 'en-IN')}`}
              note={entry.note}
              onPress={onEditEntry ? () => onEditEntry(entry) : undefined}
              onDelete={() => onDeleteEntry(entry.id)}
              lg={lg}
            />
          )}
        />
      ) : (
        <EmptyState title={t.noActivities} detail={t.startDiary} lg={lg} />
      )}
    </>
  );
}
