import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import MemberDetail from './pages/MemberDetail';
import { DataProvider } from './lib/DataContext';

export default function App() {
  return (
    <DataProvider>
      <div className="min-h-screen">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/member/:id" element={<MemberDetail />} />
          </Routes>
        </main>
        <footer className="text-center py-6 font-body text-xs text-[#3B2A4A]/50">
          Made with 🍭 · Berat Badan Tracker
        </footer>
      </div>
    </DataProvider>
  );
}
