import { NavLink, Link } from "react-router-dom";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import "./Navigation.css";

const Navigation = () => {
  return (
    <nav className="nav-bar flex-row">
      <div className="nav-left">
        <Link to="/">localWild Logo</Link>
      </div>
      <div className="nav-center">
        <NavLink to="/my-favorites">My Favorites</NavLink>
        <NavLink to="/my-profile">My Profile</NavLink>
        <NavLink to="/my-posts">My Posts</NavLink>
      </div>
      <div className="nav-right">
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
        <OpenModalButton
          buttonText="Login"
          modalComponent={<LoginFormModal />}
        />
      </div>
    </nav>
  );
};

export default Navigation;
