import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize } from '../../utils/theme';

interface Props {
  text: string;
}

export function QuestionText({ text }: Props) {
  return <Text style={styles.text}>{text}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 26,
    marginBottom: spacing.md,
  },
});
