import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppNavigation } from '../navigation/useTypedNavigation';
import { useProgressStore } from '../store/progressStore';
import { QuizActionButton } from '../components/quiz/QuizActionButton';
import { colors, spacing, fontSize, radius, shadow } from '../utils/theme';

export default function PracticeScreen() {
  const navigation = useAppNavigation();
  const stats = useProgressStore(s => s.statsByCategory.verbal_reasoning);
  const numStats = useProgressStore(s => s.statsByCategory.numerical_reasoning);

  const accuracy =
    stats.totalAttempted > 0
      ? Math.round((stats.totalCorrect / stats.totalAttempted) * 100)
      : null;

  const numAccuracy =
    numStats.totalAttempted > 0
      ? Math.round((numStats.totalCorrect / numStats.totalAttempted) * 100)
      : null;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Práctica</Text>
        <Text style={styles.subtitle}>Elige un test para comenzar</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, shadow.md]}>
          <View style={styles.cardHeader}>
            <View style={styles.iconBox}>
              <Ionicons name="book-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Razonamiento Verbal</Text>
              <Text style={styles.cardDesc}>10 preguntas · Español · AST/ES</Text>
            </View>
            <View style={styles.availableBadge}>
              <Text style={styles.availableText}>Disponible</Text>
            </View>
          </View>

          {accuracy != null ? (
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{stats.sessionsCompleted}</Text>
                <Text style={styles.statLabel}>Sesiones</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{accuracy}%</Text>
                <Text style={styles.statLabel}>Precisión</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{stats.totalAttempted}</Text>
                <Text style={styles.statLabel}>Preguntas</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.noStats}>Aún no has practicado este test</Text>
          )}

          <QuizActionButton
            label="Iniciar práctica"
            onPress={() => navigation.navigate('Quiz', { category: 'verbal_reasoning', language: 'es' })}
          />
        </View>

        <View style={[styles.card, shadow.md]}>
          <View style={styles.cardHeader}>
            <View style={styles.iconBox}>
              <Ionicons name="calculator-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Razonamiento Numérico</Text>
              <Text style={styles.cardDesc}>3 preguntas · Español · AST/ES</Text>
            </View>
            <View style={styles.availableBadge}>
              <Text style={styles.availableText}>Disponible</Text>
            </View>
          </View>

          {numAccuracy != null ? (
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{numStats.sessionsCompleted}</Text>
                <Text style={styles.statLabel}>Sesiones</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{numAccuracy}%</Text>
                <Text style={styles.statLabel}>Precisión</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{numStats.totalAttempted}</Text>
                <Text style={styles.statLabel}>Preguntas</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.noStats}>Aún no has practicado este test</Text>
          )}

          <QuizActionButton
            label="Iniciar práctica"
            onPress={() => navigation.navigate('Quiz', { category: 'numerical_reasoning', language: 'es' })}
          />
        </View>

        {(['Razonamiento Abstracto', 'Juicio Situacional'] as const).map(name => (
          <View key={name} style={[styles.card, styles.lockedCard]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBox, styles.iconBoxLocked]}>
                <Ionicons name="lock-closed-outline" size={22} color={colors.textMuted} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, styles.lockedText]}>{name}</Text>
                <Text style={styles.cardDesc}>Próximamente</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  content: { padding: spacing.md, gap: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  lockedCard: { opacity: 0.45 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(3,105,161,0.12)',
    flexShrink: 0,
  },
  iconBoxLocked: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
  },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.textPrimary },
  lockedText: { color: colors.textMuted },
  cardDesc: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  availableBadge: {
    backgroundColor: colors.successLight,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(22,163,74,0.25)',
  },
  availableText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.successDark },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  statDivider: { width: 1, height: 32, backgroundColor: colors.border },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: fontSize.xl, fontWeight: '800', color: colors.primary },
  statLabel: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  noStats: { fontSize: fontSize.sm, color: colors.textMuted, textAlign: 'center', paddingVertical: spacing.sm },
});
