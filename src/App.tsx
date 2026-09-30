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
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/prompt" element={<PremiumGate title="تولید پرامپت"><PromptGenerator /></PremiumGate>} />
                <Route path="/import" element={<PremiumGate title="ورود برنامه تمرینی"><ProgramImport /></PremiumGate>} />
                <Route path="/nutrition" element={<Nutrition />} />
                <Route path="/nutrition-import" element={<PremiumGate title="ورود برنامه تغذیه"><NutritionImport /></PremiumGate>} />
                <Route path="/supplements" element={<Supplements />} />
                <Route path="/supplement-import" element={<PremiumGate title="ورود برنامه مکمل"><SupplementImport /></PremiumGate>} />
                <Route path="/workout" element={<WorkoutTracker />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/progress" element={<Progress />} />
              </Routes>
            </Layout>
          )}
        </HashRouter>
      </AppProvider>
      </SubscriptionProvider>
    </ThemeProvider>
  );
}

export default App;
