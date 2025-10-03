import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FeedPage from './pages/FeedPage'; 
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute'; 
import CreateEventPage from './pages/CreateEventPage';
import EventDetailsPage from './pages/EventDetailsPage';
import Navbar from './components/layout/Navbar';
function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/events/new" element={<CreateEventPage />} />
            {/* We'll create Profile and Settings pages later */}
            <Route path="/profile" element={<div>Profile Page</div>} />
            <Route path="/settings" element={<div>Settings Page</div>} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;