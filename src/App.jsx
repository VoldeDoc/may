import { lazy, Suspense } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import FallBack from "./components/Fallback";
import { ToastContainer } from "react-toastify";
import { AuthContextProvider } from "./context/AuthContex";
import { SubscriptionContextProvider } from "./context/SubscriptionContext";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { ApplicationContextProvider } from "./context/ApplicationContext";
import { JobContextProvider } from "./context/JobContext";
import { InterviewContextProvider } from "./context/InterviewContext";
import { NotificationContextProvider } from "./context/NotificationContext";
import InterviewRoom from "./components/video-sdk/InterviewRoom";
import { SessionContextProvider } from "./context/SessionContext";
import { ChatContextProvider } from "./context/ChatContext";

//Lazy imports of pages
const Login = lazy(() => import("./pages/Login"));
const AdminLogin = lazy(()=> import("./pages/AdminLogin"))
const AdminOTP = lazy(()=> import("./components/AdminAuth/AdminOTP"))
// const Registration = lazy(() => import("./pages/Registration"));
const RegistrationTwo = lazy(() => import("./pages/RegistrationTwo"));
const NotFound = lazy(() => import("./pages/404"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

//Lazy imports of routes
const RegistrationRoute = lazy(() => import("./routes/useRegistrationRoute"));
const ApplicantRoutes = lazy(() => import("./routes/useApplicantRoute"));
const CompanyRoutes = lazy(() => import("./routes/useCompanyRoute"));
const StaffRoutes = lazy(() => import("./routes/useStaffRoute"));
const AdminRoutes = lazy(() => import("./routes/useAdminRoute"));

//

function App() {
  return (
    <>
      <AuthContextProvider>
        <MantineProvider>
          <SubscriptionContextProvider>
            <ChatContextProvider>
              <ApplicationContextProvider>
                <JobContextProvider>
                  <InterviewContextProvider>
                    <NotificationContextProvider>
                      <Suspense fallback={<FallBack />}>
                        <Router>
                          <SessionContextProvider>
                            <Routes>
                              <Route path="/" element={<Login />} />
                              <Route path="/super/admin/login" element={<AdminLogin />} />
                              <Route path="/super/admin/otp-verification" element={<AdminOTP />} />

                              {/* <Route path="/registration" element={<Registration />} /> */}
                              <Route path="*" element={<NotFound />} />

                              {/* Dashboard Routes using the dashboard hook */}
                              {/* Other Routes can go here using thier hook e.g adminDashboardRoute */}
                              <Route
                                path="/applicant/*"
                                element={<ApplicantRoutes />}
                              />
                              <Route
                                path="/registration/*"
                                element={<RegistrationRoute />}
                              />
                              <Route
                                path="/company/*"
                                element={<CompanyRoutes />}
                              />
                              <Route
                                path="/staff/*"
                                element={<StaffRoutes />}
                              />
                              <Route
                                path="/admin/*"
                                element={<AdminRoutes />}
                              />

                              <Route
                                path="/interview-room"
                                element={<InterviewRoom />}
                              />
                              <Route
                                path="/forgot-password"
                                element={<ForgotPassword />}
                              />
                            </Routes>
                          </SessionContextProvider>
                        </Router>
                      </Suspense>
                    </NotificationContextProvider>
                  </InterviewContextProvider>
                  <ToastContainer autoClose={2000} draggable />
                </JobContextProvider>
              </ApplicationContextProvider>
            </ChatContextProvider>
          </SubscriptionContextProvider>
        </MantineProvider>
      </AuthContextProvider>
    </>
  );
}

export default App;
