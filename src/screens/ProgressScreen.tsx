import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgressStore } from '../store/progressStore';
import { CategoryStatsCard } from '../components/progress/CategoryStatsCard';
import { RecentSessionsList } from '../components/progress/RecentSessionsList';
import { colors, spacing, fontSize, radius, shadow } from '../utils/theme';
import type { ExamCategory } from '../types';

const CATEGORIES: { key: ExamCategory; title: string }[] = [
  { key: 'verbal_reasoning', title: 'Razonamiento Verbal' },
  { key: 'numerical_reasoning', title: 'Razonamiento Numérico' },
  { key: 'abstract_reasoning', title: 'Razonamiento Abstracto' },
  { key: 'situational_judgement', title: 'Juicio Situacional' },
];

export default function ProgressScreen() {
  const statsByCategory = useProgressStore(s => s.statsByCategory);
  const recentSessions = useProgressStore(s => s.recentSessions);
  const resetProgress = useProgressStore(s => s.resetProgress);

  const totalSessions = Object.values(statsByCategory).reduce((sum, s) => sum + s.sessionsCompleted, 0);
  const totalCorrect = Object.values(statsByCategory).reduce((sum, s) => sum + s.totalCorrect, 0);
  const totalAttempted = Object.values(statsByCategory).reduce((sum, s) => sum + s.totalAttempted, 0);
  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : null;

  function handleReset() {
    Alert.alert(
      'Restablecer progreso',
      '¿Estás seguro de que quieres borrar todo tu progreso?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Restablecer', style: 'destructive', onPress: resetProgress },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Progreso</Text>
          <Text style={styles.subtitle}>Tu historial de práctica</Text>
        </View>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetBtn}>Restablecer</Text>
        </TouchableOpacity>
      </View>

      {totalSessions > 0 && (
        <View style={[styles.summaryBar, shadow.sm]}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalSessions}</Text>
            <Text style={styles.summaryLabel}>Sesiones</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{overallAccuracy}%</Text>
            <Text style={styles.summaryLabel}>Precisión</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalAttempted}</Text>
            <Text style={styles.summaryLabel}>Preguntas</Text>
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>Por categoría</Text>
        {CATEGORIES.map(({ key, title }) => (
          <CategoryStatsCard
            key={key}
            category={key}
            title={title}
            stats={statsByCategory[key]}
          />
        ))}
        <Text style={[styles.sectionLabel, { marginTop: spacing.lg }]}>Sesiones recientes</Text>
        <RecentSessionsList sessions={recentSessions} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  resetButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.errorLight,
  },
  resetBtn: { fontSize: fontSize.sm, color: colors.error, fontWeight: '600' },
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryDark,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { fontSize: fontSize.xl, fontWeight: '800', color: '#fff' },
  summaryLabel: { fontSize: fontSize.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  summaryDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  content: { padding: spacing.md },
  sectionLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing.sm,
  },
});
