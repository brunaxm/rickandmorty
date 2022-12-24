import { createBrowserRouter } from "react-router-dom";
import { Home, Menu, Characters, Locations, Episodes, EpisodesList, CharactersList } from "../screens";

// O createBrowserRouter cria as rotas da aplicação declaradas a seguir.
// A rota Menu é a única rota diferente, pois possui rotas filhas, dessa forma quando o usuário estiver nessa rota
// será sempre mostrado o que houver no componente Menu e o que houver no componente de uma das suas filhas dependendo 
// da rota completa.
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