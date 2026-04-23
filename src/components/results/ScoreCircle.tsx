import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, fontSize, spacing, shadow } from '../../utils/theme';

interface Props {
  correct: number;
  total: number;
  percentage: number;
}

export function ScoreCircle({ correct, total, percentage }: Props) {
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        damping: 12,
        stiffness: 120,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isGood = percentage >= 60;

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.outerRing, { transform: [{ scale }], opacity }]}>
        <View style={[styles.circle, isGood ? styles.good : styles.average, shadow.lg]}>
          <Text style={[styles.pct, isGood ? styles.goodText : styles.averageText]}>
            {percentage}%
          </Text>
          <Text style={styles.fraction}>{correct} / {total}</Text>
        </View>
      </Animated.View>
      <Text style={styles.label}>
        {percentage === 100
          ? '¡Perfecto! 🎉'
          : isGood
          ? '¡Buen trabajo!'
          : percentage >= 40
          ? 'Sigue practicando'
          : 'Hay que repasar'}
      </Text>
      <Text style={styles.sublabel}>
        {correct} respuestas correctas de {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', marginVertical: spacing.xl },
  outerRing: {
    padding: 6,
    borderRadius: 999,
  },
  circle: {
    width: 148,
    height: 148,
    borderRadius: 74,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  good: {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
  },
  average: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySurface,
  },
  pct: { fontSize: fontSize.xxxl, fontWeight: '800', lineHeight: 38 },
  goodText: { color: colors.successDark },
  averageText: { color: colors.primary },
  fraction: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  label: {
    marginTop: spacing.md,
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sublabel: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
