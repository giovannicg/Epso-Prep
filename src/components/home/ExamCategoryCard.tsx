import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, radius, shadow } from '../../utils/theme';
import type { ExamCategory } from '../../types';

interface Props {
  category: ExamCategory;
  title: string;
  description: string;
  lastScore?: number | null;
  locked?: boolean;
  onPress: () => void;
}

const categoryIcons: Record<ExamCategory, keyof typeof Ionicons.glyphMap> = {
  verbal_reasoning: 'book-outline',
  numerical_reasoning: 'calculator-outline',
  abstract_reasoning: 'shapes-outline',
  situational_judgement: 'people-outline',
};

export function ExamCategoryCard({ category, title, description, lastScore, locked, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, !locked && shadow.sm, locked && styles.locked]}
      onPress={onPress}
      disabled={locked}
      activeOpacity={0.75}
    >
      <View style={[styles.iconBox, locked && styles.iconBoxLocked]}>
        <Ionicons
          name={locked ? 'lock-closed-outline' : categoryIcons[category]}
          size={24}
          color={locked ? colors.textMuted : colors.primary}
        />
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, locked && styles.lockedText]}>{title}</Text>
        <Text style={styles.desc}>{description}</Text>
      </View>
      {!locked && lastScore != null ? (
        <View style={styles.scorePill}>
          <Text style={styles.scoreText}>{lastScore}%</Text>
        </View>
      ) : !locked ? (
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locked: { opacity: 0.45 },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(3,105,161,0.12)',
  },
  iconBoxLocked: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
  },
  info: { flex: 1 },
  title: { fontSize: fontSize.lg, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  lockedText: { color: colors.textMuted },
  desc: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 18 },
  scorePill: {
    backgroundColor: colors.primarySurface,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(3,105,161,0.2)',
  },
  scoreText: { fontSize: fontSize.sm, fontWeight: '700', color: colors.primary },
});
