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
], { basename: import.meta.env.BASE_URL });


function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ancien chargement fictif (1 seconde), gardé pour réutilisation :
    // const timer = setTimeout(() => setLoading(false), 1000);
    // return () => clearTimeout(timer);

    let cancelled = false;

    // 1. Toutes les ressources de la page (images, CSS, scripts) : événement "load"
    const pageLoaded = new Promise((resolve) => {
      if (document.readyState === 'complete') resolve();
      else window.addEventListener('load', resolve, { once: true });
    });

    // 2. Les polices (Poppins, Fugaz One, préchargées dans index.html) :
    //    on force leur chargement pour ne pas masquer le loader avant leur arrivée.
    const ready = pageLoaded.then(() => {
      if (!document.fonts) return;
      return Promise.all([
        document.fonts.load('300 1em Poppins'),
        document.fonts.load('400 1em Poppins'),
        document.fonts.load('1em "Fugaz One"'),
      ])
        .catch(() => {})
        .then(() => document.fonts.ready);
    });

    // 3. Sécurité : on n'attend jamais plus de 8s, même si une ressource bloque
    const timeout = new Promise((resolve) => setTimeout(resolve, 8000));

    Promise.race([ready, timeout]).then(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  // Fin du chargement : masque le loader de index.html et prévient le reste du site
  useEffect(() => {
    // "is-loaded" sur <html> déclenche les animations .section-in
    document.documentElement.classList.toggle('is-loaded', !loading);
    if (loading) return;

    const loader = document.getElementById('loader');
    if (!loader) return;
    loader.classList.add('loaded');
    // Retire le loader du DOM une fois le fondu terminé
    const remove = () => loader.remove();
    loader.addEventListener('transitionend', remove, { once: true });
    const fallback = setTimeout(remove, 1000);
    return () => {
      loader.removeEventListener('transitionend', remove);
      clearTimeout(fallback);
    };
  }, [loading]);


  return (
    <>
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
      {/* Le loader est dans index.html (#loader) pour s'afficher avant tout le reste */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;