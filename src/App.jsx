import Procastinate from './pages/Procrastinate'
import Navbar from './components/Navbar';
import "bootswatch/dist/morph/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import Studies from './pages/Studies'


function App() {

  return (
    <>
      <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/procastinate" element={<Procastinate />} />
          <Route path="/studies" element={<Studies />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>

    </>
  )
}

export default App
