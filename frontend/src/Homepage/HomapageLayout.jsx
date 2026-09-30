import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function HomepageLayout() {
  return (
    <div className="min-h-screen">
      <Navbar/>
      <main>
        <Outlet />
      </main>
      <Footer/>

    </div>
  );
}

export default HomepageLayout;