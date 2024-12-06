import { useState } from "react";
import { useModal } from "../../context/useModal";
import { useAppDispatch } from "../../store";
import { signupThunk } from "../../store/slices/sessionSlice";
import { PayloadAction } from "@reduxjs/toolkit";

function SignupFormModal() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState(
    {} as {
      email?: string;
      password?: string;
      confirmPassword?: string;
    }
  );
  const { closeModal } = useModal();

  const handleClientSideErrors = () => {
    const errors = {} as {
      password?: string;
      confirmPassword?: string;
    };

    if (password.length < 5) {
      errors.password = "Password must be at least 5 characters long";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword =
        "Confirm Password field must match Password field";
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const clientSideErrors = handleClientSideErrors();

    if (Object.values(clientSideErrors).length > 0) {
      return setErrors(clientSideErrors);
    }

    setErrors({});

    const serverResponse: PayloadAction<any> = await dispatch(
      signupThunk({
        email,
        name,
        password,
      })
    );

    if (serverResponse.payload) {
      setErrors({
        email: serverResponse.payload.errors?.email,
      });
    } else {
      closeModal();
    }
  };

  return (
    <>
      <h1>Sign Up</h1>
      <form className="form-container flex-col" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p className="error-text">{errors.email}</p>}
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className="error-text">{errors.password}</p>}
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && (
          <p className="error-text">{errors.confirmPassword}</p>
        )}
        <button type="submit">Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;
