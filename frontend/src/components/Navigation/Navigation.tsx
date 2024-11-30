import { NavLink, Link } from "react-router-dom";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import "./Navigation.css";
import { useAppDispatch, useAppSelector } from "../../store";
import { logoutThunk } from "../../store/slices/sessionSlice";

const Navigation = () => {
  const sessionUser = useAppSelector((state) => state.session.sessionUser);
  const dispatch = useAppDispatch();

  const handleLogOut = async () => {
    await dispatch(logoutThunk());
  };
  return (
    <nav className="nav-bar flex-row main-container">
      <div className="nav-left">
        <Link to="/">localWild Logo</Link>
      </div>
      {sessionUser && (
        <div className="nav-center">
          <NavLink to="/my-favorites">My Favorites</NavLink>
          <NavLink to="/my-profile">My Profile</NavLink>
          <NavLink to="/my-posts">My Posts</NavLink>
        </div>
      )}

      <div className="nav-right">
        {!sessionUser ? (
          <>
            <OpenModalButton
              buttonText="Sign Up"
              modalComponent={<SignupFormModal />}
            />
            <OpenModalButton
              buttonText="Login"
              modalComponent={<LoginFormModal />}
            />
          </>
        ) : (
          <>
            <button onClick={handleLogOut}>Log Out</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
