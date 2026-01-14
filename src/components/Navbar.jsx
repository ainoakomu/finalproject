
import { Link } from "react-router-dom";

//navikointi ja sen tyylit on bootswatchilta
const Navbar = () => {

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/">
          My Calendar👾
        </Link>

        <Link to="/Procastinate" className="nav-link">
          Procrastinate 👾
        </Link>

        <Link to="/studies" className="nav-link">
          My Studies👾
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
