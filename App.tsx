import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useProgressStore } from './src/store/progressStore'
import HomeScreen from './src/screens/HomeScreen'
import PracticeScreen from './src/screens/PracticeScreen'
import ProgressScreen from './src/screens/ProgressScreen'
import QuizScreen from './src/screens/QuizScreen'
import QuizResultsScreen from './src/screens/QuizResultsScreen'
import Layout from './src/components/common/Layout'
import LoadingScreen from './src/components/common/LoadingScreen'

export default function App() {
  const loadProgress = useProgressStore(s => s.loadProgress)
  const isLoaded = useProgressStore(s => s.isLoaded)

  useEffect(() => { loadProgress() }, [loadProgress])

  if (!isLoaded) return <LoadingScreen />

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomeScreen />} />
          <Route path="practice" element={<PracticeScreen />} />
          <Route path="progress" element={<ProgressScreen />} />
        </Route>
        <Route path="/quiz/:category/:language" element={<QuizScreen />} />
        <Route path="/results" element={<QuizResultsScreen />} />
      </Routes>
    </BrowserRouter>
  )
}
