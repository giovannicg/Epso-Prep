import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { colors, spacing, fontSize, radius } from '../../utils/theme';

interface Props {
  text: string;
}

export function PassageText({ text }: Props) {
  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <Text style={styles.text}>{text}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    maxHeight: 180,
    marginBottom: spacing.md,
  },
  scroll: {
    padding: spacing.md,
  },
  text: {
    fontSize: fontSize.md,
    lineHeight: 23,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
