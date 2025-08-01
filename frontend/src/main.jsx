"use strict";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from '@pages/Root';
import Home from '@pages/Home';
import Login from '@pages/Login';
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import Users from '@pages/Users';
import Profile from '@pages/Profile';
import ProtectedRoute from '@components/ProtectedRoute';
import Finanzas from '@pages/Finanzas';
import Votaciones from '@pages/Votaciones';
import PreguntasVotacion from '@pages/PreguntasVotacion';
import PreguntasResponder from '@pages/PreguntasResponder';
import Eventos from '@pages/Eventos';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/users",
        element: (
          <ProtectedRoute allowedRoles={["administrador", "presidente", "secretario", "tesorero"]}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/eventos",
        element: <Eventos />,
      },
      {
        path: "/votaciones",
        element: <Votaciones />,
      },

      {
        path: "/preguntas-votacion/:votacionId",
        element: <PreguntasVotacion />,
      },
      {
        path: "/preguntas-responder/:votacionId",
        element: <PreguntasResponder />,
      },

      {
        path: "/finanzas",
        element: (
          <ProtectedRoute allowedRoles={["tesorero", "secretario", "presidente"]}>
            <Finanzas />
          </ProtectedRoute>
        ),
      }
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
