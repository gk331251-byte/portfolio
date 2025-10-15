import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import StripeIntegration from './pages/demos/StripeIntegration';
import GCPArchitecture from './pages/demos/GCPArchitecture';
import APIExplorer from './pages/demos/APIExplorer';
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
              <Route path="/demos/api-explorer" element={<APIExplorer />} />
              <Route path="/demos/gcp-architecture" element={<GCPArchitecture />} />
              <Route path="/demos/stripe-integration" element={<StripeIntegration />} />

              {/* Catch-all: redirect unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
