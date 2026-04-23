import React, { useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuizStore } from '../store/quizStore';
import { useProgressStore } from '../store/progressStore';
import { useAppNavigation } from '../navigation/useTypedNavigation';
import { ScoreCircle } from '../components/results/ScoreCircle';
import { ResultsBreakdown } from '../components/results/ResultsBreakdown';
import { QuizActionButton } from '../components/quiz/QuizActionButton';
import { computeScore } from '../utils/quizUtils';
import { colors, spacing, fontSize } from '../utils/theme';

export default function QuizResultsScreen() {
  const navigation = useAppNavigation();
  const session = useQuizStore(s => s.activeSession);
  const clearSession = useQuizStore(s => s.clearSession);
  const recordSession = useProgressStore(s => s.recordSession);
  const recorded = useRef(false);

  useEffect(() => {
    if (session?.completedAt && !recorded.current) {
      recorded.current = true;
      const { correct, total, percentage } = computeScore(session);
      recordSession({
        id: session.id,
        category: session.category,
        score: percentage,
        totalQuestions: total,
        correctAnswers: correct,
        completedAt: session.completedAt,
      });
    }
  }, []);

  if (!session) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.empty}>No hay resultados disponibles.</Text>
          <QuizActionButton label="Volver" onPress={() => navigation.navigate('MainTabs')} />
        </View>
      </SafeAreaView>
    );
  }

  const { correct, total, percentage } = computeScore(session);
  const attempts = Object.values(session.attempts);

  function handleRetry() {
    clearSession();
    navigation.replace('Quiz', { category: session!.category, language: session!.language });
  }

  function handleHome() {
    clearSession();
    navigation.navigate('MainTabs');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>Razonamiento Verbal</Text>
        </View>
        <Text style={styles.title}>Resultados</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <ScoreCircle correct={correct} total={total} percentage={percentage} />
        <ResultsBreakdown attempts={attempts} />
      </ScrollView>
      <View style={styles.footer}>
        <QuizActionButton label="Volver a practicar" onPress={handleRetry} />
        <QuizActionButton label="Ir al inicio" onPress={handleHome} variant="secondary" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  headerBadge: {
    backgroundColor: colors.primarySurface,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(3,105,161,0.15)',
  },
  headerBadgeText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.8 },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.textPrimary },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  footer: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  center: { flex: 1, justifyContent: 'center', padding: spacing.md },
  empty: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});
