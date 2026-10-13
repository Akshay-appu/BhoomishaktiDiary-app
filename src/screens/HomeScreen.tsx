import React from 'react';
import { ActivityIndicator, DimensionValue, Text, TouchableOpacity, View } from 'react-native';
import { GridList } from '../components/GridList';
import { ListCard } from '../components/ListCard';
import { EmptyState } from '../components/EmptyState';
import { SectionTitle } from '../components/SectionTitle';
import { Stat } from '../components/Stat';
import { Copy } from '../i18n/copy';
import { Entry } from '../db/schema';
import { shared } from '../styles/shared';
import { GREEN } from '../theme';
import { formatShortDate } from '../utils/format';

export function HomeScreen({
  t, lg, gridColumns, cardWidth, dateLabel, entries, loading, plotsCount, currentSeasonLabel, onAddPress, onDeleteEntry, onViewAll,
}: {
  t: Copy;
  lg: boolean;
  gridColumns: number;
  cardWidth: DimensionValue;
  dateLabel: string;
  entries: Entry[];
  loading: boolean;
  plotsCount: number;
  currentSeasonLabel: string;
  onAddPress: () => void;
  onDeleteEntry: (id: number) => void;
  onViewAll: () => void;
}) {
  return (
    <>
      <View style={[shared.welcome, lg && shared.welcomeLg]}>
        <Text style={[shared.date, lg && shared.dateLg]}>{dateLabel}</Text>
        <Text style={[shared.greeting, lg && shared.greetingLg]}>{t.greeting}</Text>
        <Text style={[shared.intro, lg && shared.introLg]}>{t.intro}</Text>
        <TouchableOpacity style={[shared.primaryButton, lg && shared.primaryButtonLg]} onPress={onAddPress}>
          <Text style={[shared.primaryButtonText, lg && shared.primaryButtonTextLg]}>＋ {t.addActivity}</Text>
        </TouchableOpacity>
      </View>
      <View style={shared.statsRow}>
        <Stat value={String(entries.length)} label={t.activities} lg={lg} />
        <Stat value={String(plotsCount)} label={t.plots} lg={lg} />
        <Stat value={currentSeasonLabel || '—'} label={t.season} lg={lg} />
      </View>
      <SectionTitle title={t.recentActivities} action={t.viewAll} onPress={onViewAll} lg={lg} />
      {loading ? (
        <ActivityIndicator color={GREEN} style={{ marginTop: 20 }} />
      ) : entries.length ? (
        <GridList
          items={entries.slice(0, 3)}
          gridColumns={gridColumns}
          cardWidth={cardWidth}
          renderItem={entry => (
            <ListCard
              title={entry.title}
              meta={`${entry.category} · ${formatShortDate(entry.createdAt, 'en-IN')}`}
              note={entry.note}
              onDelete={() => onDeleteEntry(entry.id)}
              lg={lg}
            />
          )}
        />
      ) : (
        <EmptyState title={t.noActivities} detail={t.startDiary} lg={lg} />
      )}
      <View style={[shared.tipCard, lg && shared.tipCardLg]}>
        <Text style={[shared.tipTitle, lg && shared.tipTitleLg]}>🌱 {t.farmerTools}</Text>
        <Text style={[shared.tipText, lg && shared.tipTextLg]}>{t.toolsComingSoon}</Text>
      </View>
    </>
  );
}
