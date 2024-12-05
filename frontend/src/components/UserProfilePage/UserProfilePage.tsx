import { useAppSelector, useAppDispatch } from "../../store";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { getUserThunk } from "../../store/slices/userSlice";
import type { LoadingState } from "../../types";
import { PayloadAction } from "@reduxjs/toolkit";
import UserDetails from "./UserDetails";
import "./UserProfilePage.css";
import PostsCarousel from "../PostsCarousel";

const UserProfilePage = () => {
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const sessionUser = useAppSelector((state) => state.session.sessionUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [errors, setErrors] = useState({} as { serverError: string });
  const [userLoaded, setUserLoaded] = useState<LoadingState>("no");

  if (!sessionUser) {
    navigate("/");
    return <></>;
  }

  if (userLoaded === "no") {
    setUserLoaded("loading");
  } else if (userLoaded === "loading") {
    dispatch(getUserThunk(Number(id))).then((response) => {
      const serverResponse: PayloadAction<any> = response;
      if (response.payload) {
        setErrors({ serverError: serverResponse.payload.message });
      }
      setUserLoaded("response");
    });
  } else if (userLoaded === "response") {
    if (errors.serverError) {
      return <h1 className="error-text">{errors.serverError}</h1>;
    }
    setUserLoaded("finished");
  }

  if (!currentUser) {
    return <h1>Loading...</h1>;
  }

  return (
    <section className="user-profile-page main-container flex-col">
      <UserDetails />
      <PostsCarousel />
    </section>
  );
};

export default UserProfilePage;
