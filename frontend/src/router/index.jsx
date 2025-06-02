import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";
import About from "../pages/About";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CreatePlan from "../pages/CreatePlan";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Events from "../pages/Events";
import Profile from "../pages/Profile";
import EventDetails from "../pages/EventDetails";
import AdminDashboard from "../pages/AdminDashboard";
import AdminRoute from "../components/auth/AdminRoute";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "create-event",
        element: (
            <ProtectedRoute>
                <CreatePlan />
            </ProtectedRoute>
        )
      },
      {
        path: "profile",
        element: (
            <ProtectedRoute>
                <Profile />
            </ProtectedRoute>
        )
      },
      {
        path: "events",
        element: <Events />,
      },
      {
        path: "events/:id",
        element: <EventDetails />,
      },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
    ],
  },
]);

export default router;
