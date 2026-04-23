import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, radius } from '../../utils/theme';
import type { CategoryStats, ExamCategory } from '../../types';

interface Props {
  category: ExamCategory;
  title: string;
  stats: CategoryStats;
}

const categoryIcons: Record<ExamCategory, keyof typeof Ionicons.glyphMap> = {
  verbal_reasoning: 'book-outline',
  numerical_reasoning: 'calculator-outline',
  abstract_reasoning: 'shapes-outline',
  situational_judgement: 'people-outline',
};

export function CategoryStatsCard({ category, title, stats }: Props) {
  const accuracy =
    stats.totalAttempted > 0
      ? Math.round((stats.totalCorrect / stats.totalAttempted) * 100)
      : null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name={categoryIcons[category]} size={20} color={colors.primary} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {stats.sessionsCompleted === 0 ? (
        <Text style={styles.empty}>Sin sesiones completadas</Text>
      ) : (
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.value}>{stats.sessionsCompleted}</Text>
            <Text style={styles.label}>Sesiones</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.value}>{accuracy ?? 0}%</Text>
            <Text style={styles.label}>Precisión</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.value}>{stats.totalCorrect}/{stats.totalAttempted}</Text>
            <Text style={styles.label}>Correctas</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  title: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  empty: { fontSize: fontSize.sm, color: colors.textMuted, fontStyle: 'italic' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  value: { fontSize: fontSize.lg, fontWeight: '800', color: colors.primary },
  label: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 2 },
});
