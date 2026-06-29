import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Homepage from './pages/Homepage';
import Creations from './pages/Creations';
import MeContacter from './pages/MeContacter';
import PolitiqueSite from './pages/PolitiqueSite';
import NoPage from './pages/NoPage';
import Project from './pages/Project';
import Layout from './Layout'; // nouveau layout
import Dither from "./components/Dither";
import MyNoise from './components/MyNoise'
import './App.scss';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // 👈 Layout contenant Header et Footer
    children: [
      { index: true, element: <Homepage /> },
      { path: 'creations', element: <Creations /> },
      { path: 'creations/:slug', element: <Project /> },
      { path: 'contact', element: <MeContacter /> },
      { path: 'politique-site', element: <PolitiqueSite /> },
      { path: '*', element: <NoPage /> },
    ],
  },
]);


function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simule un chargement (ex: 1 seconde)
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);


  return (
    <>
      {
        loading ? '' : document.querySelector('.loader').classList.add('loaded')
      }
      <div className="fixed-bg">
        <Dither
          waveColor={[0.4, 0.4, 0.2]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
        />
        {/* <MyNoise
          // waveColor={[1, 0.4, 0.2]}
          waveColor={[0.5, 0.5, 0.5]}
          rampColors={[
            "rgba(70, 66, 65, 1)",  // ✔ pris en charge
            "rgba(121, 105, 86, 1)",          // ✔ pris en charge
            "rgba(216, 186, 120, 1)",           // ✔ pris en charge
            "rgba(255, 241, 112, 1)",    // ✔ déjà normalisé
          ]}
          enableMouseInteraction={false}
        /> */}
      </div>
      <div className="loader">
        {/* Personnalise le style ou l'animation ici */}
        Chargement...
      </div>
      <RouterProvider router={router} />
    </>
  );
}

export default App;