import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import StripeIntegration from './pages/demos/StripeIntegration';
import GCPArchitecture from './pages/demos/GCPArchitecture';
import APIExplorer from './pages/demos/APIExplorer';
import OnboardingAutomation from './pages/demos/OnboardingAutomation';
import CustomerHealthDashboard from './pages/demos/CustomerHealthDashboard';
import RoamioPlatform from './pages/demos/RoamioPlatform';
import AnalyticsDashboard from './pages/AnalyticsDashboard';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="/demos/stripe-integration" element={<StripeIntegration />} />
              <Route path="/demos/gcp-architecture" element={<GCPArchitecture />} />
              <Route path="/demos/api-explorer" element={<APIExplorer />} />
              <Route path="/demos/onboarding-automation" element={<OnboardingAutomation />} />
              <Route path="/demos/customer-health-dashboard" element={<CustomerHealthDashboard />} />
              <Route path="/demos/roamio-platform" element={<RoamioPlatform />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
