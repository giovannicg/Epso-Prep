import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppNavigation } from '../navigation/useTypedNavigation';
import { useProgressStore } from '../store/progressStore';
import { ExamCategoryCard } from '../components/home/ExamCategoryCard';
import { colors, spacing, fontSize, radius } from '../utils/theme';

const CATEGORIES = [
  {
    category: 'verbal_reasoning' as const,
    title: 'Razonamiento Verbal',
    description: 'Comprensión de textos y deducciones lógicas',
    locked: false,
  },
  {
    category: 'numerical_reasoning' as const,
    title: 'Razonamiento Numérico',
    description: 'Tablas, gráficos y cálculos estadísticos',
    locked: true,
  },
  {
    category: 'abstract_reasoning' as const,
    title: 'Razonamiento Abstracto',
    description: 'Patrones y series de figuras geométricas',
    locked: true,
  },
  {
    category: 'situational_judgement' as const,
    title: 'Juicio Situacional',
    description: 'Situaciones profesionales en la UE',
    locked: true,
  },
];

export default function HomeScreen() {
  const navigation = useAppNavigation();
  const statsByCategory = useProgressStore(s => s.statsByCategory);

  function getLastScore(category: typeof CATEGORIES[0]['category']) {
    const stats = statsByCategory[category];
    if (!stats.sessionsCompleted) return null;
    return Math.round((stats.totalCorrect / stats.totalAttempted) * 100);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.starsBadge}>
            <Text style={styles.starsText}>★★★★★★</Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>AST · ES</Text>
          </View>
        </View>
        <Text style={styles.title}>EPSO Prep</Text>
        <Text style={styles.subtitle}>Preparación oficial para las pruebas de la Unión Europea</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>Tipos de prueba</Text>
        {CATEGORIES.map(item => (
          <ExamCategoryCard
            key={item.category}
            category={item.category}
            title={item.title}
            description={item.description}
            locked={item.locked}
            lastScore={getLastScore(item.category)}
            onPress={() => navigation.navigate('Quiz', { category: item.category, language: 'es' })}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.euBlue,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  starsBadge: {
    backgroundColor: 'rgba(255,204,0,0.15)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,204,0,0.4)',
  },
  starsText: { fontSize: fontSize.xs, color: colors.euGold, letterSpacing: 2 },
  levelBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  levelText: { fontSize: fontSize.xs, fontWeight: '700', color: 'rgba(255,255,255,0.9)', letterSpacing: 1 },
  title: { fontSize: fontSize.xxxl, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  subtitle: { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 4, lineHeight: 18 },
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
