import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import InteractiveParticles from './components/InteractiveParticles';

// Public pages
import Home from './pages/Home';
import Events from './pages/Events';
import Team from './pages/Team';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Achievements from './pages/Achievements';
import UpcomingEvents from './pages/UpcomingEvents';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

// Admin pages
import AdminLogin from './admin/Login';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import ManageEvents from './admin/ManageEvents';
import ManageTeam from './admin/ManageTeam';
import ManageAchievements from './admin/ManageAchievements';
import ManageGallery from './admin/ManageGallery';
import ManageHome from './admin/ManageHome';
import ManageAnnouncements from './admin/ManageAnnouncements';
import Settings from './admin/Settings';

import './index.css';

function App() {
  return (
    <Router>
      <div className="relative min-h-screen">
        <InteractiveParticles />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          } />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={
            <>
              <Navbar />
              <Profile />
              <Footer />
            </>
          } />

          <Route path="/events" element={
            <>
              <Navbar />
              <Events />
              <Footer />
            </>
          } />

          <Route path="/team" element={
            <>
              <Navbar />
              <Team />
              <Footer />
            </>
          } />

          <Route path="/about" element={
            <>
              <Navbar />
              <About />
              <Footer />
            </>
          } />

          <Route path="/gallery" element={
            <>
              <Navbar />
              <Gallery />
              <Footer />
            </>
          } />

          <Route path="/achievements" element={
            <>
              <Navbar />
              <Achievements />
              <Footer />
            </>
          } />

          <Route path="/upcoming" element={
            <>
              <Navbar />
              <UpcomingEvents />
              <Footer />
            </>
          } />

          <Route path="/contact" element={
            <>
              <Navbar />
              <Contact />
              <Footer />
            </>
          } />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="events" element={<ManageEvents />} />
            <Route path="team" element={<ManageTeam />} />
            <Route path="achievements" element={<ManageAchievements />} />
            <Route path="gallery" element={<ManageGallery />} />
            <Route path="home" element={<ManageHome />} />
            <Route path="announcements" element={<ManageAnnouncements />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
