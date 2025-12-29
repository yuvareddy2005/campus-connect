import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FeedPage from './pages/FeedPage'; 
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute'; 
import CreateEventPage from './pages/CreateEventPage';
import EventDetailsPage from './pages/EventDetailsPage';
import Navbar from './components/layout/Navbar';
import ClubListPage from './pages/ClubListPage';
import ClubDetailsPage from './pages/ClubDetailsPage';
import CreateClubPage from './pages/CreateClubPage';
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
            <Route path="/profile" element={<div>Profile Page</div>} />
            <Route path="/settings" element={<div>Settings Page</div>} />
            <Route path="/clubs" element={<ClubListPage />} />
            <Route path="/clubs/new" element={<CreateClubPage />} />
            <Route path="/clubs/:id" element={<ClubDetailsPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;