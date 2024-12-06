import { useAppSelector, useAppDispatch } from "../../store";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getUserThunk } from "../../store/slices/userSlice";
import UserDetails from "./UserDetails";
import "./UserProfilePage.css";
import PostsCarousel from "../PostsCarousel";

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
    navigate("/#skip-intro");
    return <></>;
  }

  if (!currentUser) {
    return <h1 className="not-found">User Not Found.</h1>;
  }

  return (
    <section className="user-profile-page main-container flex-col">
      <UserDetails />
      <PostsCarousel />
    </section>
  );
};

export default UserProfilePage;
