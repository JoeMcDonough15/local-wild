import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store";
import DisplayPosts from "../DisplayPosts";
import { useEffect } from "react";
import { userSlice } from "../../store/slices/userSlice";
import "./MyPostsPage.css";

const MyPostsPage = (): JSX.Element => {
  const sessionUser = useAppSelector((state) => state.session.sessionUser);
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionUser) return;
    dispatch(userSlice.actions.setCurrentUser(sessionUser));
  }, [dispatch, sessionUser]);

  if (!sessionUser) {
    navigate("/#skip-intro");
    return <></>;
  }

  if (!currentUser) {
    return <></>;
  }

  return (
    <section className="my-posts-page flex-row">
      <DisplayPosts listOrCarousel="list" postsPerPageOrSlide={4} />
    </section>
  );
};

export default MyPostsPage;
