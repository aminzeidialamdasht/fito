import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Layout from './components/Layout';
import BottomNav from './components/BottomNav';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProfileDetail from './pages/ProfileDetail';
import StrengthRecords from './pages/StrengthRecords';
import Nutrition from './pages/Nutrition';
import Supplements from './pages/Supplements';
import WorkoutTracker from './pages/WorkoutTracker';
import SessionPreview from './pages/SessionPreview';
import History from './pages/History';
import Programs from './pages/Programs';
import TodaySession from './pages/TodaySession';
import CalendarPage from './pages/Calendar';
import Progress from './pages/Progress';
import OfflineGenerator from './pages/OfflineGenerator';
import GeneratorEntry from './pages/generators/GeneratorEntry';
import Onboarding from './pages/Onboarding';
import ProgramDetail from './pages/program/ProgramDetail';
import Subscription from './pages/Subscription';
import Settings from './pages/Settings';
import PremiumGate from './components/PremiumGate';
import { initializeBilling } from './billing';

function AppContent({ showWelcome, onContinue }: { showWelcome: boolean; onContinue: () => void }) {
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    initializeBilling().catch(e => console.warn('Billing init failed:', e));
  }, []);

  if (showWelcome) {
    return <Welcome onContinue={onContinue} />;
  }

  // مسیرهایی که نباید BottomNav داشته باشند
  const hideBottomNav =
    location.pathname.startsWith('/onboarding') ||
    (location.pathname.startsWith('/generate/') && !location.pathname.endsWith('/ready'));

  // مسیرهایی که Layout نباید داشته باشند (تمام صفحه)
  const isFullScreen = location.pathname.startsWith('/onboarding');

  return (
    <div className="relative flex flex-col min-h-screen">
        {/* پس‌زمینه سراسری اپلیکیشن */}
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: isDark
              ? "url('/bg-dark.png')"
              : "url('/bg-light.png')",
            filter: isDark
              ? 'blur(0.5px) brightness(0.7)'
              : 'blur(0.5px) brightness(1.05)',
          }}
        />
        {/* Overlay نیمه‌شفاف برای خوانایی */}
        <div
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            background: isDark
              ? 'rgba(8, 8, 12, 0.55)'
              : 'rgba(248, 250, 252, 0.5)',
          }}
        />
        <Routes>
        {/* ریدایرکت مسیر غلط به مسیر صحیح */}
        
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/calendar" element={<Layout><CalendarPage /></Layout>} />
        <Route path="/progress" element={<Layout><Progress /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/profile/:id" element={<Layout><ProfileDetail /></Layout>} />
        <Route path="/strength-records" element={<Layout><StrengthRecords /></Layout>} />
        <Route path="/programs" element={<Layout><Programs /></Layout>} />
        <Route path="/program/:id" element={<Layout><ProgramDetail /></Layout>} />
        <Route path="/history" element={<Layout><History /></Layout>} />
        <Route path="/workouts" element={<Navigate to="/programs" replace />} />
        <Route path="/today-session" element={<TodaySession />} />
        
        {/* ورود برنامه: صفحه باز است تا برنامه پیش‌فرض رایگان در دسترس باشد؛ JSON اختصاصی داخل صفحه قفل می‌شود */}
        <Route path="/generate" element={<Navigate to="/generate/workout" replace />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/subscription" element={<Layout><Subscription /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/generate/:type" element={<GeneratorEntry />} />
        <Route path="/generate/:type/ready" element={<Layout><OfflineGenerator /></Layout>} />
        <Route path="/nutrition" element={<Layout><PremiumGate feature="nutrition"><Nutrition /></PremiumGate></Layout>} />
        <Route path="/supplements" element={<Layout><PremiumGate feature="supplement"><Supplements /></PremiumGate></Layout>} />

        <Route path="/session/:id" element={<SessionPreview />} />
        <Route path="/tracker/:id" element={<WorkoutTracker />} />
        
        {/* ریدایرکت مسیرهای ناشناخته به داشبورد */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const continueToApp = () => setShowWelcome(false);

  return (
    <ThemeProvider>
      <AppProvider>
        <HashRouter>
          <AppContent showWelcome={showWelcome} onContinue={continueToApp} />
        </HashRouter>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
