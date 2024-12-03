import { useAppSelector, useAppDispatch } from "../../store";
import DisplayPosts from "../DisplayPosts";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { getUserThunk } from "../../store/slices/userSlice";
import type { LoadingState } from "../../types";
import { PayloadAction } from "@reduxjs/toolkit";
import UserDetails from "./UserDetails";
import "./UserProfilePage.css";

const UserProfilePage = () => {
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const [errors, setErrors] = useState({} as { serverError: string });
  const [userLoaded, setUserLoaded] = useState<LoadingState>("no");

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
      <DisplayPosts listOrCarousel="carousel" postsPerPageOrSlide={3} />
    </section>
  );
};

export default UserProfilePage;
