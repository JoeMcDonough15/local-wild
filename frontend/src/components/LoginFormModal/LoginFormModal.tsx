import { useState } from "react";
import { useModal } from "../../context/useModal";
import { useAppDispatch } from "../../store";
import { loginThunk } from "../../store/slices/sessionSlice";
import "./LoginFormModal.css";
import { PayloadAction } from "@reduxjs/toolkit";

function LoginFormModal() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({} as { credential?: string });
  const { closeModal } = useModal();

  const login = async (credential: { email: string; password: string }) => {
    const serverResponse: PayloadAction<any> = await dispatch(
      loginThunk(credential)
    );

    if (serverResponse.payload) {
      setErrors({ credential: serverResponse?.payload?.message });
    } else {
      closeModal();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await login({ email, password });
  };

  return (
    <>
      <h1 className="login-header">Log In</h1>
      {errors.credential && <p className="error-text">{errors.credential}</p>}
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
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Log In</button>
        <p
          onClick={() => {
            login({
              email: "alice@prisma.io",
              password: "myPassword",
            });
          }}
          className="demo-user"
        >
          Demo User
        </p>
      </form>
    </>
  );
}

export default LoginFormModal;
