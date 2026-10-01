import { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import BottomNav from './components/BottomNav';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import PromptGenerator from './pages/PromptGenerator';
import ProgramImport from './pages/ProgramImport';
import Nutrition from './pages/Nutrition';
import NutritionImport from './pages/NutritionImport';
import Supplements from './pages/Supplements';
import SupplementImport from './pages/SupplementImport';
import WorkoutTracker from './pages/WorkoutTracker';
import SessionPreview from './pages/SessionPreview';
import Workouts from './pages/Workouts';
import TodaySession from './pages/TodaySession';
import CalendarPage from './pages/Calendar';
import Progress from './pages/Progress';
import { SubscriptionProvider } from './subscription/SubscriptionContext';
import PremiumGate from './subscription/PremiumGate';

function AppContent({ showWelcome, onContinue }: { showWelcome: boolean; onContinue: () => void }) {
  if (showWelcome) {
    return <Welcome onContinue={onContinue} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        {/* ریدایرکت مسیر غلط به مسیر صحیح */}
        <Route path="/workout" element={<Navigate to="/workouts" replace />} />
        
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/calendar" element={<Layout><CalendarPage /></Layout>} />
        <Route path="/progress" element={<Layout><Progress /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/workouts" element={<Layout><Workouts /></Layout>} />
        <Route path="/today-session" element={<TodaySession />} />
        
        <Route path="/prompt" element={<Layout><PremiumGate title="تولید پرامپت"><PromptGenerator /></PremiumGate></Layout>} />
        {/* ورود برنامه: صفحه باز است تا برنامه پیش‌فرض رایگان در دسترس باشد؛ JSON اختصاصی داخل صفحه قفل می‌شود */}
        <Route path="/import" element={<Layout><ProgramImport /></Layout>} />
        <Route path="/nutrition" element={<Layout><Nutrition /></Layout>} />
        <Route path="/nutrition-import" element={<Layout><PremiumGate title="ورود برنامه تغذیه"><NutritionImport /></PremiumGate></Layout>} />
        <Route path="/supplements" element={<Layout><Supplements /></Layout>} />
        <Route path="/supplement-import" element={<Layout><PremiumGate title="ورود برنامه مکمل"><SupplementImport /></PremiumGate></Layout>} />

        <Route path="/session/:id" element={<SessionPreview />} />
        <Route path="/tracker/:id" element={<WorkoutTracker />} />
        
        {/* ریدایرکت مسیرهای ناشناخته به داشبورد */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <BottomNav />
    </div>
  );
}

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const continueToApp = () => setShowWelcome(false);

  return (
    <ThemeProvider>
      <SubscriptionProvider>
        <AppProvider>
          <HashRouter>
            <AppContent showWelcome={showWelcome} onContinue={continueToApp} />
          </HashRouter>
        </AppProvider>
      </SubscriptionProvider>
    </ThemeProvider>
  );
}

export default App;
