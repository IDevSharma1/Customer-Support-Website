import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboard from "./pages/UserDashboard";
import AdminTicketsPage from "./pages/AdminTicketsPage";
import TicketDetailPage from "./pages/TicketDetailPage";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<UserDashboard />} />
        <Route path="/tickets/:id" element={<TicketDetailPage />} />
      </Route>

      <Route element={<ProtectedRoute requireAdmin={true} />}>
        <Route path="/admin/tickets" element={<AdminTicketsPage />} />
      </Route>
    </Routes>
  );
};

export default App;
