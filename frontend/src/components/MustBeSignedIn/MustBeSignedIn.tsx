import { Link } from "react-router-dom";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import "./MustBeSignedIn.css";

const MustBeSignedIn = () => {
  return (
    <div className="not-signed-in">
      <h3 className="not-signed-in-header">
        You must be signed in to view a post up close!
      </h3>
      <div className="redirect-options flex-col">
        <div className="signup-login-buttons flex-row">
          <OpenModalButton
            buttonText="Create an account"
            modalComponent={<SignupFormModal />}
            classes="signup-button"
          />
          <OpenModalButton
            buttonText="Already a member"
            modalComponent={<LoginFormModal />}
            classes="login-out-button"
          />
        </div>
        <Link className="go-home-button" to="/home#skip-intro">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default MustBeSignedIn;
