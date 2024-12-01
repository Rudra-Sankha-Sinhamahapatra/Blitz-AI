import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Builder } from './pages/Builder';
import Glow from './components/Glow';
import { ThemeProvider } from './components/contexts/ThemeContexts';
import ThemeToggle from './components/ui/ThemeToggle';

function App() {
  return (
    <ThemeProvider>
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
    <Glow/>
    <ThemeToggle/>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<Builder />} />
      </Routes>
    </BrowserRouter>
    </div>
    </ThemeProvider>
  );
}

export default App;