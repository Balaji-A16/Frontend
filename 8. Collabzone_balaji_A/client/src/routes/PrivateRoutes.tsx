import { useRoutes } from "react-router-dom";
import PrivateLayout from "layout/PrivateLayout";
import Home from "pages/home/Home";
import Profile from "pages/profile/Profile";
import Chat from "pages/chat/Chat";
import Friends from "pages/friends/Friends";
import Peoples from "pages/peoples/Peoples";

export default function PrivateRouter() {
  const routes = useRoutes([
    {
      path: "/",
      element: <PrivateLayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "friends", element: <Friends /> },
        { path: "profile", element: <Profile /> },
        { path: "peoples", element: <Peoples /> },
        { path: "chat", element: <Chat /> },
      ],
    },
  ]);
  return routes;
}
