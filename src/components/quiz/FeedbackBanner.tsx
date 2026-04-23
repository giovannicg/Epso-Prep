import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, radius } from '../../utils/theme';
import type { AnswerStatus } from '../../types';

interface Props {
  status: AnswerStatus;
  correctKey: string;
  explanation?: string;
}

export function FeedbackBanner({ status, correctKey, explanation }: Props) {
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isCorrect = status === 'correct';

  return (
    <Animated.View
      style={[
        styles.container,
        isCorrect ? styles.correct : styles.incorrect,
        { transform: [{ translateY }], opacity },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconCircle, isCorrect ? styles.iconCircleCorrect : styles.iconCircleIncorrect]}>
          <Ionicons
            name={isCorrect ? 'checkmark' : 'close'}
            size={18}
            color="#fff"
          />
        </View>
        <Text style={[styles.title, isCorrect ? styles.correctText : styles.incorrectText]}>
          {isCorrect ? '¡Respuesta correcta!' : `Respuesta incorrecta — la correcta es ${correctKey}`}
        </Text>
      </View>
      {explanation ? (
        <Text style={styles.explanation}>{explanation}</Text>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
  },
  correct: {
    backgroundColor: colors.successLight,
    borderColor: colors.success,
  },
  incorrect: {
    backgroundColor: colors.errorLight,
    borderColor: colors.error,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconCircleCorrect: { backgroundColor: colors.success },
  iconCircleIncorrect: { backgroundColor: colors.error },
  title: {
    fontSize: fontSize.md,
    fontWeight: '700',
    flex: 1,
    lineHeight: 21,
  },
  correctText: { color: colors.successDark },
  incorrectText: { color: colors.errorDark },
  explanation: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: spacing.sm,
    paddingLeft: 36,
  },
});
