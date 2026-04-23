import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';
import { colors, spacing, fontSize, radius, shadow } from '../../utils/theme';
import type { AnswerKey } from '../../types';

type Variant = 'default' | 'selected' | 'correct' | 'incorrect';

interface Props {
  answerKey: AnswerKey;
  text: string;
  variant: Variant;
  onPress: () => void;
  disabled?: boolean;
}

const variantConfig: Record<Variant, { bg: string; border: string; textColor: string; badgeBg: string; badgeText: string }> = {
  default: {
    bg: colors.optionDefault,
    border: colors.border,
    textColor: colors.textPrimary,
    badgeBg: colors.surfaceAlt,
    badgeText: colors.textSecondary,
  },
  selected: {
    bg: colors.optionSelected,
    border: colors.primary,
    textColor: colors.primary,
    badgeBg: colors.primary,
    badgeText: '#fff',
  },
  correct: {
    bg: colors.optionCorrect,
    border: colors.success,
    textColor: colors.successDark,
    badgeBg: colors.success,
    badgeText: '#fff',
  },
  incorrect: {
    bg: colors.optionIncorrect,
    border: colors.error,
    textColor: colors.errorDark,
    badgeBg: colors.error,
    badgeText: '#fff',
  },
};

export function OptionButton({ answerKey, text, variant, onPress, disabled }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const vc = variantConfig[variant];

  function handlePressIn() {
    if (disabled) return;
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  }

  function handlePressOut() {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();
  }

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[
          styles.container,
          { backgroundColor: vc.bg, borderColor: vc.border },
          variant !== 'default' && shadow.sm,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
      >
        <View style={[styles.badge, { backgroundColor: vc.badgeBg }]}>
          <Text style={[styles.badgeText, { color: vc.badgeText }]}>{answerKey}</Text>
        </View>
        <Text style={[styles.text, { color: vc.textColor }]}>{text}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginVertical: spacing.xs,
    gap: spacing.sm,
    minHeight: 52,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  badgeText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  text: {
    flex: 1,
    fontSize: fontSize.md,
    lineHeight: 23,
  },
});
