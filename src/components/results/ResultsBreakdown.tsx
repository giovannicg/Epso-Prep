import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, radius } from '../../utils/theme';
import type { QuestionAttempt } from '../../types';

interface Props {
  attempts: QuestionAttempt[];
}

export function ResultsBreakdown({ attempts }: Props) {
  const correct = attempts.filter(a => a.status === 'correct').length;
  const incorrect = attempts.length - correct;

  return (
    <View>
      <View style={styles.summaryRow}>
        <View style={[styles.summaryPill, styles.correctPill]}>
          <Ionicons name="checkmark-circle" size={16} color={colors.successDark} />
          <Text style={[styles.pillText, { color: colors.successDark }]}>{correct} correctas</Text>
        </View>
        <View style={[styles.summaryPill, styles.incorrectPill]}>
          <Ionicons name="close-circle" size={16} color={colors.errorDark} />
          <Text style={[styles.pillText, { color: colors.errorDark }]}>{incorrect} incorrectas</Text>
        </View>
      </View>

      <Text style={styles.heading}>Desglose de respuestas</Text>
      {attempts.map((item, index) => {
        const isCorrect = item.status === 'correct';
        return (
          <View key={item.questionId} style={[styles.row, isCorrect ? styles.rowCorrect : styles.rowIncorrect]}>
            <View style={[styles.numBadge, isCorrect ? styles.numCorrect : styles.numIncorrect]}>
              <Text style={[styles.numText, isCorrect ? styles.numTextCorrect : styles.numTextIncorrect]}>
                {index + 1}
              </Text>
            </View>
            <Ionicons
              name={isCorrect ? 'checkmark-circle' : 'close-circle'}
              size={18}
              color={isCorrect ? colors.success : colors.error}
            />
            <Text style={[styles.status, isCorrect ? styles.correct : styles.incorrect]}>
              {isCorrect
                ? 'Correcta'
                : `Incorrecta — correcta: ${item.selectedKey ?? '—'}`}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  summaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  correctPill: { backgroundColor: colors.successLight, borderColor: 'rgba(22,163,74,0.25)' },
  incorrectPill: { backgroundColor: colors.errorLight, borderColor: 'rgba(220,38,38,0.25)' },
  pillText: { fontSize: fontSize.sm, fontWeight: '700' },
  heading: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: 4,
    borderWidth: 1,
  },
  rowCorrect: { backgroundColor: '#F0FDF4', borderColor: 'rgba(22,163,74,0.15)' },
  rowIncorrect: { backgroundColor: '#FFF5F5', borderColor: 'rgba(220,38,38,0.15)' },
  numBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  numCorrect: { backgroundColor: colors.successLight },
  numIncorrect: { backgroundColor: colors.errorLight },
  numText: { fontSize: fontSize.xs, fontWeight: '800' },
  numTextCorrect: { color: colors.successDark },
  numTextIncorrect: { color: colors.errorDark },
  status: { fontSize: fontSize.sm, flex: 1 },
  correct: { color: colors.successDark },
  incorrect: { color: colors.errorDark },
});
