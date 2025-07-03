import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
// import { HashRouter } from 'react-router-dom';
import "./index.css";
import Signup from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
// import Header from "./Header";
import Footer from "./pages/Footer";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import CoursesPage from "./pages/CoursesPage"; // Assuming you have a Courses page
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import Checkout from "./pages/Checkout";
import ForgotPassword from "./pages/auth/forgotPassword"; // Uncomment if you have a forgot password page
import Blog from "./pages/Blog"; 
import FAQ from "./pages/FAQ"; // Assuming you have a FAQ page
import TermsOfService from "./pages/TermsOfService"; 
import Privacy from "./pages/privacy"; 
import Cookie from "./pages/cookie";
import Refund from "./pages/Refund"; 
import Resources from "./pages/Resources";
import Community from "./pages/Community"; 
import Instructors from "./pages/instructors"; 
// import ThemeTogglePage from "./pages/ThemeTogglePage"; // Assuming you have a theme toggle page
// import DownloadPage from "./pages/DownloadPage"; // Assuming you have a download page
import Setting from "./components/Setting"
import Notify  from "./components/NotifyCard"
// Admin
import AdminDashboardSidebar from "./components/AdminDashboardSidebar";
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from "./pages/admin/AdminStudents";
import AdminReports from "./pages/admin/AdminReports";
import PaymentSummary from "./pages/admin/PaymentSummary";
// import AdminCalendar from "./pages/admin/AdminCalendar";
import AdminCertificates from "./pages/admin/AdminCertificates";
import AdminNotify from "./pages/admin/AdminNotify";
import AdminQna from "./pages/admin/AdminQna"; // Assuming you have a Q&A page for teachers
import AdminSettingCard from "./pages/admin/AdminSettingCard"; // Assuming you have a settings page for admin
import AdminDownloadPageCard from "./pages/admin/AdminDownloadPageCard"; // Assuming you have a download page
import AdminManagement from "./pages/admin/AdminManagement"; // Assuming you have a management page
// Teacher
import TeacherDashboardSidebar from "./components/TeacherDashboardSidebar";
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherCourses from "./pages/teacher/TeacherCourses";
import TeacherLessons from "./pages/teacher/TeacherLessons";
import TeacherEnrollments from "./pages/teacher/TeacherEnrollments";
import TeacherCertificates from "./pages/teacher/TeacherCertificates";
// import TeacherCalendar from "./pages/teacher/TeacherCalendar";
import TeacherStudent from "./pages/teacher/TeacherStudent"; 
import TeacherQuiz from "./pages/teacher/TeacherQuiz"; 
import TeacherNotify from "./pages/teacher/TeacherNotify"; 
import TeacherQna from "./pages/teacher/TeacherQna"; 
import TeacherSettingCard from "./pages/teacher/TeacherSettingCard"; 
import TeacherGradeSubmissions from "./pages/teacher/TeacherGradeSubmissions"; // Assuming you have a page for grading submissions

// Student
import StudentDashboardSidebar from "./components/StudentDashboardSidebar";
import StudentDashboard from './pages/student/StudentDashboard';
import StudentFullCourses from "./pages/student/StudentFullCourses";
import StudentCourses from "./pages/student/StudentCourses";
import StudentQuizzes from "./pages/student/quiz/StudentQuizzes";
import StudentCertificates from "./pages/student/StudentCertificates";
import StudentProgress from "./pages/student/StudentProgress";
// import StudentCalendar from "./pages/student/StudentCalendar";
import StudentNotify from "./pages/student/StudentNotify"; 
import StudentQna from "./pages/student/StudentQna"; // Assuming you have a Q&A page for teachers
import StudentSettingCard from "./pages/student/StudentSettingCard";
import DownloadPage from "./pages/DownloadPage";
import StudentAssignmentSubmit from "./pages/student/StudentAssignmentSubmit"; // Assuming you have a page for assignment submission
// Providers
import { QueryClientProvider } from "@tanstack/react-query";
import ThemeProvider from "./lib/theme-provider";
import ThemeTogglePage from "./pages/ThemeTogglePage";
import CourseDetail from "./pages/CourseDetail";
import AssignmentDetail from "./pages/AssignmentDetail";
import LessonDetail from "./pages/LessonDetail";
import QuizDetail from "./pages/QuizDetail";

const LayoutWithSidebar = ({ Sidebar, children }) => (
  <div className="flex h-screen">
    <Sidebar />
    <div className="flex-1 overflow-y-auto ">
      {children}
      <Footer />
    </div>
  </div>
);

function App() {
  return (
        <AuthLayout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/Contact" element={<ContactPage />} />
            <Route path="/AboutPage" element={<AboutPage />} />
            <Route path="/ServicesPage" element={<ServicesPage />} />
            <Route path="/CoursesPage" element={<CoursesPage />} />
            <Route path="/checkout/:courseId" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/Blog" element={<Blog />} />
            <Route path="/FAQ" element={<FAQ />} />
            <Route path="/TermsOfService" element={<TermsOfService />} />
            <Route path="/Privacy" element={<Privacy />} />
            <Route path="/Cookie" element={<Cookie />} />
            <Route path="/Refund" element={<Refund />} />
            <Route path="/Resources" element={<Resources />} />
            <Route path="/Community" element={<Community />} />
            <Route path="/Instructors" element={<Instructors />} />
            <Route path="/Setting" element={<Setting />} />
            <Route path="/Notify" element={<Notify />} />
            {/* <Route path="/teacher/TeacherGradeSubmissions" element={<TeacherGradeSubmissions />} />  */}
            {/* <Route path="/StudentAssignmentSubmit" element={<StudentAssignmentSubmit />} />  */}

            {/* TeacherGradeSubmissions */}
            {/* <Route path="/ThemeTogglePage" element={<ThemeTogglePage />} /> */}
            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route
                path="/admin/dashboard"
                element={
                  <LayoutWithSidebar Sidebar={AdminDashboardSidebar}>
                    <AdminDashboard />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/admin/manage-users"
                element={
                  <LayoutWithSidebar Sidebar={AdminDashboardSidebar}>
                    <AdminStudents />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <LayoutWithSidebar Sidebar={AdminDashboardSidebar}>
                    <AdminReports />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/admin/Certificates"
                element={
                  <LayoutWithSidebar Sidebar={AdminDashboardSidebar}>
                    <AdminCertificates />
                  </LayoutWithSidebar>
                }
              />
              {/* <Route
                path="/admin/AdminCalendar"
                element={
                  <LayoutWithSidebar Sidebar={AdminDashboardSidebar}>
                    <AdminCalendar />
                  </LayoutWithSidebar>
                }
              /> */}
              <Route
                path="/admin/PaymentSummary"
                element={
                  <LayoutWithSidebar Sidebar={AdminDashboardSidebar}>
                    <PaymentSummary />
                  </LayoutWithSidebar>
                }
              />
              
               <Route
                path="/admin/notifications"
                element={
                  <LayoutWithSidebar Sidebar={AdminDashboardSidebar}>
                    <AdminNotify />
                  </LayoutWithSidebar>
                }
              />
               <Route
                path="/admin/questions"
                element={
                  <LayoutWithSidebar Sidebar={AdminDashboardSidebar}>
                    <AdminQna />
                  </LayoutWithSidebar>
                }
              />
                  <Route
                path="/admin/DownloadPage"
                element={
                  <LayoutWithSidebar Sidebar={AdminDashboardSidebar}>
                    <AdminDownloadPageCard />
                  </LayoutWithSidebar>
                }
              />
                <Route
                path="/admin/management"
                element={
                  <LayoutWithSidebar Sidebar={AdminDashboardSidebar}>
                    <AdminManagement />
                  </LayoutWithSidebar>
                }
              />
                <Route
                path="/admin/settings"
                element={
                  <LayoutWithSidebar Sidebar={AdminDashboardSidebar}>
                    <AdminSettingCard />
                  </LayoutWithSidebar>
                }
              />
            </Route>

            {/* Teacher Routes */}
            <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
              <Route
                path="/teacher/dashboard"
                element={
                  <LayoutWithSidebar Sidebar={TeacherDashboardSidebar}>
                    <TeacherDashboard />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/teacher/courses"
                element={
                  <LayoutWithSidebar Sidebar={TeacherDashboardSidebar}>
                    <TeacherCourses />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/teacher/add-lessons"
                element={
                  <LayoutWithSidebar Sidebar={TeacherDashboardSidebar}>
                    <TeacherLessons />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/teacher/enrollments"
                element={
                  <LayoutWithSidebar Sidebar={TeacherDashboardSidebar}>
                    <TeacherEnrollments />
                  </LayoutWithSidebar>
                }
              />
             
              <Route
                path="/teacher/Certificates"
                element={
                  <LayoutWithSidebar Sidebar={TeacherDashboardSidebar}>
                    <TeacherCertificates />
                  </LayoutWithSidebar>
                }
              />
              {/* <Route
                path="/teacher/TeacherCalendar"
                element={
                  <LayoutWithSidebar Sidebar={TeacherDashboardSidebar}>
                    <TeacherCalendar />
                  </LayoutWithSidebar>
                }
              /> */}
              <Route
                path="/teacher/students"
                element={
                  <LayoutWithSidebar Sidebar={TeacherDashboardSidebar}>
                    <TeacherStudent />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/teacher/quiz"
                element={
                  <LayoutWithSidebar Sidebar={TeacherDashboardSidebar}>
                    <TeacherQuiz />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/teacher/TeacherGradeSubmissions"
                element={
                  <LayoutWithSidebar Sidebar={TeacherDashboardSidebar}>
                    <TeacherGradeSubmissions />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/teacher/questions"
                element={
                  <LayoutWithSidebar Sidebar={TeacherDashboardSidebar}>
                    <TeacherQna/>
                  </LayoutWithSidebar>
                }
              />
               <Route
                path="/teacher/notifications"
                element={
                  <LayoutWithSidebar Sidebar={TeacherDashboardSidebar}>
                    <TeacherNotify />
                  </LayoutWithSidebar>
                }
              />
               <Route
                path="/teacher/settings"
                element={
                  <LayoutWithSidebar Sidebar={TeacherDashboardSidebar}>
                    <TeacherSettingCard />
                  </LayoutWithSidebar>
                }
              />
            </Route>
            

            {/* Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
              <Route
                path="/student/dashboard"
                element={
                  <LayoutWithSidebar Sidebar={StudentDashboardSidebar}>
                    <StudentDashboard />
                  </LayoutWithSidebar>
                }
              />
               <Route
                path="/student/all-courses"
                element={
                  <LayoutWithSidebar Sidebar={StudentDashboardSidebar}>
                    <StudentFullCourses />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/student/courses"
                element={
                  <LayoutWithSidebar Sidebar={StudentDashboardSidebar}>
                    <StudentCourses />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/student/progress"
                element={
                  <LayoutWithSidebar Sidebar={StudentDashboardSidebar}>
                    <StudentProgress />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/student/quizzes"
                element={
                  <LayoutWithSidebar Sidebar={StudentDashboardSidebar}>
                    <StudentQuizzes />
                  </LayoutWithSidebar>
                }
              />
                  <Route               
                  path="/student/StudentAssignmentSubmit"
                element={
                  <LayoutWithSidebar Sidebar={StudentDashboardSidebar}>
                    <StudentAssignmentSubmit />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/student/certificates"
                element={
                  <LayoutWithSidebar Sidebar={StudentDashboardSidebar}>
                    <StudentCertificates />
                  </LayoutWithSidebar>
                }
              />
              {/* <Route
                path="/student/StudentCalendar"
                element={
                  <LayoutWithSidebar Sidebar={StudentDashboardSidebar}>
                    <StudentCalendar />
                  </LayoutWithSidebar>
                }
              /> */}
                <Route
                path="/student/questions"
                element={
                  <LayoutWithSidebar Sidebar={StudentDashboardSidebar}>
                    <StudentQna />
                  </LayoutWithSidebar>
                }
              />
              <Route
                path="/student/notifications"
                element={
                  <LayoutWithSidebar Sidebar={StudentDashboardSidebar}>
                  <StudentNotify />
                  </LayoutWithSidebar>
                }
              />
                <Route
                path="/student/DownloadPage"
                element={
                  <LayoutWithSidebar Sidebar={StudentDashboardSidebar}>
                    <DownloadPage/>
                  </LayoutWithSidebar>
                }
              />
               <Route
                path="/student/settings"
                element={
                  <LayoutWithSidebar Sidebar={StudentDashboardSidebar}>
                    <StudentSettingCard />
                  </LayoutWithSidebar>
                }
              />
            </Route>
            <Route path="/theme-toggle" element={<ThemeTogglePage />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/assignments/:id" element={<AssignmentDetail />} />
            <Route path="/lessons/:id" element={<LessonDetail />} />
            <Route path="/quizzes/:id" element={<QuizDetail />} />
          </Routes>
          <ToastContainer autoClose={1000} />
        </AuthLayout>
  );
}

export default App;