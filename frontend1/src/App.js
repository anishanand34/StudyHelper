import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Schedule from "./pages/Schedule";
import Subjects from "./pages/Subjects";
import AIAssistant from "./pages/AIAssistant";
import ProfilePage from "./pages/ProfilePage";
 import ProgressPage from "./pages/ProgressPage";
import { UserProvider } from "./context/UserContext";

function Layout() {

  const location = useLocation();

  return (
    <>
      {/* Hide Navbar on Login/Signup page */}
      {location.pathname !== "/" && <Navbar />}

      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/ai" element={<AIAssistant />} />
        <Route path="/profile" element={<ProfilePage />} />
       
        <Route path="/progress" element={<ProgressPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    
    <BrowserRouter>
    <UserProvider>
      <Layout />
    </UserProvider>
    </BrowserRouter>
  
  );
}

export default App;