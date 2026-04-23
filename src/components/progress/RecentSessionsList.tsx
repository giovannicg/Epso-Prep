import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, radius } from '../../utils/theme';
import type { SessionSummary } from '../../types';

const categoryLabels: Record<string, string> = {
  verbal_reasoning: 'Verbal',
  numerical_reasoning: 'Numérico',
  abstract_reasoning: 'Abstracto',
  situational_judgement: 'Situacional',
};

interface Props {
  sessions: SessionSummary[];
}

export function RecentSessionsList({ sessions }: Props) {
  if (sessions.length === 0) {
    return <Text style={styles.empty}>No hay sesiones recientes.</Text>;
  }

  return (
    <FlatList
      data={sessions}
      keyExtractor={item => item.id}
      scrollEnabled={false}
      renderItem={({ item }) => {
        const date = new Date(item.completedAt).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
        });
        const isGood = item.score >= 60;
        return (
          <View style={styles.row}>
            <View style={[styles.scoreBadge, isGood ? styles.good : styles.poor]}>
              <Text style={styles.scoreText}>{item.score}%</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.category}>{categoryLabels[item.category] ?? item.category}</Text>
              <Text style={styles.detail}>{item.correctAnswers}/{item.totalQuestions} correctas</Text>
            </View>
            <Text style={styles.date}>{date}</Text>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  empty: { fontSize: fontSize.sm, color: colors.textMuted, fontStyle: 'italic' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scoreBadge: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  good: { backgroundColor: colors.successLight },
  poor: { backgroundColor: colors.optionSelected },
  scoreText: { fontSize: fontSize.md, fontWeight: '800', color: colors.textPrimary },
  info: { flex: 1 },
  category: { fontSize: fontSize.md, fontWeight: '600', color: colors.textPrimary },
  detail: { fontSize: fontSize.sm, color: colors.textSecondary },
  date: { fontSize: fontSize.sm, color: colors.textMuted },
});
