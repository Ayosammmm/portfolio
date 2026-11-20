import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { ReactLenis, useLenis } from 'lenis/react';

import Header from './partials/Header';
// import Footer from './partials/Footer';

export default function Layout() {
  const lenis = useLenis((lenis) => {
    // called every scroll
    // console.log(lenis)
  })

  return (
    <>
      <Header />
      <main id="content">
        <ReactLenis root />
        <Outlet />
      </main>
      {/* <Footer /> */}
    </>
  );
}
