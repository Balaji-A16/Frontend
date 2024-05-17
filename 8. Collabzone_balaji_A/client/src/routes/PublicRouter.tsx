import { Navigate, useRoutes } from "react-router-dom";
import AuthLayout from "src/layout/AuthLayout";
import Login from "pages/login";

export default function PublicRouter() {
  const routes = useRoutes([
    {
      path: "/",
      element: <AuthLayout />,
      children: [
        { element: <Login />, index: true },
        { path: "*", element: <Navigate to="/" /> },
      ],
    },
  ]);

  return routes;
}
