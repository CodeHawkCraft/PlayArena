import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { CookiesProvider } from 'react-cookie';
import Hero from "./Components/Hero";
import Games from "./Components/Games";
import GameMapper from "./Components/GameMapper";
import AppContext from './contexts/Context';
import { useReducer } from 'react'
import { initGameState, socketInitialState } from "./helpers";
import { Toaster } from "react-hot-toast";
import socketContext from "./contexts/SocketContext";
import { reducer, socketReducer } from "./reducer/reducer";
import ErrorPage from "./Components/ErrorPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Hero></Hero>,
  },
  {
    path: "games",
    element: <Games></Games>,
  },
  {
    path: "game/:id",
    element: <GameMapper></GameMapper>,
  },
  {
    path:'*',
    element:<ErrorPage></ErrorPage>
  }
]);

function App() {
  const [appState,dispatch]=useReducer(reducer,initGameState)
  const [socketState,socketDispatch]=useReducer(socketReducer,socketInitialState)
  const providerState = {
    appState,
    dispatch
}
const socketProvidedState={
  socketState,
  socketDispatch
}
  return (

    <CookiesProvider defaultSetOptions={{ path: '/' }}>

    <socketContext.Provider value={socketProvidedState}>
    <AppContext.Provider value={providerState}>
     <Toaster />
    <div className="h-full homeDiv flex items-center relative w-full">
      <RouterProvider router={router} />
    </div>
    </AppContext.Provider>
    </socketContext.Provider>
    </CookiesProvider>
  );
}

export default App;
