import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Public Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NotFound from "./pages/NotFound";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import FindMentorsPage from "./pages/student/FindMentorsPage";
import JobsPage from "./pages/student/JobsPage";
import PlacementInsightsPage from "./pages/student/PlacementInsightsPage";
import StudentProfilePage from "./pages/student/StudentProfilePage";
import CompanyReviewsPage from "./pages/student/CompanyReviewsPage";
import MyMentorshipsPage from "./pages/student/MyMentorshipsPage";
import MeetingsPage from "./pages/student/MeetingsPage";

// Alumni Pages
import AlumniDashboard from "./pages/alumni/AlumniDashboard";
import MentorshipRequestsPage from "./pages/alumni/MentorshipRequestsPage";
import PostJobPage from "./pages/alumni/PostJobPage";
import PostReviewPage from "./pages/alumni/PostReviewPage";
import AlumniProfilePage from "./pages/alumni/AlumniProfilePage";
import ScheduleMeetingPage from "./pages/alumni/ScheduleMeetingPage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Student Routes */}
            <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/mentors" element={<ProtectedRoute allowedRoles={["student"]}><FindMentorsPage /></ProtectedRoute>} />
            <Route path="/student/jobs" element={<ProtectedRoute allowedRoles={["student"]}><JobsPage /></ProtectedRoute>} />
            <Route path="/student/insights" element={<ProtectedRoute allowedRoles={["student"]}><PlacementInsightsPage /></ProtectedRoute>} />
            <Route path="/student/reviews" element={<ProtectedRoute allowedRoles={["student"]}><CompanyReviewsPage /></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute allowedRoles={["student"]}><StudentProfilePage /></ProtectedRoute>} />
            <Route path="/student/meetings" element={<ProtectedRoute allowedRoles={["student"]}><MeetingsPage /></ProtectedRoute>} />
            {/* Placeholder routes */}
            <Route path="/student/mentorships" element={<ProtectedRoute allowedRoles={["student"]}><MyMentorshipsPage /></ProtectedRoute>} />

            {/* Alumni Routes */}
            <Route path="/alumni/dashboard" element={<ProtectedRoute allowedRoles={["alumni"]}><AlumniDashboard /></ProtectedRoute>} />
            <Route path="/alumni/mentorships" element={<ProtectedRoute allowedRoles={["alumni"]}><MentorshipRequestsPage /></ProtectedRoute>} />
            <Route path="/alumni/post-job" element={<ProtectedRoute allowedRoles={["alumni"]}><PostJobPage /></ProtectedRoute>} />
            <Route path="/alumni/post-review" element={<ProtectedRoute allowedRoles={["alumni"]}><PostReviewPage /></ProtectedRoute>} />
            <Route path="/alumni/schedule-meeting" element={<ProtectedRoute allowedRoles={["alumni"]}><ScheduleMeetingPage /></ProtectedRoute>} />
            <Route path="/alumni/profile" element={<ProtectedRoute allowedRoles={["alumni"]}><AlumniProfilePage /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/verify" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/meetings" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/jobs" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/reviews" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/stats" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />

            {/* Redirects for base paths */}
            <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
            <Route path="/alumni" element={<Navigate to="/alumni/dashboard" replace />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
