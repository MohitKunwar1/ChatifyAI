import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layouts/RootLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Home from "./routes/home/Home.jsx";
import Dashboard from "./routes/dashboard/Dashboard.jsx";
import ChatPage from "./routes/chatpage/ChatPage.jsx"
import SignUpPage from "./routes/signup/SignUpPage.jsx";
import SignInPage from "./routes/signin/SignInPage.jsx";



const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/sign-up/*",
        element: <SignUpPage />
      },
      {
        path: "/sign-in/*",
        element: <SignInPage />
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/dashboard/chats/:id",
            element: <ChatPage />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
