import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ThankYou from "./pages/ThankYou";
import AdminPanel from "./pages/AdminPanel";
import "./App.css";

function ProtectedRoute({ children }) {
  const user = localStorage.getItem("fw_user");
  return user ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<Login />} />
        <Route path="/signup"   element={<Signup />} />
        <Route path="/home"     element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/thankyou" element={<ProtectedRoute><ThankYou /></ProtectedRoute>} />
        <Route path="/admin"    element={<AdminPanel />} />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
