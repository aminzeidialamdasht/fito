import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
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
import CalendarPage from './pages/Calendar';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import { SubscriptionProvider } from './subscription/SubscriptionContext';
import PremiumGate from './subscription/PremiumGate';

function AppContent({ showWelcome, onContinue }: { showWelcome: boolean; onContinue: () => void }) {
  if (showWelcome) {
    return <Welcome onContinue={onContinue} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        {/* صفحات دارای نوار پایین و لی‌آوت اصلی */}
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/calendar" element={<Layout><CalendarPage /></Layout>} />
        <Route path="/progress" element={<Layout><Progress /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        
        {/* صفحات پریمیوم */}
        <Route path="/prompt" element={<Layout><PremiumGate title="تولید پرامپت"><PromptGenerator /></PremiumGate></Layout>} />
        <Route path="/import" element={<Layout><PremiumGate title="ورود برنامه تمرینی"><ProgramImport /></PremiumGate></Layout>} />
        <Route path="/nutrition" element={<Layout><Nutrition /></Layout>} />
        <Route path="/nutrition-import" element={<Layout><PremiumGate title="ورود برنامه تغذیه"><NutritionImport /></PremiumGate></Layout>} />
        <Route path="/supplements" element={<Layout><Supplements /></Layout>} />
        <Route path="/supplement-import" element={<Layout><PremiumGate title="ورود برنامه مکمل"><SupplementImport /></PremiumGate></Layout>} />

        {/* صفحات فول‌اسکرین بدون نوار پایین */}
        <Route path="/session/:id" element={<SessionPreview />} />
        <Route path="/tracker/:id" element={<WorkoutTracker />} />
      </Routes>
      
      {/* نوار ناوبری فقط وقتی کاربر وارد اپ شده باشد */}
      <BottomNav />
    </div>
  );
}

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  const continueToApp = () => {
    setShowWelcome(false);
  };

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
