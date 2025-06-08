import { Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { TurfDetailsPage } from './pages/TurfDetailsPage';
import { BookingConfirmPage } from './pages/BookingConfirmPage';
import BookingsPage from './pages/BookingsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminPage } from './pages/AdminPage';

// Layout component for pages that need header and footer
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/search" element={<MainLayout><SearchPage /></MainLayout>} />
        <Route path="/turf/:id" element={<MainLayout><TurfDetailsPage /></MainLayout>} />
        <Route path="/booking-confirm/:id" element={<MainLayout><BookingConfirmPage /></MainLayout>} />
        <Route path="/bookings" element={<MainLayout><BookingsPage /></MainLayout>} />
        <Route path="/admin" element={<MainLayout><AdminPage /></MainLayout>} />
      </Routes>
    </div>
  );
}

export default App;