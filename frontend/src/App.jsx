import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomepageLayout from "./Homepage/HomapageLayout";
import Hero from "./Homepage/Hero";
import About from "./Homepage/About";
import Contact from "./Homepage/Contact";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<HomepageLayout />}>
          <Route index element={<Hero />} />
        </Route>

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;