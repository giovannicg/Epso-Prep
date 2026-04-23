import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, radius } from '../../utils/theme';
import type { TableData } from '../../types';

interface Props {
  data: TableData;
}

export function DataTable({ data }: Props) {
  return (
    <View style={styles.wrapper}>
      {data.title ? (
        <Text style={styles.title}>{data.title}</Text>
      ) : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View style={styles.headerRow}>
            {data.headers.map((h, i) => (
              <Text key={i} style={[styles.cell, styles.headerCell, { minWidth: colWidth(h) }]}>
                {h}
              </Text>
            ))}
          </View>
          {data.rows.map((row, ri) => (
            <View key={ri} style={[styles.row, ri % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
              {row.map((cell, ci) => (
                <Text key={ci} style={[styles.cell, styles.dataCell, { minWidth: colWidth(data.headers[ci] ?? '') }]}>
                  {cell}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function colWidth(header: string): number {
  return Math.max(80, header.length * 9);
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  title: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.primarySurface,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.euBlue,
  },
  row: {
    flexDirection: 'row',
  },
  rowEven: { backgroundColor: colors.surface },
  rowOdd: { backgroundColor: colors.surfaceAlt },
  cell: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  headerCell: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: '#fff',
  },
  dataCell: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
});
