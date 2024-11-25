import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkSignup } from "../../redux/slices/sessionSlice";
import "./SignupForm.css";

const SignupFormModal = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState(
    {} as {
      email?: string;
      username?: string;
      password?: string;
      confirmPassword?: string;
      server?: string;
    }
  );

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    //     const serverResponse = await dispatch(
    //       thunkSignup({
    //         email,
    //         username,
    //         password,
    //       })
    //     );

    //     if (serverResponse) {
    //       setErrors(serverResponse);
    //     } else {

    //     }
    //   };

    return (
      <>
        <h1>Sign Up</h1>
        {errors.server && <p>{errors.server}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {errors.email && <p>{errors.email}</p>}
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          {errors.username && <p>{errors.username}</p>}
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.password && <p>{errors.password}</p>}
          <label>
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
          <button type="submit">Sign Up</button>
        </form>
      </>
    );
  };
};
export default SignupFormModal;