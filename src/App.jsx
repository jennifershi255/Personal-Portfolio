import "./App.css";
import { NavBar } from "./components/NavBar";
import { Banner } from "./components/Banner";
import { About } from "./components/About";
import { Projects } from "./components/Projects";
import { Connect } from "./components/Connect";
import { Footer } from "./components/Footer";
import { Analytics } from "@vercel/analytics/react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Banner />
      <About />
      <Projects />
      <Connect />
      <Footer />
      <Analytics />
    </div>
  );
}

export default App;
