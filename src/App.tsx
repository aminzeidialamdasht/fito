import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
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
import CalendarPage from './pages/Calendar';
import Progress from './pages/Progress';
import { SubscriptionProvider } from './subscription/SubscriptionContext';
import PremiumGate from './subscription/PremiumGate';

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
          {showWelcome ? <Welcome onContinue={continueToApp} /> : (
            // تغییر موقت: فقط داشبورد داخل Layout باشد، بقیه صفحات بیرون
            <>
              <Routes>
                <Route path="/" element={<Layout><Dashboard /></Layout>} />
                <Route path="/profile" element={<Layout><Profile /></Layout>} />
                
                {/* صفحات بدون Layout برای تست */}
                <Route path="/workout" element={<WorkoutTracker />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/calendar" element={<CalendarPage />} />
                
                <Route path="/prompt" element={<Layout><PremiumGate title="تولید پرامپت"><PromptGenerator /></PremiumGate></Layout>} />
                <Route path="/import" element={<Layout><PremiumGate title="ورود برنامه تمرینی"><ProgramImport /></PremiumGate></Layout>} />
                <Route path="/nutrition" element={<Layout><Nutrition /></Layout>} />
                <Route path="/nutrition-import" element={<Layout><PremiumGate title="ورود برنامه تغذیه"><NutritionImport /></PremiumGate></Layout>} />
                <Route path="/supplements" element={<Layout><Supplements /></Layout>} />
                <Route path="/supplement-import" element={<Layout><PremiumGate title="ورود برنامه مکمل"><SupplementImport /></PremiumGate></Layout>} />
              </Routes>
            </>
          )}
        </HashRouter>
      </AppProvider>
      </SubscriptionProvider>
    </ThemeProvider>
  );
}

export default App;
