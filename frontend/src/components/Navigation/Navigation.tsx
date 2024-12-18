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
    <header className="header">
      <nav className="nav-bar flex-row main-container">
        <div className="nav-left">
          <Link className="title-font logo-text" to="/#skip-intro">
            LocalWild
          </Link>
        </div>
        {sessionUser && (
          <div className="nav-center flex-row">
            {/* <NavLink to="/my-favorites">My Favorites</NavLink> */}
            <NavLink to={`/users/${sessionUser.id}`}>My Profile</NavLink>
            <NavLink to="/my-posts">My Posts</NavLink>
          </div>
        )}

        <div className="nav-right flex-row">
          {!sessionUser ? (
            <div className="signup-login-buttons flex-row">
              <OpenModalButton
                buttonText="Sign Up"
                modalComponent={<SignupFormModal />}
                classes="signup-button"
              />
              <OpenModalButton
                buttonText="Login"
                modalComponent={<LoginFormModal />}
                classes="login-out-button"
              />
            </div>
          ) : (
            <>
              <Link className="new-post-button" to="/posts/new">
                Post
              </Link>
              <button className="login-out-button" onClick={handleLogOut}>
                Log Out
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
