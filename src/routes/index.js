import { createBrowserRouter } from "react-router-dom";
import { Home, Menu, Characters, Locations, Episodes, EpisodesList, CharactersList } from "../screens";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "menu",
    element: <Menu />,
    children: [
        {
          path: "characteres",
          element: <Characters />,
        },
        {
          path: "locations",
          element: <Locations />,
        },
        {
          path: "episodes",
          element: <Episodes />,
        },
    ],
  },
  {
    path: "episodes/user/:name",
    element: <EpisodesList />,
  },
  {
    path: "characters/location/:name",
    element: <CharactersList />,
  },
  {
    path: "characters/episode/:name",
    element: <CharactersList />,
  },
]);