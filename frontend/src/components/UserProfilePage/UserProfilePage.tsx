import { useAppSelector, useAppDispatch } from "../../store";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getUserThunk } from "../../store/slices/userSlice";
import UserDetails from "./UserDetails";
import "./UserProfilePage.css";
import PostsCarousel from "../PostsCarousel";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import EditProfileForm from "../EditProfileForm/EditProfileForm";

const UserProfilePage = () => {
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const sessionUser = useAppSelector((state) => state.session.sessionUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getUserThunk(Number(id)));
  }, [dispatch, id]);

  if (!sessionUser) {
    navigate("/");
    return <></>;
  }

  if (!currentUser) {
    return <h1 className="not-found">User Not Found.</h1>;
  }

  return (
    <section className="user-profile-page main-container flex-col">
      {sessionUser.id === Number(id) && (
        <OpenModalButton
          buttonText="Edit Profile"
          classes="edit-profile-button"
          modalComponent={<EditProfileForm />}
        />
      )}
      <UserDetails />
      <PostsCarousel />
    </section>
  );
};

export default UserProfilePage;
