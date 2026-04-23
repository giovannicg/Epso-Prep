import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuizSession } from '../hooks/useQuizSession';
import { useQuizRoute, useAppNavigation } from '../navigation/useTypedNavigation';
import { useQuizStore } from '../store/quizStore';
import { getQuestionById } from '../data/questions';
import { ProgressBar } from '../components/quiz/ProgressBar';
import { PassageText } from '../components/quiz/PassageText';
import { DataTable } from '../components/quiz/DataTable';
import { QuestionText } from '../components/quiz/QuestionText';
import { OptionButton } from '../components/quiz/OptionButton';
import { FeedbackBanner } from '../components/quiz/FeedbackBanner';
import { QuizActionButton } from '../components/quiz/QuizActionButton';
import { colors, spacing, fontSize } from '../utils/theme';
import type { AnswerKey } from '../types';

export default function QuizScreen() {
  const route = useQuizRoute();
  const navigation = useAppNavigation();
  const { session, currentQuestionId, handleSubmit, handleNext } = useQuizSession();
  const store = useQuizStore();

  const [selectedKey, setSelectedKey] = useState<AnswerKey | null>(null);
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (!session) {
      const newSession = store.startSession(route.params.category, route.params.language);
      if (!newSession) navigation.goBack();
    }
  }, []);

  React.useEffect(() => {
    setSelectedKey(null);
    setSubmitted(false);
  }, [currentQuestionId]);

  if (!session || !currentQuestionId) return null;

  const question = getQuestionById(currentQuestionId);
  if (!question) return null;

  const attempt = session.attempts[currentQuestionId];

  function onConfirm() {
    if (!selectedKey) return;
    handleSubmit(selectedKey);
    setSubmitted(true);
  }

  function getVariant(key: AnswerKey) {
    if (!submitted) return selectedKey === key ? 'selected' : 'default';
    if (key === question!.correctKey) return 'correct';
    if (key === selectedKey) return 'incorrect';
    return 'default';
  }

  const isLastQuestion = session.currentIndex >= session.totalQuestions - 1;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="close" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.categoryLabel}>Razonamiento Verbal</Text>
          <Text style={styles.questionCount}>
            {session.currentIndex + 1} de {session.totalQuestions}
          </Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <ProgressBar current={session.currentIndex + 1} total={session.totalQuestions} />
        {question.tableData ? (
          <DataTable data={question.tableData} />
        ) : question.passage ? (
          <PassageText text={question.passage} />
        ) : null}
        <QuestionText text={question.question} />

        {question.options.map(opt => (
          <OptionButton
            key={opt.key}
            answerKey={opt.key}
            text={opt.text}
            variant={getVariant(opt.key)}
            onPress={() => { if (!submitted) setSelectedKey(opt.key); }}
            disabled={submitted}
          />
        ))}

        {submitted && attempt && (
          <FeedbackBanner
            status={attempt.status}
            correctKey={question.correctKey}
            explanation={question.explanation}
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        {!submitted ? (
          <QuizActionButton label="Confirmar respuesta" onPress={onConfirm} disabled={!selectedKey} />
        ) : (
          <QuizActionButton
            label={isLastQuestion ? 'Ver resultados' : 'Siguiente pregunta'}
            onPress={handleNext}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { alignItems: 'center' },
  categoryLabel: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  questionCount: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 1,
  },
  scroll: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  footer: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
